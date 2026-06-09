import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import {
  getProducts,
  addProduct,
  updateOrderStatus,
  deleteProduct,
  getCurrentUser,
  subscribeToOrders,
  ORDER_STATUSES,
} from '../services/db';
import { formatINR } from '../utils/formatPrice';
import { Package, ShoppingBag, Plus, Trash2, RefreshCw } from 'lucide-react';
import './Admin.css';

const statusClass = (status = '') =>
  status.toLowerCase().replace(/\s+/g, '-');

const Admin = () => {
  const [activeTab, setActiveTab] = useState('orders');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const user = getCurrentUser();

  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'Fruit Juices',
    desc: '',
    price: '',
    image: '',
  });

  useEffect(() => {
    getProducts().then(setProducts).catch(console.error);
  }, []);

  useEffect(() => {
    if (!user || user.role !== 'admin') return undefined;

    setLoadingOrders(true);
    const unsubscribe = subscribeToOrders((latestOrders) => {
      setOrders(latestOrders);
      setLoadingOrders(false);
    });

    return unsubscribe;
  }, [user]);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const added = await addProduct({
        ...newProduct,
        price: parseFloat(newProduct.price),
        calories: 120,
        size: '350ml',
        rating: 4.5,
      });
      setProducts((prev) => [...prev, added]);
      setNewProduct({ name: '', category: 'Fruit Juices', desc: '', price: '', image: '' });
    } catch (err) {
      alert(err?.message || 'Failed to add product');
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    setUpdatingOrderId(orderId);
    try {
      await updateOrderStatus(orderId, newStatus);
    } catch (err) {
      alert(err?.message || 'Failed to update order status');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await deleteProduct(id);
      setProducts(await getProducts());
    } catch (err) {
      alert(err?.message || 'Failed to delete product');
    }
  };

  if (!user || user.role !== 'admin') {
    return <Navigate to="/auth" replace state={{ returnUrl: '/admin' }} />;
  }

  return (
    <div className="admin-page section-padding" style={{ paddingTop: '100px', minHeight: '80vh' }}>
      <div className="container">
        <div className="d-flex justify-content-between align-center mb-4 flex-wrap gap-3">
          <h1 className="heading-secondary mb-0">Admin Dashboard</h1>
          <span className="text-muted" style={{ fontSize: '0.9rem' }}>
            Signed in as {user.name}
          </span>
        </div>

        <div className="admin-tabs mb-4">
          <button
            type="button"
            className={`admin-tab ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <ShoppingBag size={20} /> Track Orders ({orders.length})
          </button>
          <button
            type="button"
            className={`admin-tab ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            <Package size={20} /> Manage Products
          </button>
        </div>

        {activeTab === 'products' && (
          <div className="admin-section grid grid-cols-2 gap-4">
            <div className="card p-4">
              <h3 className="mb-3 d-flex align-center gap-2">
                <Plus size={20} /> Add New Product
              </h3>
              <form onSubmit={handleAddProduct}>
                <input
                  required
                  type="text"
                  placeholder="Product Name"
                  className="form-input mb-3 w-100"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                />
                <select
                  className="form-input mb-3 w-100"
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                >
                  <option>Fruit Juices</option>
                  <option>Smoothies</option>
                  <option>Detox Juices</option>
                  <option>Protein Shakes</option>
                  <option>Functional</option>
                </select>
                <input
                  required
                  type="text"
                  placeholder="Description"
                  className="form-input mb-3 w-100"
                  value={newProduct.desc}
                  onChange={(e) => setNewProduct({ ...newProduct, desc: e.target.value })}
                />
                <input
                  required
                  type="number"
                  step="1"
                  placeholder="Price in INR"
                  className="form-input mb-3 w-100"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                />
                <input
                  required
                  type="url"
                  placeholder="Image URL"
                  className="form-input mb-4 w-100"
                  value={newProduct.image}
                  onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                />
                <button type="submit" className="btn btn-primary w-100 justify-content-center">
                  Add Product
                </button>
              </form>
            </div>

            <div className="card p-4" style={{ maxHeight: '600px', overflowY: 'auto' }}>
              <h3 className="mb-3">Current Products ({products.length})</h3>
              <div className="product-list grid gap-3">
                {products.map((p) => (
                  <div key={p.id} className="admin-product-item d-flex justify-content-between align-center p-2 border rounded">
                    <div className="d-flex gap-3 align-center">
                      <img src={p.image} alt={p.name} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }} />
                      <div>
                        <h4 style={{ margin: 0, fontSize: '1rem' }}>{p.name}</h4>
                        <div className="text-muted" style={{ fontSize: '0.85rem' }}>
                          {p.category} | {formatINR(p.price)}
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="icon-btn"
                      onClick={() => handleDeleteProduct(p.id)}
                      style={{ padding: '8px', color: '#ef4444' }}
                      title="Delete Product"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="admin-section card p-4">
            <div className="d-flex justify-content-between align-center mb-3 flex-wrap gap-2">
              <h3 className="mb-0">Customer Orders ({orders.length})</h3>
              <span className="text-muted d-flex align-center gap-1" style={{ fontSize: '0.85rem' }}>
                <RefreshCw size={14} /> Auto-refreshes every 4 seconds
              </span>
            </div>

            {loadingOrders ? (
              <p className="text-muted">Loading orders...</p>
            ) : orders.length === 0 ? (
              <div className="text-center p-4">
                <p className="text-muted mb-2">No orders yet.</p>
                <p className="text-muted" style={{ fontSize: '0.85rem' }}>
                  Place a test order from the menu, then return here to update its status.
                </p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="w-100 admin-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Items</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Update</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id}>
                        <td>
                          <strong>{order.id}</strong>
                          <div className="text-muted" style={{ fontSize: '0.8rem' }}>
                            {order.date ? new Date(order.date).toLocaleString() : '—'}
                          </div>
                        </td>
                        <td>
                          {order.customer?.firstName} {order.customer?.lastName}
                          <div style={{ fontSize: '0.8rem', color: 'var(--color-primary)' }}>
                            {order.customer?.phone}
                          </div>
                          <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                            {order.customer?.email}
                          </div>
                        </td>
                        <td>
                          {order.items?.map((item) => (
                            <div key={item.id} style={{ fontSize: '0.85rem' }}>
                              {item.quantity}x {item.name}
                            </div>
                          ))}
                        </td>
                        <td><strong>{formatINR(order.total)}</strong></td>
                        <td>
                          <span className={`status-badge ${statusClass(order.status || 'payment-pending')}`}>
                            {order.status || 'Payment Pending'}
                          </span>
                        </td>
                        <td>
                          <select
                            value={order.status || 'Payment Pending'}
                            onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                            className="form-input p-1"
                            style={{ fontSize: '0.85rem', minWidth: '140px' }}
                            disabled={updatingOrderId === order.id}
                          >
                            {ORDER_STATUSES.map((status) => (
                              <option key={status} value={status}>{status}</option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
