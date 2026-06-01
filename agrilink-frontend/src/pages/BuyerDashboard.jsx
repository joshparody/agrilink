import { useState, useEffect, useCallback } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import StatCard from '../components/ui/StatCard';
import Modal from '../components/ui/Modal';
import { useAuth } from '../context/AuthContext';
import { getAllProduce } from '../services/produceService';
import { placeOrder, getMyOrders } from '../services/orderService';

const CATEGORIES = ['all','vegetables','fruits','grains','legumes','tubers','other'];

const statusColors = {
  pending:   'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function BuyerDashboard() {
  const { user } = useAuth();
  const [produce, setProduce]         = useState([]);
  const [orders, setOrders]           = useState([]);
  const [loading, setLoading]         = useState(true);
  const [activeTab, setActiveTab]     = useState('browse');
  const [category, setCategory]       = useState('all');
  const [orderModal, setOrderModal]   = useState(false);
  const [selected, setSelected]       = useState(null);
  const [quantity, setQuantity]       = useState(1);
  const [notes, setNotes]             = useState('');
  const [submitting, setSubmitting]   = useState(false);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [pRes, oRes] = await Promise.all([
        getAllProduce(category === 'all' ? null : category),
        getMyOrders()
      ]);
      setProduce(pRes.data.data.produce);
      setOrders(oRes.data.data.orders);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [category]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { fetchAll(); }, [fetchAll]);

  const openOrder = (item) => { setSelected(item); setQuantity(1); setNotes(''); setOrderModal(true); };

  const handleOrder = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await placeOrder({ produceId: selected._id, quantity: Number(quantity), notes });
      setOrderModal(false);
      fetchAll();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const totalSpent = orders
    .filter(o => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.totalPrice, 0);

  return (
    <DashboardLayout title="Buyer Dashboard">
      <div className="bg-blue-700 text-white rounded-2xl px-6 py-5 mb-6">
        <h2 className="text-xl font-bold">Welcome, {user?.name} 👋</h2>
        <p className="text-blue-200 text-sm mt-1">Browse fresh produce and manage your orders.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Available Produce"  value={produce.length}                                  icon="🛒" color="blue"   />
        <StatCard label="My Orders"          value={orders.length}                                   icon="📋" color="yellow" />
        <StatCard label="Pending Orders"     value={orders.filter(o => o.status === 'pending').length} icon="⏳" color="blue" />
        <StatCard label="Total Spent (KES)"  value={totalSpent.toLocaleString()}                     icon="💳" color="green"  />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-5">
        {['browse', 'orders'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-full text-sm font-medium capitalize transition ${
              activeTab === tab
                ? 'bg-blue-700 text-white'
                : 'bg-white border text-gray-600 hover:bg-gray-50'
            }`}
          >
            {tab === 'browse' ? '🌾 Browse Produce' : '📋 My Orders'}
          </button>
        ))}
      </div>

      {/* Browse Tab */}
      {activeTab === 'browse' && (
        <div>
          {/* Category Filter */}
          <div className="flex gap-2 flex-wrap mb-4">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize transition ${
                  category === cat
                    ? 'bg-blue-700 text-white'
                    : 'bg-white border text-gray-500 hover:bg-gray-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {loading ? (
            <p className="text-gray-400 text-sm">Loading produce...</p>
          ) : produce.length === 0 ? (
            <p className="text-gray-400 text-sm">No produce available in this category.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {produce.map(item => (
                <div key={item._id} className="bg-white rounded-xl border shadow-sm p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-gray-800">{item.name}</h4>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full capitalize">
                        {item.category}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mb-1">📍 {item.location}</p>
                    <p className="text-sm text-gray-500 mb-1">
                      🌾 Farmer: {item.farmer?.name}
                    </p>
                    <p className="text-sm text-gray-500 mb-3">
                      📦 {item.quantity} {item.unit} available
                    </p>
                    {item.description && (
                      <p className="text-xs text-gray-400 mb-3 line-clamp-2">{item.description}</p>
                    )}
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="font-bold text-green-700">KES {item.pricePerUnit}/{item.unit}</span>
                    <button
                      onClick={() => openOrder(item)}
                      className="bg-blue-700 text-white text-xs px-4 py-2 rounded-lg hover:bg-blue-800 transition"
                    >
                      Order Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-xl border shadow-sm p-5">
          <h3 className="font-semibold text-gray-700 mb-4">My Orders</h3>
          {orders.length === 0 ? (
            <p className="text-gray-400 text-sm">No orders yet. Browse produce to place your first order.</p>
          ) : (
            <div className="space-y-3">
              {orders.map(order => (
                <div key={order._id} className="border rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <p className="font-medium text-gray-800">{order.produce?.name}</p>
                    <p className="text-sm text-gray-500">
                      Farmer: {order.farmer?.name} · Qty: {order.quantity} · KES {order.totalPrice}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium self-start sm:self-center ${statusColors[order.status]}`}>
                    {order.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Order Modal */}
      <Modal isOpen={orderModal} onClose={() => setOrderModal(false)} title={`Order: ${selected?.name}`}>
        {selected && (
          <form onSubmit={handleOrder} className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4 text-sm space-y-1">
              <p><span className="font-medium">Farmer:</span> {selected.farmer?.name}</p>
              <p><span className="font-medium">Price:</span> KES {selected.pricePerUnit}/{selected.unit}</p>
              <p><span className="font-medium">Available:</span> {selected.quantity} {selected.unit}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantity ({selected.unit})</label>
              <input
                type="number"
                min="1"
                max={selected.quantity}
                value={quantity}
                onChange={e => setQuantity(e.target.value)}
                required
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="bg-blue-50 rounded-lg px-4 py-3 text-sm">
              <span className="font-medium text-blue-700">
                Total: KES {(selected.pricePerUnit * quantity).toLocaleString()}
              </span>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                rows={2}
                placeholder="Delivery instructions, preferred pickup time..."
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-blue-700 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-800 disabled:opacity-60 transition"
            >
              {submitting ? 'Placing Order...' : 'Place Order'}
            </button>
          </form>
        )}
      </Modal>
    </DashboardLayout>
  );
}