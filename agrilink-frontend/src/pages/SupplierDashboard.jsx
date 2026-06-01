import { useState, useEffect, useCallback } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import StatCard from '../components/ui/StatCard';
import Modal from '../components/ui/Modal';
import { useAuth } from '../context/AuthContext';
import {
  getMySupplies, createSupply, updateSupply, deleteSupply
} from '../services/supplyService';

const EMPTY_FORM = {
  name: '', category: 'seeds', quantity: '', unit: 'kg',
  pricePerUnit: '', location: '', description: '', status: 'available'
};

const statusColors = {
  available:    'bg-green-100 text-green-700',
  out_of_stock: 'bg-red-100 text-red-700',
};

export default function SupplierDashboard() {
  const { user } = useAuth();
  const [supplies, setSupplies]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [modalOpen, setModalOpen]     = useState(false);
  const [editTarget, setEditTarget]   = useState(null);
  const [form, setForm]               = useState(EMPTY_FORM);
  const [submitting, setSubmitting]   = useState(false);

  const fetchSupplies = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getMySupplies();
      setSupplies(res.data.data.supplies);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { fetchSupplies(); }, [fetchSupplies]);

  const openCreate = () => { setEditTarget(null); setForm(EMPTY_FORM); setModalOpen(true); };
  const openEdit   = (item) => { setEditTarget(item); setForm({ ...item }); setModalOpen(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editTarget) {
        await updateSupply(editTarget._id, form);
      } else {
        await createSupply(form);
      }
      setModalOpen(false);
      fetchSupplies();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this supply?')) return;
    await deleteSupply(id);
    fetchSupplies();
  };

  const available = supplies.filter(s => s.status === 'available').length;

  return (
    <DashboardLayout title="Supplier Dashboard">
      <div className="bg-yellow-600 text-white rounded-2xl px-6 py-5 mb-6">
        <h2 className="text-xl font-bold">Welcome, {user?.name} 👋</h2>
        <p className="text-yellow-100 text-sm mt-1">Manage your supply catalogue and inventory.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Listings"    value={supplies.length}  icon="🏭" color="yellow" />
        <StatCard label="Available"         value={available}         icon="✅" color="green"  />
        <StatCard label="Out of Stock"      value={supplies.length - available} icon="❌" color="red" />
        <StatCard label="Categories"        value={[...new Set(supplies.map(s => s.category))].length} icon="📂" color="blue" />
      </div>

      <div className="bg-white rounded-xl border shadow-sm p-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-gray-700">My Supply Catalogue</h3>
          <button
            onClick={openCreate}
            className="bg-yellow-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-yellow-700 transition"
          >
            + Add Supply
          </button>
        </div>

        {loading ? (
          <p className="text-gray-400 text-sm">Loading...</p>
        ) : supplies.length === 0 ? (
          <p className="text-gray-400 text-sm">No supplies listed yet. Add your first item.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b">
                  <th className="pb-2">Item</th>
                  <th className="pb-2">Category</th>
                  <th className="pb-2">Qty</th>
                  <th className="pb-2">Price/Unit</th>
                  <th className="pb-2">Location</th>
                  <th className="pb-2">Status</th>
                  <th className="pb-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {supplies.map(item => (
                  <tr key={item._id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="py-3 font-medium">{item.name}</td>
                    <td className="py-3 capitalize text-gray-500">{item.category}</td>
                    <td className="py-3">{item.quantity} {item.unit}</td>
                    <td className="py-3">KES {item.pricePerUnit}</td>
                    <td className="py-3">{item.location}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[item.status]}`}>
                        {item.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 flex gap-2">
                      <button onClick={() => openEdit(item)} className="text-blue-600 hover:underline text-xs">Edit</button>
                      <button onClick={() => handleDelete(item._id)} className="text-red-500 hover:underline text-xs">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editTarget ? 'Edit Supply' : 'Add New Supply'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { label: 'Item Name',  key: 'name',         type: 'text'   },
            { label: 'Location',   key: 'location',     type: 'text'   },
            { label: 'Quantity',   key: 'quantity',     type: 'number' },
            { label: 'Price/Unit (KES)', key: 'pricePerUnit', type: 'number' },
          ].map(({ label, key, type }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
              <input
                type={type}
                value={form[key]}
                onChange={e => setForm({ ...form, [key]: e.target.value })}
                required
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>
          ))}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
              >
                {['seeds','fertilizers','pesticides','equipment','packaging','other'].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
              <select
                value={form.unit}
                onChange={e => setForm({ ...form, unit: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
              >
                {['kg','litres','pieces','bags','boxes'].map(u => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={form.status}
              onChange={e => setForm({ ...form, status: e.target.value })}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              <option value="available">Available</option>
              <option value="out_of_stock">Out of Stock</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-yellow-600 text-white py-2.5 rounded-lg font-semibold hover:bg-yellow-700 disabled:opacity-60 transition"
          >
            {submitting ? 'Saving...' : editTarget ? 'Update Supply' : 'Add Supply'}
          </button>
        </form>
      </Modal>
    </DashboardLayout>
  );
}