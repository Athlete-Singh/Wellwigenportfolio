import React, { useState, useEffect, useRef } from 'react';
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
  Apple,
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
  ShoppingBasket,
  Minus,
  ArrowRight,
  Star,
  Activity,
  Heart,
  Zap,
  ShieldCheck,
  Menu,
  X as CloseIcon
} from 'lucide-react';
import AccountProfile from '../../components/AccountProfile';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';
import { io } from "socket.io-client";
import socket, { getSocketUrl } from '../../../../config/socket';

const NavItem = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all ${
      active 
        ? 'bg-[#eef2ff] text-blue-700' 
        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
    }`}
  >
    {icon}
    {label}
  </button>
);

const StatCard = ({ label, value, trend, icon }) => (
  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
    <div className="flex justify-between items-start mb-4">
      <div className="text-blue-600">{icon}</div>
      <span className={`text-xs font-bold px-2 py-1 rounded ${
        trend.includes('+') ? 'bg-blue-50 text-blue-700' : 'bg-amber-50 text-amber-700'
      }`}>
        {trend}
      </span>
    </div>
    <p className="text-gray-500 text-sm font-semibold">{label}</p>
    <h4 className="text-2xl font-bold text-gray-900 mt-1">{value}</h4>
  </div>
);

const NutritionDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(location.state?.activeTab || 'Overview');
  const [storeActive, setStoreActive] = useState(() => {
    const saved = localStorage.getItem("storeActive");
    return saved !== null ? JSON.parse(saved) : true;
  });
  
  // States for Vendor view
  const [orders, setOrders] = useState([]);
  
  // 🧹 One-time Cleanup: Purge legacy demo data to ensure only real backend data is shown
  useEffect(() => {
    const legacyKeys = ["vendorDummyOrders_v3", "deliveredDeliveries_v3", "outForDeliveryDeliveries_v3"];
    let cleaned = false;
    legacyKeys.forEach(key => {
      if (localStorage.getItem(key)) {
        localStorage.removeItem(key);
        cleaned = true;
      }
    });
    if (cleaned) {
      console.log("🧹 Legacy demo data purged. Dashboard is now strictly real-time.");
      window.location.reload();
    }
  }, []);
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem("vendorProducts");
    const locals = saved ? JSON.parse(saved) : [];
    return [
      { id: '1', name: 'Seasonal Fruit Box', category: 'Fruits', price: 450, stock: 25 },
      { id: '2', name: 'Organic Citrus Pack', category: 'Citrus', price: 320, stock: 15 },
      { id: '3', name: 'Tropical Wellness Tray', category: 'Exotic', price: 850, stock: 10 },
      ...locals
    ];
  });
  
  // States for Marketplace view (User Customization)
  const [categories, setCategories] = useState([{ _id: '1', name: 'All' }, { _id: '2', name: 'Organic' }, { _id: '3', name: 'Seasonal' }]);
  const [marketProducts, setMarketProducts] = useState(() => {
    const saved = localStorage.getItem("vendorProducts");
    const locals = (saved ? JSON.parse(saved) : []).map(p => ({ ...p, _id: p.id })); // Map id to _id for marketplace consistency
    return [
      { _id: 'm1', name: 'Premium Alphonso Mangoes', price: 450, healthGoal: 'Vitality', images: [] },
      { _id: 'm2', name: 'Fuji Apples (Global)', price: 180, healthGoal: 'Immunity', images: [] },
      { _id: 'm3', name: 'Honey Pineapple', price: 120, healthGoal: 'Digestion', images: [] },
      { _id: 'm4', name: 'Organic Blueberries', price: 550, healthGoal: 'Brain Health', images: [] },
      ...locals
    ];
  });
  const [activeGoal, setActiveGoal] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState({});
  const [loading, setLoading] = useState(true);
  const [socketConnected, setSocketConnected] = useState(false);
  const [successPopup, setSuccessPopup] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const socketRef = useRef(null);

  // Store Preference States
  const [emailAlerts, setEmailAlerts] = useState(() => {
    const saved = localStorage.getItem("vendorEmailAlerts");
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [autoApprove, setAutoApprove] = useState(() => {
    const saved = localStorage.getItem("vendorAutoApprove");
    return saved !== null ? JSON.parse(saved) : false;
  });

  const API = import.meta.env.VITE_API_URL || "http://localhost:8000/api";
  const token = localStorage.getItem("vendorToken") || localStorage.getItem("providerToken");

  useEffect(() => {
    const fetchData = async () => {
      // Sync store status
      localStorage.setItem("storeActive", JSON.stringify(storeActive));
      
      try {
        const vendorData = JSON.parse(
          localStorage.getItem("providerInfo") ||
          localStorage.getItem("vendorInfo") ||
          localStorage.getItem("user") ||
          "{}"
        );
        const vendorId = vendorData._id || vendorData.id || null;
        console.log("🛠️ [DEBUG] Vendor ID:", vendorId, "| Data keys:", Object.keys(vendorData));

        // Fetch Categories and Products independently
        Promise.all([
          axios.get(`${API}/category`).catch(() => ({ data: [] })),
          axios.get(`${API}/product`, { headers: { Authorization: `Bearer ${token}` } }).catch(() => ({ data: [] }))
        ]).then(([catRes, prodRes]) => {
          setCategories(catRes.data || []);
          setProducts(prodRes.data?.map(p => ({
            id: p._id,
            name: p.name,
            price: `₹${p.price}`,
            category: p.category?.name || 'General',
            status: p.quantity > 0 ? 'In Stock' : 'Out of Stock'
          })) || []);
          setMarketProducts(prodRes.data || []);
        });

        // ✅ Independent Order Fetching (Resilient)
        console.log("📦 [DASHBOARD] Fetching live orders from sync endpoint...");
        const orderRes = await axios.get(`${API}/orders/vendor-live`, {
          timeout: 10000 // 10 second timeout for sync
        }).catch(e => {
          console.error('📦 [VENDOR-LIVE] Critical Fetch Error:', e.message);
          return { data: { success: false, orders: [] } };
        });

        const ordersData = orderRes?.data?.orders || [];
        console.log(`📦 [DASHBOARD] Received ${ordersData.length} orders from server.`);

        if (Array.isArray(ordersData) && ordersData.length > 0) {
          const liveOrders = ordersData.map(o => {
            const customerName = o.userId?.name || o.userId?.email || 'Subscriber';
            const productLabel = o.items?.[0]?.name || 'Fresh Produce Box';
            const rawStatus = o.status || 'pending';
            
            return {
              id: o._id,
              customer: customerName,
              plan: productLabel,
              product: productLabel,
              date: new Date(o.scheduledFor || o.createdAt).toLocaleDateString('en-IN'),
              status: rawStatus === 'pending' ? 'Pending' :
                      rawStatus === 'out_for_delivery' ? 'Out for Delivery' :
                      rawStatus === 'delivered' ? 'Delivered' :
                      rawStatus.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
              type: 'Order'
            };
          });
          setOrders(liveOrders);
        } else {
          console.warn("⚠️ [DASHBOARD] No orders returned from sync endpoint.");
          setOrders([]);
        }
      } catch (err) {
        console.error("❌ [DASHBOARD] Fatal Error in fetchData:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    
    // Set up polling interval as a backup to sockets
    const interval = setInterval(fetchData, 30000); // 30 seconds
    return () => clearInterval(interval);
  }, [API, token]);

  useEffect(() => {
    const socketBaseUrl = getSocketUrl();
    if (!socketBaseUrl) {
      console.log("ℹ️ No remote socket URL available - skipping socket initialization.");
      return;
    }

    console.log("🔌 Initializing socket connection...");
    const newSocket = io(socketBaseUrl, {
      transports: ["websocket", "polling"],
      reconnectionAttempts: 5,
    });

    socketRef.current = newSocket;
    window._socket = newSocket;

    // Register Vendor with Socket
    const vendorData = JSON.parse(localStorage.getItem("providerInfo") || localStorage.getItem("vendorInfo") || "{}");
    const vendorId = vendorData._id || 'demo-vendor-id';

    const handleConnect = () => {
      console.log("✅ Socket connected successfully!");
      setSocketConnected(true);
      if (vendorId) {
        newSocket.emit("registerUser", vendorId);
        console.log("📡 Vendor registered with socket:", vendorId);
      }
    };

    const handleConnectError = (err) => {
      console.error("❌ Socket connection error:", err);
      setSocketConnected(false);
    };

    newSocket.on("connect", handleConnect);
    newSocket.on("connect_error", handleConnectError);

    // If already connected, register immediately
    if (newSocket.connected) {
      handleConnect();
    }

    // Listen for Live Notifications
    newSocket.on("newOrder", (newOrder) => {
      console.log("🔔 REAL-TIME: New order/reminder received via socket!", newOrder);
      
      // Prevent duplicates
      setOrders(prev => {
        if (prev.some(o => o.id === newOrder.id)) return prev;
        return [newOrder, ...prev];
      });

      // Show Premium Toast
      const isReminder = newOrder.type === "Reminder";
      toast.custom((t) => (
        <div className={`${t.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} max-w-md w-full bg-white shadow-2xl rounded-[2rem] pointer-events-auto flex ring-1 ring-black ring-opacity-5 border border-teal-100 overflow-hidden transition-all duration-500 ease-out`}>
          <div className="flex-1 w-0 p-6">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                <div className={`h-12 w-12 rounded-2xl ${isReminder ? 'bg-amber-500' : 'bg-teal-600'} flex items-center justify-center text-white shadow-lg shadow-teal-100`}>
                  {isReminder ? <Clock size={24} /> : <ShoppingBag size={24} />}
                </div>
              </div>
              <div className="ml-4 flex-1">
                <p className={`text-xs font-black uppercase tracking-[0.2em] ${isReminder ? 'text-amber-600' : 'text-teal-600'} mb-1`}>
                  {isReminder ? 'Order Reminder' : 'Incoming Order'}
                </p>
                <p className="text-sm font-black text-slate-900">{newOrder.customer} {isReminder ? 'has a pending order' : 'placed an order'}</p>
                <p className="mt-1 text-sm font-bold text-slate-400 uppercase tracking-widest">{newOrder.product}</p>
              </div>
            </div>
          </div>
          <div className="flex border-l border-gray-100">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="w-full border border-transparent rounded-none rounded-r-2xl p-4 flex items-center justify-center text-sm font-black text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest bg-gray-50/50"
            >
              Dismiss
            </button>
          </div>
        </div>
      ), { duration: 8000, position: 'top-right' });
    });

    return () => {
      console.log("🔌 Cleaning up socket listeners...");
      newSocket.off("connect", handleConnect);
      newSocket.off("connect_error", handleConnectError);
      newSocket.off("newOrder");
    };
  }, [API]);

  const filteredMarketProducts = marketProducts.filter(p => {
    const matchesGoal = activeGoal === "All" || p.healthGoal === activeGoal;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesGoal && matchesSearch;
  });

  const updateQuantity = (id, delta) => {
    setCart(prev => {
      const current = prev[id] || 0;
      const next = Math.max(0, current + delta);
      if (next === 0) {
        const newCart = { ...prev };
        delete newCart[id];
        return newCart;
      }
      return { ...prev, [id]: next };
    });
  };

  const handlePlaceOrder = () => {
    if (Object.keys(cart).length === 0) return;
    
    // Create order object with details
    const orderDetails = Object.keys(cart).map(id => {
      const p = marketProducts.find(prod => prod._id === id);
      return {
        id: id,
        name: p?.name,
        quantity: cart[id],
        price: p?.price,
        total: p?.price * cart[id]
      };
    });

    // Save to localStorage for the User Dashboard to pick up
    localStorage.setItem("latestOrder", JSON.stringify({
      items: orderDetails,
      date: new Date().toLocaleString(),
      status: "Placed",
      orderId: "#WL-" + Math.floor(1000 + Math.random() * 9000)
    }));

    toast.loading("Placing your order...", { id: "order" });
    
    setTimeout(() => {
      toast.success("Order placed successfully!", { id: "order" });
      setCart({});
      // Set active tab to Orders to show the placed order in provider portal
      setActiveTab('Orders');
    }, 1500);
  };

  const handleDeleteProduct = (id) => {
    setProducts(products.filter(p => p.id !== id));
    const saved = JSON.parse(localStorage.getItem("vendorProducts") || "[]");
    localStorage.setItem("vendorProducts", JSON.stringify(saved.filter(p => p.id !== id)));
    toast.success("Product removed from catalog");
  };

  const handleSavePreferences = () => {
    localStorage.setItem("vendorEmailAlerts", JSON.stringify(emailAlerts));
    localStorage.setItem("vendorAutoApprove", JSON.stringify(autoApprove));
    toast.success("Store preferences saved successfully!");
  };
  
  const vendorInfo = JSON.parse(localStorage.getItem("providerInfo") || localStorage.getItem("vendorInfo") || "{}");
  const providerName = vendorInfo.ownerName || vendorInfo.name || 'Ramesh Fruits & Vegetables';
  const vendorLocation = vendorInfo.location || vendorInfo.storeAddress || 'Gomti Nagar, Lucknow';

  const pendingCount = orders.filter(o => o.status === 'Pending').length;
  const outForDeliveryCount = orders.filter(o => o.status === 'Out for Delivery').length;
  const totalActive = orders.filter(o => o.status !== 'Delivered').length;

  const dashboardMetrics = [
    { label: "Active Orders", value: String(totalActive), note: totalActive > 0 ? 'Needs action' : 'All clear', positive: totalActive === 0 },
    { label: 'Pending', value: String(pendingCount), note: pendingCount > 0 ? 'Dispatch soon' : 'None pending', positive: pendingCount === 0 },
    { label: 'Out for Delivery', value: String(outForDeliveryCount), note: outForDeliveryCount > 0 ? 'In transit' : 'None in transit', positive: outForDeliveryCount > 0 },
    { label: 'Total Orders', value: String(orders.length), note: 'All time', positive: true },
  ];

  const handleLogout = () => {
    localStorage.clear();
    navigate("/vendor/login");
  };



  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      console.log(`🔘 Order status update triggered: ID=${orderId}, Status=${newStatus}`);
      const activeSocket = socketRef.current;
      
      const vendorData = JSON.parse(localStorage.getItem("providerInfo") || localStorage.getItem("vendorInfo") || "{}");
      const currentVendorId = vendorData._id || 'demo-vendor-id';


      
      const res = await axios.put(`${API}/orders/${orderId}/status`, { 
        status: newStatus.toLowerCase(),
        vendorId: currentVendorId
      });
      if (res.data.success) {
        if (newStatus.toLowerCase() === 'delivered') {
          // Remove from list immediately to keep dashboard focused on active tasks
          setOrders(prev => prev.filter(o => o.id !== orderId));
          toast.success("Order delivered and synced successfully!");
        } else {
          setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        }
        setSuccessPopup(true);
        setTimeout(() => setSuccessPopup(false), 3000);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update order status");
    }
  };

  const goals = [
    { name: "All", icon: Star },
    { name: "Immunity Boost", icon: ShieldCheck },
    { name: "Weight Loss", icon: Activity },
    { name: "Muscle Gain", icon: Zap },
    { name: "Heart Health", icon: Heart },
  ];

  return (
    <div className="flex h-screen bg-[#f9fafb] font-sans text-slate-900 overflow-hidden">
      {/* Overlay for mobile sidebar */}
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
        fixed inset-y-0 left-0 z-50 w-64 bg-[#f8f9fa] border-r border-gray-200 flex flex-col transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-sm">W</div>
            <span className="font-bold text-gray-900 tracking-tight">Wellwigen <span className="text-blue-600 font-semibold">Market</span></span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 text-slate-500 hover:bg-white rounded">
            <CloseIcon size={20} />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-4 overflow-y-auto">
          <NavItem icon={<LayoutDashboard size={18} />} label="Overview" active={activeTab === 'Overview'} onClick={() => { setActiveTab('Overview'); setIsSidebarOpen(false); }} />
          <NavItem icon={<ShoppingBasket size={18} />} label="Place Products" active={activeTab === 'Customization'} onClick={() => { setActiveTab('Customization'); setIsSidebarOpen(false); }} />
          <NavItem icon={<ShoppingBag size={18} />} label="Orders" active={activeTab === 'Orders'} onClick={() => { setActiveTab('Orders'); setIsSidebarOpen(false); }} />
          <NavItem icon={<Users size={18} />} label="My Clients" active={activeTab === 'Clients'} onClick={() => { setActiveTab('Clients'); setIsSidebarOpen(false); }} />
          <NavItem icon={<Settings size={18} />} label="Settings" active={activeTab === 'Settings'} onClick={() => { setActiveTab('Settings'); setIsSidebarOpen(false); }} />
          
          <div className="pt-4 mt-4 border-t border-gray-200">
            <button 
              onClick={() => { navigate('/vendor/add-product'); setIsSidebarOpen(false); }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-all font-semibold text-sm"
            >
              <PlusCircle size={16} />
              Add Product
            </button>
          </div>
        </nav>

        <div className="p-4 border-t border-gray-200 bg-[#f8f9fa]">
          <button 
            onClick={() => { setActiveTab('Account'); setIsSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
              activeTab === 'Account' ? 'bg-[#eef2ff]' : 'hover:bg-white'
            }`}
          >
            <div className="flex-shrink-0">
              <img 
                src={vendorInfo.profileImage || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'} 
                alt="Profile" 
                className="w-10 h-10 rounded border border-gray-200 object-cover"
              />
            </div>
            <div className="flex flex-col items-start overflow-hidden text-left">
              <span className={`text-sm font-semibold truncate w-full ${activeTab === 'Account' ? 'text-blue-900' : 'text-gray-900'}`}>My Account</span>
              <span className="text-sm text-gray-500">Settings</span>
            </div>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-white">
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between p-4 border-b border-gray-100 bg-white">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsSidebarOpen(true)} className="p-2 -ml-2 text-slate-500">
              <Menu size={24} />
            </button>
            <span className="font-bold text-gray-900 text-sm">Wellwigen</span>
          </div>
          <div className="flex items-center gap-3">
            <img 
              src={vendorInfo.profileImage || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'} 
              alt="Profile" 
              className="w-8 h-8 rounded border border-gray-200 object-cover"
            />
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-gray-100 pb-6 gap-4">
            <div>
              <h1 className="text-xl lg:text-2xl font-semibold text-slate-900">
                {activeTab === 'Customization' ? 'Place Products' : 'Vendor Dashboard'}
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                {activeTab === 'Customization' ? 'Pick items and place your product order' : `${providerName} · ${vendorLocation}`}
              </p>
            </div>
            <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
            {/* Store Status Toggle */}
            <button 
              onClick={() => setStoreActive(!storeActive)}
              className={`px-3 py-1.5 rounded flex items-center gap-2 border transition-all hover:shadow-sm ${
                storeActive 
                  ? 'bg-blue-50 border-blue-100 text-blue-600' 
                  : 'bg-amber-50 border-amber-100 text-amber-600'
              }`}
            >
              <div className={`w-1.5 h-1.5 rounded-full ${storeActive ? 'bg-blue-500 animate-pulse' : 'bg-amber-500'}`}></div>
              <span className="text-xs font-bold uppercase tracking-wider">
                {storeActive ? 'Live' : 'Offline'}
              </span>
            </button>

            {/* Socket Status Indicator */}
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded border text-[10px] font-black uppercase tracking-wider transition-all ${socketConnected ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-rose-50 border-rose-100 text-rose-600'}`}>
              <div className={`w-1.5 h-1.5 rounded-full ${socketConnected ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></div>
              {socketConnected ? 'Socket Live' : 'Socket Offline'}
            </div>

            <button className="p-2 bg-white border border-gray-200 rounded text-slate-500 hover:text-blue-600 transition relative">
              <Bell size={18} />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
            </button>
            <button onClick={handleLogout} className="p-2 bg-white border border-gray-200 rounded text-slate-500 hover:text-red-600 transition"><LogOut size={18} /></button>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {activeTab === 'Overview' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">

              <div className="grid grid-cols-1 gap-4 mb-8 md:grid-cols-4">
                {dashboardMetrics.map((metric) => (
                  <div key={metric.label} className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{metric.label}</p>
                    <div className="mt-3 flex flex-col gap-1">
                      <p className="text-2xl font-bold text-slate-900">{metric.value}</p>
                      <span className={`text-xs font-bold uppercase tracking-wider ${metric.positive ? 'text-blue-600' : 'text-amber-600'}`}>
                        {metric.note}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                      <h3 className="font-semibold text-gray-900 text-sm">Recent Orders</h3>
                      <button onClick={() => setActiveTab('Orders')} className="text-xs font-bold text-blue-600 uppercase tracking-widest hover:text-blue-700">View All</button>
                    </div>
                    <div className="p-0">
                      {orders.length === 0 ? (
                        <div className="py-12 text-center flex flex-col items-center justify-center gap-3">
                          <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
                            <ShoppingBag size={24} />
                          </div>
                          <p className="text-slate-400 text-sm font-medium">No orders yet.</p>
                          <p className="text-slate-300 text-xs">Orders will appear here as subscriptions are activated.</p>
                        </div>
                      ) : (
                        <table className="w-full">
                          <thead>
                            <tr className="bg-slate-50 border-b border-gray-100">
                              <th className="py-2 px-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Customer</th>
                              <th className="py-2 px-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Date</th>
                              <th className="py-2 px-4 text-right text-[10px] font-black uppercase tracking-widest text-slate-400">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {orders.slice(0, 5).map((order) => {
                              const orderDate = new Date(order.date);
                              const today = new Date();
                              const tomorrow = new Date(); tomorrow.setDate(today.getDate() + 1);
                              const isToday = orderDate.toDateString() === today.toDateString();
                              const isTomorrow = orderDate.toDateString() === tomorrow.toDateString();
                              const dateLabel = isToday ? 'Today' : isTomorrow ? 'Tomorrow' : order.date;

                              return (
                                <tr key={order.id} className="group hover:bg-blue-50/30 transition-colors">
                                  <td className="py-3 px-4">
                                    <div className="flex items-center gap-3">
                                      <div className="w-9 h-9 bg-gray-50 rounded flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all flex-shrink-0">
                                        <Truck size={16} />
                                      </div>
                                      <div>
                                        <span className="text-sm font-semibold text-gray-900">{order.customer}</span>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">{order.product}</p>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="py-3 px-4">
                                    <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded ${
                                      isToday ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                                    }`}>
                                      {dateLabel}
                                    </span>
                                  </td>
                                  <td className="py-3 px-4">
                                    <div className="flex items-center justify-end gap-2">
                                      <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded ${
                                        order.status === 'Pending' ? 'bg-amber-50 text-amber-600' :
                                        order.status === 'Out for Delivery' ? 'bg-blue-50 text-blue-600' :
                                        'bg-green-50 text-green-700'
                                      }`}>
                                        {order.status}
                                      </span>
                                      {order.status === 'Pending' && (
                                        <button
                                          onClick={() => updateOrderStatus(order.id, 'Out for Delivery')}
                                          className="px-2 py-1 bg-amber-500 text-white rounded hover:bg-amber-600 transition-colors flex items-center gap-1 text-[10px] font-black uppercase tracking-wider"
                                          title="Dispatch Order"
                                        >
                                          <Truck size={11} /> Dispatch
                                        </button>
                                      )}
                                      {order.status === 'Out for Delivery' && (
                                        <button
                                          onClick={() => updateOrderStatus(order.id, 'Delivered')}
                                          className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center gap-1 text-[10px] font-black uppercase tracking-wider"
                                          title="Mark as Delivered"
                                        >
                                          <CheckCircle size={11} /> Deliver
                                        </button>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900 rounded-lg p-6 text-white shadow-sm relative overflow-hidden h-fit">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                  <h3 className="text-sm font-bold text-blue-400 uppercase tracking-widest mb-6 border-b border-white/10 pb-4">Place Products</h3>
                  <p className="text-slate-400 text-sm mb-6">Quickly pick fruits and place a new product order for your clients.</p>
                  <button 
                    onClick={() => setActiveTab('Customization')}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold text-sm transition-all"
                  >
                    Place Now
                  </button>
                </div>
              </div>
            </motion.div>
          )}
          {activeTab === 'Customization' && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8 pb-32">
              {!storeActive ? (
                <div className="flex flex-col items-center justify-center min-h-[400px] bg-white rounded-lg border border-gray-200 shadow-sm text-center p-10">
                   <div className="w-20 h-20 bg-amber-50 rounded flex items-center justify-center mb-6">
                      <Clock className="text-amber-600" size={40} />
                   </div>
                   <h2 className="text-2xl font-bold text-slate-900 mb-3">Store is Currently Closed</h2>
                   <p className="text-slate-500 max-w-md mx-auto mb-6 text-sm">The vendor has temporarily disabled product placement. Please check back later or contact support if you have an urgent delivery request.</p>
                   <button 
                     onClick={() => setActiveTab('Overview')}
                     className="px-6 py-3 bg-slate-900 text-white rounded font-semibold text-sm shadow-sm"
                   >
                     Back to Dashboard
                   </button>
                </div>
              ) : (
                <>
                  <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
                    <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto">
                      {goals.map(g => (
                        <button 
                          key={g.name}
                          onClick={() => setActiveGoal(g.name)}
                          className={`px-4 py-2 rounded text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                            activeGoal === g.name ? 'bg-slate-900 text-white' : 'bg-white text-slate-500 border border-gray-200 hover:border-blue-300'
                          }`}
                        >
                          {g.name}
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center gap-4 w-full md:w-auto">
                      {localStorage.getItem("vendorToken") && (
                        <button 
                          onClick={() => navigate('/vendor/add-product')}
                          className="px-4 py-2 bg-blue-600 text-white rounded font-semibold text-sm flex items-center gap-2 whitespace-nowrap hover:bg-blue-700 transition-all"
                        >
                          <PlusCircle size={16} /> Add Product
                        </button>
                      )}
                      <div className="relative w-full md:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input 
                          type="text" 
                          placeholder="Search fruits..." 
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded text-sm focus:ring-1 focus:ring-blue-600 outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {filteredMarketProducts.map(p => (
                      <div key={p._id} className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm hover:border-blue-300 transition-all group flex flex-col">
                        <div className="aspect-square bg-slate-50 rounded mb-3 overflow-hidden relative">
                           {p.images?.[0] ? <img src={`http://localhost:8000${p.images[0]}`} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-3xl">🍎</div>}
                           <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-white/90 backdrop-blur shadow-sm rounded text-[8px] font-bold text-blue-600 uppercase tracking-wider">{p.healthGoal}</div>
                        </div>
                        <div className="flex justify-between items-center mb-0.5">
                          <h4 className="text-sm font-bold text-slate-900 leading-tight truncate">{p.name}</h4>
                          {localStorage.getItem("vendorToken") && (
                            <button 
                              onClick={() => handleDeleteProduct(p._id.startsWith('local-') ? p._id.replace('local-', '') : p._id)} 
                              className="text-slate-400 hover:text-red-600 transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                        <p className="text-slate-500 text-xs font-semibold mb-3">₹{p.price}/kg</p>
                        
                        <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-50">
                          <div className="flex items-center bg-gray-50 rounded border border-gray-100 p-0.5 gap-1.5">
                             {cart[p._id] > 0 && (
                               <>
                                 <button onClick={() => updateQuantity(p._id, -1)} className="w-5 h-5 bg-white rounded flex items-center justify-center hover:bg-gray-100 text-slate-900 border border-gray-100"><Minus size={10} /></button>
                                 <span className="w-3 text-center text-xs font-bold">{cart[p._id]}</span>
                               </>
                             )}
                             <button onClick={() => updateQuantity(p._id, 1)} className="w-5 h-5 bg-slate-900 text-white rounded flex items-center justify-center hover:bg-blue-600 transition-colors"><Plus size={10} /></button>
                          </div>
                          <span className="text-[10px] font-bold text-slate-900">₹{(cart[p._id] || 0) * p.price}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Floating Order Bar */}
                  {Object.keys(cart).length > 0 && (
                    <motion.div 
                      initial={{ y: 100 }} animate={{ y: 0 }}
                      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] sm:w-[calc(100%-2rem)] lg:w-[calc(100%-420px)] max-w-2xl bg-slate-900 text-white p-4 rounded-lg shadow-xl flex items-center justify-between border border-slate-700"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-blue-600 rounded flex items-center justify-center"><ShoppingBasket size={20} /></div>
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wider text-blue-400">Order Summary</p>
                          <h5 className="text-base font-semibold">{Object.values(cart).reduce((a, b) => a + b, 0)} Items Selected</h5>
                        </div>
                      </div>
                      <button onClick={handlePlaceOrder} className="px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded font-bold text-sm transition-all flex items-center gap-2">Place Order <ArrowRight size={16} /></button>
                    </motion.div>
                  )}
                </>
              )}
            </motion.div>
          )}


          {activeTab === 'Orders' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
                <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                  <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-bold text-slate-900">Active Orders</h1>
                  </div>
                  <div className="flex gap-2">
                    <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-bold uppercase tracking-wider">
                      Live: {orders.length}
                    </span>
                    <span className="px-2 py-1 bg-amber-50 text-amber-700 rounded text-xs font-bold uppercase tracking-wider">
                      Pending: {orders.filter(o => o.status === 'Pending').length}
                    </span>
                  </div>
                </div>
                <div className="space-y-4">
                  {orders.length === 0 ? (
                    <div className="py-20 text-center flex flex-col items-center justify-center gap-4">
                      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
                        <ShoppingBag size={32} />
                      </div>
                      <p className="text-slate-400 font-medium text-sm">No active orders requiring action.</p>
                      <p className="text-xs text-slate-300">New orders will appear here in real-time as they are placed.</p>
                    </div>
                  ) : (
                    orders.map(order => (
                      <div key={order.id} className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50/30 transition-all flex items-center justify-between group">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-gray-50 rounded flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                            <ShoppingBag size={18} />
                          </div>
                          <div>
                            <h4 className="font-semibold text-slate-900">{order.customer}</h4>
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">{order.product}</p>
                          </div>
                        </div>
                        <div className="text-right flex flex-col items-end gap-2">
                          <div className="flex items-center gap-2">
                            {order.status === 'Pending' && (
                              <button 
                                onClick={() => updateOrderStatus(order.id, 'Out for Delivery')}
                                className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1 shadow-sm"
                              >
                                <Truck size={12} /> Dispatch
                              </button>
                            )}
                            {order.status === 'Out for Delivery' && (
                              <button 
                                onClick={() => updateOrderStatus(order.id, 'Delivered')}
                                className="px-3 py-1 bg-slate-900 hover:bg-blue-600 text-white rounded text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1 shadow-sm"
                              >
                                <CheckCircle size={12} /> Deliver
                              </button>
                            )}
                            <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${
                              order.status === 'Pending' ? 'bg-amber-50 text-amber-700' : 
                              order.status === 'Out for Delivery' ? 'bg-blue-50 text-blue-600' :
                              'bg-blue-50 text-blue-700'
                            }`}>
                              {order.status}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{order.date}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'Clients' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { name: 'Rajesh Kumar', goal: 'Weight Loss', active: true, joined: 'Jan 2026' },
                  { name: 'Simran Kumari', goal: 'Immunity', active: true, joined: 'Feb 2026' },
                  { name: 'Amit Sharma', goal: 'Diabetes', active: false, joined: 'Dec 2025' }
                ].map((client, i) => (
                  <div key={i} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md hover:border-blue-300 transition-all group">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-slate-100 rounded flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all font-bold text-lg">
                        {client.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900">{client.name}</h4>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Joined {client.joined}</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                      <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded uppercase tracking-wider">{client.goal}</span>
                      <button className="text-slate-400 hover:text-blue-600 transition-colors"><ChevronRight size={18} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'Settings' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="max-w-3xl">
              <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm space-y-8">
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-6 border-b border-gray-100 pb-4">Store Preferences</h3>
                  <div className="space-y-4">
                    <div 
                      className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg cursor-pointer hover:border-blue-300 transition-colors"
                      onClick={() => setEmailAlerts(!emailAlerts)}
                    >
                      <div>
                        <p className="text-sm font-semibold text-slate-900 select-none">Email Notifications</p>
                        <p className="text-sm text-slate-500 mt-1 select-none">Receive alerts for new orders</p>
                      </div>
                      <div className={`w-10 h-5 rounded-full relative transition-colors ${emailAlerts ? 'bg-blue-600' : 'bg-slate-200'}`}>
                        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${emailAlerts ? 'right-1' : 'left-1'}`}></div>
                      </div>
                    </div>
                    <div 
                      className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg cursor-pointer hover:border-blue-300 transition-colors"
                      onClick={() => setAutoApprove(!autoApprove)}
                    >
                      <div>
                        <p className="text-sm font-semibold text-slate-900 select-none">Auto-Approve Orders</p>
                        <p className="text-sm text-slate-500 mt-1 select-none">Automatically accept subscription requests</p>
                      </div>
                      <div className={`w-10 h-5 rounded-full relative transition-colors ${autoApprove ? 'bg-blue-600' : 'bg-slate-200'}`}>
                        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${autoApprove ? 'right-1' : 'left-1'}`}></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="pt-6 border-t border-gray-100">
                  <button 
                    onClick={handleSavePreferences}
                    className="px-6 py-2 bg-blue-600 text-white rounded font-semibold text-sm hover:bg-blue-700 transition-all"
                  >
                    Save Changes
                  </button>
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
        <AnimatePresence>
          {successPopup && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="fixed bottom-10 right-10 z-[100] bg-white border border-gray-200 shadow-xl rounded-lg p-6 flex items-center gap-4"
              >
                <div className="w-10 h-10 bg-blue-50 rounded flex items-center justify-center text-blue-600">
                  <CheckCircle size={24} className="animate-bounce" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-slate-900">Delivered Successfully!</h4>
                  <p className="text-sm text-slate-500">Order status has been updated for the user.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default NutritionDashboard;
