import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { getProducts, addProduct, getOrders, updateOrderStatus, deleteProduct, getCurrentUser } from '../services/db';
import { Package, ShoppingBag, Plus, CreditCard, Trash2 } from 'lucide-react';
import './Admin.css';

const Admin = () => {
    const [activeTab, setActiveTab] = useState('products');
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const user = getCurrentUser();

    // New product form state
    const [newProduct, setNewProduct] = useState({
        name: '',
        category: 'Fruit Juices',
        desc: '',
        price: '',
        image: ''
    });

    useEffect(() => {
        const loadData = async () => {
            const p = await getProducts();
            const o = await getOrders();
            setProducts(p);
            setOrders(o);
        };
        loadData();
    }, []);

    const handleAddProduct = async (e) => {
        e.preventDefault();
        const added = await addProduct({
            ...newProduct,
            price: parseFloat(newProduct.price)
        });
        setProducts([...products, added]);
        setNewProduct({ name: '', category: 'Fruit Juices', desc: '', price: '', image: '' });
        alert("Product added successfully!");
    };

    const handleUpdateOrderStatus = async (orderId, newStatus) => {
        await updateOrderStatus(orderId, newStatus);
        setOrders(await getOrders()); // Refresh state
    };

    const handleDeleteProduct = async (id) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            await deleteProduct(id);
            setProducts(await getProducts());
        }
    };

    if (!user || user.role !== 'admin') {
        return <Navigate to="/auth" replace />;
    }

    return (
        <div className="admin-page section-padding" style={{ paddingTop: '100px', minHeight: '80vh' }}>
            <div className="container">
                <h1 className="heading-secondary mb-4">Admin Dashboard</h1>

                <div className="admin-tabs mb-4">
                    <button 
                        className={`admin-tab ${activeTab === 'products' ? 'active' : ''}`}
                        onClick={() => setActiveTab('products')}
                    >
                        <Package size={20} /> Manage Products
                    </button>
                    <button 
                        className={`admin-tab ${activeTab === 'orders' ? 'active' : ''}`}
                        onClick={() => setActiveTab('orders')}
                    >
                        <ShoppingBag size={20} /> Track Orders
                    </button>
                </div>

                {activeTab === 'products' && (
                    <div className="admin-section grid grid-cols-2 gap-4">
                        <div className="card p-4">
                            <h3 className="mb-3 d-flex align-center gap-2">
                                <Plus size={20} /> Add New Product
                            </h3>
                            <form onSubmit={handleAddProduct}>
                                <input required type="text" placeholder="Product Name" className="form-input mb-3 w-100" 
                                    value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} />
                                <select className="form-input mb-3 w-100" value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})}>
                                    <option>Fruit Juices</option>
                                    <option>Smoothies</option>
                                    <option>Detox Juices</option>
                                    <option>Protein Shakes</option>
                                </select>
                                <input required type="text" placeholder="Description (e.g., Apple, Ginger)" className="form-input mb-3 w-100"
                                    value={newProduct.desc} onChange={e => setNewProduct({...newProduct, desc: e.target.value})} />
                                <input required type="number" step="0.01" placeholder="Price" className="form-input mb-3 w-100"
                                    value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} />
                                <input required type="url" placeholder="Image URL (e.g. from Unsplash)" className="form-input mb-4 w-100"
                                    value={newProduct.image} onChange={e => setNewProduct({...newProduct, image: e.target.value})} />
                                <button type="submit" className="btn btn-primary w-100 justify-content-center">Add Product</button>
                            </form>
                        </div>
                        <div className="card p-4" style={{ maxHeight: '600px', overflowY: 'auto' }}>
                            <h3 className="mb-3">Current Products ({products.length})</h3>
                                <div className="product-list grid gap-3">
                                {products.map(p => (
                                    <div key={p.id} className="admin-product-item d-flex justify-content-between align-center p-2 border rounded">
                                        <div className="d-flex gap-3 align-center">
                                            <img src={p.image} alt={p.name} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' }} />
                                            <div>
                                                <h4 style={{ margin: 0, fontSize: '1rem' }}>{p.name}</h4>
                                                <div className="text-muted" style={{ fontSize: '0.85rem' }}>{p.category} | ₹{p.price?.toFixed(2)}</div>
                                            </div>
                                        </div>
                                        <button 
                                            className="icon-btn text-danger" 
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
                        <h3 className="mb-3">Customer Orders ({orders.length})</h3>
                        {orders.length === 0 ? <p className="text-muted">No orders yet.</p> : (
                            <div className="table-responsive">
                                <table className="w-100" style={{ textAlign: 'left', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '2px solid var(--color-border)' }}>
                                            <th className="p-2">Order ID</th>
                                            <th className="p-2">Customer</th>
                                            <th className="p-2">Items</th>
                                            <th className="p-2">Total</th>
                                            <th className="p-2">Status</th>
                                            <th className="p-2">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.map(order => (
                                            <tr key={order.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                                <td className="p-2"><strong>{order.id}</strong><br/><span style={{fontSize:'0.8rem'}}>{new Date(order.date).toLocaleDateString()}</span></td>
                                                <td className="p-2">{order.customer?.firstName} {order.customer?.lastName}<br/><span style={{fontSize:'0.8rem', color:'var(--color-primary)'}}>{order.customer?.phone}</span></td>
                                                <td className="p-2">
                                                    {order.items?.map(item => (
                                                        <div key={item.id} style={{fontSize: '0.85rem'}}>{item.quantity}x {item.name}</div>
                                                    ))}
                                                </td>
                                                <td className="p-2 font-bold">₹{order.total?.toFixed(2)}</td>
                                                <td className="p-2">
                                                    <span className={`status-badge ${order.status.toLowerCase()}`}>{order.status}</span>
                                                </td>
                                                <td className="p-2">
                                                    <select 
                                                        value={order.status} 
                                                        onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                                                        className="form-input p-1" style={{fontSize: '0.85rem'}}
                                                    >
                                                        <option>Payment Pending</option>
                                                        <option>Pending</option>
                                                        <option>Preparing</option>
                                                        <option>Completed</option>
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
