import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  Settings, 
  Bell, 
  Search, 
  Plus, 
  MoreVertical,
  CheckCircle,
  Clock,
  LogOut,
  ShoppingBag,
  Truck,
  Calendar,
  User as UserIcon,
  ChevronRight,
  UserCircle,
  X,
  PlusCircle,
  Trash2,
  Edit2,
  Menu
} from 'lucide-react';
import AccountProfile from '../../components/AccountProfile';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';

const DigDevicesDashboard = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.state?.activeTab || 'Overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  const API = import.meta.env.VITE_API_URL || "http://localhost:8000/api";
  const token = localStorage.getItem("vendorToken") || localStorage.getItem("providerToken");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${API}/product`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProducts(res.data.map(p => ({
          id: p._id,
          name: p.name,
          price: `₹${p.price}`,
          category: p.category?.name || 'Devices',
          status: p.quantity > 0 ? 'In Stock' : 'Out of Stock'
        })));
      } catch (err) {
        console.error("Failed to fetch products:", err);
      }
    };
    if (token) fetchProducts();
  }, [API, token]);

  const handleDeleteProduct = async (id) => {
    try {
      await axios.delete(`${API}/product/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(products.filter(p => p.id !== id));
      toast.success("Device deleted");
    } catch (err) {
      toast.error("Failed to delete device");
    }
  };
  
  const vendorInfo = JSON.parse(localStorage.getItem("providerInfo") || localStorage.getItem("vendorInfo") || "{}");
  const providerName = vendorInfo.ownerName || vendorInfo.name || vendorInfo.businessName || 'Devices Partner';
  
  const dashboardMetrics = [
    { label: "Today's Orders", value: '12', note: '+2 vs yesterday', positive: true },
    { label: 'Pending', value: '4', note: 'Dispatch by 2 PM', positive: false },
    { label: 'This Month', value: '45.2k', note: '+8%', positive: true },
    { label: 'Avg Rating', value: '4.8', note: '+0.1 pts', positive: true },
  ];

  const acceptRate = '98%';

  const handleLogout = () => {
    localStorage.clear();
    navigate("/vendor/login");
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    toast.success(`Order status updated to ${newStatus}`);
  };

  return (
    <div className="min-h-screen bg-[#f9fafb] flex font-sans text-slate-900 overflow-hidden h-screen">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-100 flex flex-col transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 flex items-center justify-between">
          <div className="flex flex-col items-start gap-1.5">
            <img
              src="/images/wellwigen-logo.webp"
              alt="Wellwigen"
              className="h-9 sm:h-10 md:h-11 w-auto object-contain select-none"
            />
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-teal-50 text-teal-700 border border-teal-200 ml-0.5">
              Market
            </span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 text-slate-500 hover:bg-gray-100 rounded">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-4">
          <NavItem icon={<LayoutDashboard size={18} />} label="Overview" active={activeTab === 'Overview'} onClick={() => setActiveTab('Overview')} />
          <NavItem icon={<ShoppingBag size={18} />} label="Subscriptions" active={activeTab === 'Orders'} onClick={() => setActiveTab('Orders')} />
          <NavItem icon={<Package size={18} />} label="My Products" active={activeTab === 'Products'} onClick={() => setActiveTab('Products')} />
          <NavItem icon={<Users size={18} />} label="My Clients" active={activeTab === 'Clients'} onClick={() => setActiveTab('Clients')} />
          <NavItem icon={<Settings size={18} />} label="Settings" active={activeTab === 'Settings'} onClick={() => setActiveTab('Settings')} />
        </nav>

        <div className="p-4 border-t border-gray-100 mt-auto">
          <button 
            onClick={() => setActiveTab('Account')}
            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
              activeTab === 'Account' ? 'bg-teal-50' : 'hover:bg-gray-50'
            }`}
          >
            <div className="flex-shrink-0">
              <img 
                src={vendorInfo.profileImage || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'} 
                alt="Profile" 
                className="w-10 h-10 rounded-full border border-gray-200 object-cover"
              />
            </div>
            
            <div className="flex flex-col items-start overflow-hidden text-left">
              <span className={`text-sm font-semibold truncate w-full ${
                activeTab === 'Account' ? 'text-teal-900' : 'text-gray-700'
              }`}>
                My Account
              </span>
              <span className="text-xs text-gray-500">Settings</span>
            </div>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between p-4 border-b border-gray-100 bg-white">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsSidebarOpen(true)} className="p-2 -ml-2 text-slate-500">
              <Menu size={24} />
            </button>
            <img
              src="/images/wellwigen-logo.webp"
              alt="Wellwigen"
              className="h-8 sm:h-9 w-auto object-contain select-none"
            />
          </div>
          <img
            src={vendorInfo.profileImage || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'}
            alt="Profile"
            className="w-8 h-8 rounded-full border border-gray-200 object-cover"
          />
        </header>

        {/* Scrollable Main */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
        {activeTab !== 'Account' && (
          <div className="max-w-7xl mx-auto mb-10">
            <header className="flex justify-between items-start mb-10">
              <div>
                <h1 className="text-4xl font-black text-slate-900 tracking-tight">{providerName}</h1>
                <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px] mt-2">Digital Devices Command Center</p>
              </div>
              <div className="flex items-center gap-4">
                <button className="p-3 bg-white border border-gray-100 rounded-2xl text-slate-400 hover:text-teal-600 transition shadow-sm"><Bell size={20} /></button>
                <button onClick={handleLogout} className="p-3 bg-white border border-gray-100 rounded-2xl text-slate-400 hover:text-red-600 transition shadow-sm"><LogOut size={20} /></button>
              </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
                {dashboardMetrics.map((metric, i) => (
                  <div key={i} className="bg-white p-8 rounded-[2rem] border border-gray-50 shadow-sm hover:shadow-xl transition-all duration-500 group">
                    <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">{metric.label}</p>
                    <div className="mt-4 flex flex-col gap-3">
                      <p className="text-3xl font-black text-slate-900">{metric.value}</p>
                      <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${metric.positive ? 'text-teal-600' : 'text-amber-600'}`}>
                        {metric.note}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-6">
                <div className="bg-teal-600 p-8 rounded-[2rem] text-white shadow-2xl shadow-teal-100">
                  <p className="text-[10px] font-black uppercase tracking-[0.25em] text-teal-200">System Uptime</p>
                  <div className="mt-4 flex items-end gap-3">
                    <span className="text-5xl font-black text-white">{acceptRate}</span>
                    <span className="text-sm font-black uppercase tracking-[0.15em] text-teal-200">Online</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          {activeTab === 'Overview' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <StatCard label="Live Monitoring" value="12" trend="+2" icon={<ShoppingBag className="text-teal-500" size={20} />} />
                <StatCard label="Pending Calibrations" value="4" trend="Action Required" icon={<Truck className="text-blue-500" size={20} />} />
                <StatCard label="Network Status" value="Stable" trend="Excellent" icon={<Users className="text-purple-500" size={20} />} />
              </div>
            </motion.div>
          )}

          {activeTab === 'Orders' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
              <div className="bg-white border border-gray-100 rounded-3xl shadow-sm">
                <div className="p-8 border-b border-gray-100">
                  <h2 className="text-xl font-black text-gray-900 tracking-tight">Manage Device Subscriptions</h2>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Monitor active monitoring plans and client devices</p>
                </div>
                <div className="p-8">
                  <div className="grid grid-cols-1 gap-4">
                    {orders.map(order => (
                      <div key={order.id} className="p-6 bg-white border border-gray-100 rounded-2xl hover:shadow-xl transition-all flex flex-wrap lg:flex-nowrap items-center gap-6">
                        <div className="w-12 h-12 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-600">
                          <ShoppingBag size={24} />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900">{order.product}</h4>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-[10px] font-black text-teal-600 uppercase tracking-widest bg-teal-50 px-2 py-0.5 rounded-md">{order.plan}</span>
                            <span className="text-xs text-gray-400 font-medium flex items-center gap-1"><UserIcon size={12} /> {order.customer}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all">Monitor Stats</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'Products' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-white">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Device Catalog</h2>
                    <p className="text-xs text-gray-500 mt-1 font-medium">Manage your digital device inventory</p>
                  </div>
                  <button 
                    onClick={() => navigate('/vendor/add-product')}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-600 text-white rounded-lg text-sm font-semibold hover:bg-teal-700 transition-colors shadow-sm"
                  >
                    <PlusCircle size={18} /> Add New Device
                  </button>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100">
                        <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Device Name</th>
                        <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Category</th>
                        <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Price</th>
                        <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                        <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {products.map(product => (
                        <tr key={product.id} className="hover:bg-teal-50/30 transition-colors group">
                          <td className="px-8 py-5">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center text-teal-600 group-hover:bg-white shadow-sm transition-all">
                                <Package size={20} />
                              </div>
                              <span className="text-sm font-bold text-gray-900">{product.name}</span>
                            </div>
                          </td>
                          <td className="px-8 py-5">
                            <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-md">{product.category}</span>
                          </td>
                          <td className="px-8 py-5 text-sm font-bold text-gray-900">{product.price}</td>
                          <td className="px-8 py-5">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                              product.status === 'In Stock' 
                                ? 'bg-teal-50 text-teal-700 border border-teal-100' 
                                : 'bg-amber-50 text-amber-700 border border-amber-100'
                            }`}>
                              {product.status}
                            </span>
                          </td>
                          <td className="px-8 py-5 text-right">
                            <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button className="text-gray-400 hover:text-teal-600 transition-colors">
                                <Edit2 size={16} />
                              </button>
                              <button 
                                onClick={() => handleDeleteProduct(product.id)}
                                className="text-gray-400 hover:text-red-600 transition-colors"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'Account' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <AccountProfile />
            </motion.div>
          )}
        </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

const NavItem = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-bold transition-all ${
      active 
        ? 'bg-teal-600 text-white shadow-xl shadow-teal-100' 
        : 'text-gray-400 hover:bg-gray-50 hover:text-black'
    }`}
  >
    {icon}
    {label}
  </button>
);

const StatCard = ({ label, value, trend, icon }) => (
  <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg transition-all group">
    <div className="flex justify-between items-start mb-6">
      <div className="p-3 bg-gray-50 rounded-2xl group-hover:bg-teal-600 group-hover:text-white transition-all">{icon}</div>
      <span className={`text-[10px] font-black px-3 py-1 rounded-full ${
        trend.includes('+') ? 'bg-teal-50 text-teal-600' : 'bg-amber-50 text-amber-600'
      }`}>
        {trend}
      </span>
    </div>
    <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">{label}</p>
    <h4 className="text-3xl font-black text-gray-900 mt-2 tracking-tight">{value}</h4>
  </div>
);

export default DigDevicesDashboard;
