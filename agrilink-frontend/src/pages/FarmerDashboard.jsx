import { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import StatCard from '../components/ui/StatCard';
import Modal from '../components/ui/Modal';
import { useAuth } from '../context/AuthContext';
import {
  getMyListings, createListing, updateListing, deleteListing
} from '../services/produceService';
import { getIncomingOrders, updateOrderStatus } from '../services/orderService';

// 🚨 FIX 1: Changed key from 'pricePerUnit' to 'price' to align with Mongoose
const EMPTY_FORM = {
  name: '', category: 'vegetables', quantity: '', unit: 'kg',
  price: '', location: '', description: '' 
};

export default function FarmerDashboard() {
  const { user } = useAuth();
  const [listings, setListings]         = useState([]);
  const [orders, setOrders]             = useState([]);
  const [loading, setLoading]           = useState(true);
  const [modalOpen, setModalOpen]       = useState(false);
  const [editTarget, setEditTarget]     = useState(null);
  const [form, setForm]                 = useState(EMPTY_FORM);
  const [submitting, setSubmitting]     = useState(false);
  const [activeTab, setActiveTab]       = useState('listings');
  const [error, setError]               = useState(''); // Added to surface backend validation bugs in UI

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [lRes, oRes] = await Promise.all([getMyListings(), getIncomingOrders()]);
      setListings(lRes.data.data.produce);
      setOrders(oRes.data.data.orders);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const load = async () => { await fetchAll(); };
    load();
  }, []);

  const openCreate = () => { setError(''); setEditTarget(null); setForm(EMPTY_FORM); setModalOpen(true); };
  const openEdit   = (item) => { setError(''); setEditTarget(item); setForm({ ...item }); setModalOpen(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    // 🚨 FIX 2: Sanitize types and transform inputs into actual numbers before dispatching
    const payload = {
      ...form,
      price: Number(form.price),
      quantity: Number(form.quantity)
    };

    try {
      if (editTarget) {
        await updateListing(editTarget._id, payload);
      } else {
        await createListing(payload);
      }
      setModalOpen(false);
      fetchAll();
    } catch (err) {
      console.error("Dashboard Submission Error:", err);
      // Grabs the exact Mongoose error string you saw in the response log
      setError(err.response?.data?.message || 'Failed to preserve listing configurations.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this listing?')) return;
    await deleteListing(id);
    fetchAll();
  };

  const handleOrderStatus = async (orderId, status) => {
    await updateOrderStatus(orderId, status);
    fetchAll();
  };

  const revenue = orders
    .filter(o => o.status === 'delivered')
    .reduce((sum, o) => sum + o.totalPrice, 0);

  const statusColors = {
    pending:   'bg-yellow-100 text-yellow-700',
    confirmed: 'bg-blue-100 text-blue-700',
    delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
  };

  return (
    <DashboardLayout title="Farmer Dashboard">
      {/* Welcome Banner */}
      <div className="bg-green-700 text-white rounded-2xl px-6 py-5 mb-6">
        <h2 className="text-xl font-bold">Welcome back, {user?.fullName || user?.name} 👋</h2>
        <p className="text-green-200 text-sm mt-1">Manage your listings and incoming orders.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Active Listings"  value={listings.filter(l => l.status === 'available').length} icon="🌾" color="green"  />
        <StatCard label="Pending Orders"   value={orders.filter(o => o.status === 'pending').length}     icon="📦" color="yellow" />
        <StatCard label="Total Orders"     value={orders.length}                                          icon="📋" color="blue"    />
        <StatCard label="Revenue (KES)"    value={revenue.toLocaleString()}                               icon="💰" color="green"  />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-5">
        {['listings', 'orders'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-full text-sm font-medium capitalize transition ${
              activeTab === tab
                ? 'bg-green-700 text-white'
                : 'bg-white border text-gray-600 hover:bg-gray-50'
            }`}
          >
            {tab === 'listings' ? `🌾 My Listings` : `📦 Incoming Orders`}
          </button>
        ))}
      </div>

      {/* Listings Tab */}
      {activeTab === 'listings' && (
        <div className="bg-white rounded-xl border shadow-sm p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-700">My Produce Listings</h3>
            <button
              onClick={openCreate}
              className="bg-green-700 text-white text-sm px-4 py-2 rounded-lg hover:bg-green-800 transition"
            >
              + Add Listing
            </button>
          </div>

          {loading ? (
            <p className="text-gray-400 text-sm">Loading...</p>
          ) : listings.length === 0 ? (
            <p className="text-gray-400 text-sm">No listings yet. Add your first produce.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 border-b">
                    <th className="pb-2">Produce</th>
                    <th className="pb-2">Category</th>
                    <th className="pb-2">Qty</th>
                    <th className="pb-2">Price/Unit</th>
                    <th className="pb-2">Location</th>
                    <th className="pb-2">Status</th>
                    <th className="pb-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {listings.map(item => (
                    <tr key={item._id} className="border-b last:border-0 hover:bg-gray-50">
                      <td className="py-3 font-medium">{item.name}</td>
                      <td className="py-3 capitalize text-gray-500">{item.category}</td>
                      <td className="py-3">{item.quantity} {item.unit}</td>
                      {/* 🚨 FIX 3: Read from item.price explicitly */}
                      <td className="py-3">KES {item.price}</td>
                      <td className="py-3">{item.location}</td>
                      <td className="py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[item.status]}`}>
                          {item.status}
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
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-xl border shadow-sm p-5">
          <h3 className="font-semibold text-gray-700 mb-4">Incoming Orders</h3>
          {orders.length === 0 ? (
            <p className="text-gray-400 text-sm">No orders yet.</p>
          ) : (
            <div className="space-y-3">
              {orders.map(order => (
                <div key={order._id} className="border rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <p className="font-medium text-gray-800">{order.produce?.name}</p>
                    <p className="text-sm text-gray-500">
                      Buyer: {order.buyer?.name} · Qty: {order.quantity} · KES {order.totalPrice}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                      {order.status}
                    </span>
                    {order.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleOrderStatus(order._id, 'confirmed')}
                          className="text-xs bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => handleOrderStatus(order._id, 'cancelled')}
                          className="text-xs bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                    {order.status === 'confirmed' && (
                      <button
                        onClick={() => handleOrderStatus(order._id, 'delivered')}
                        className="text-xs bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700"
                      >
                        Mark Delivered
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Add / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editTarget ? 'Edit Listing' : 'Add New Produce Listing'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 🚨 FIX 4: Swapped 'pricePerUnit' loop mapping key to 'price' */}
          {[
            { label: 'Produce Name', key: 'name',         type: 'text'   },
            { label: 'Location',     key: 'location',    type: 'text'   },
            { label: 'Quantity',     key: 'quantity',    type: 'number' },
            { label: 'Price per Unit (KES)', key: 'price', type: 'number' },
          ].map(({ label, key, type }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
              <input
                type={type}
                step={key === 'price' ? '0.01' : '1'}
                value={form[key] || ''}
                onChange={e => setForm({ ...form, [key]: e.target.value })}
                required
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          ))}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {['vegetables','fruits','grains','legumes','tubers','other'].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
              <select
                value={form.unit}
                onChange={e => setForm({ ...form, unit: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {['kg','bags','crates','tonnes','pieces'].map(u => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={form.description || ''}
              onChange={e => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Error Message Section */}
          {error && (
            <div className="bg-red-50 text-red-600 text-xs px-4 py-2 rounded-lg border border-red-200">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-green-700 text-white py-2.5 rounded-lg font-semibold hover:bg-green-800 disabled:opacity-60 transition"
          >
            {submitting ? 'Saving...' : editTarget ? 'Update Listing' : 'Create Listing'}
          </button>
        </form>
      </Modal>
    </DashboardLayout>
  );
}