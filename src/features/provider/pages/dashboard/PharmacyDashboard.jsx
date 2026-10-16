import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard,
  Users,
  Settings,
  Pill,
  ClipboardList,
  AlertTriangle,
  FileText,
  Menu,
  X as CloseIcon,
  Bell,
  LogOut,
  User,
  ShieldCheck,
  TrendingUp,
  Activity,
  Search,
  Filter,
  Plus,
  MoreVertical,
  CheckCircle2,
  Calendar,
  Download
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NavItem = ({ icon: Icon, label, active, onClick, badge }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all ${
      active 
        ? 'bg-[#fdf4f4] text-[#d92d20]' 
        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
    }`}
  >
    <Icon size={18} />
    <span className="flex-1 text-left">{label}</span>
    {badge > 0 && (
      <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-bold">
        {badge}
      </span>
    )}
  </button>
);

const StatCard = ({ label, value, trend, subtext, alert = false }) => (
  <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm flex flex-col justify-between">
    <div>
      <p className="text-gray-500 text-[11px] font-bold uppercase tracking-wider mb-2">{label}</p>
      <h4 className={`text-2xl font-bold tracking-tight mb-2 ${alert ? 'text-[#d92d20]' : 'text-gray-900'}`}>{value}</h4>
    </div>
    {trend ? (
      <p className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1 mt-auto">
        <TrendingUp size={12} /> {trend}
      </p>
    ) : subtext ? (
      <p className={`text-[11px] font-semibold mt-auto ${alert ? 'text-[#d92d20]' : 'text-gray-500'}`}>
        {subtext}
      </p>
    ) : null}
  </div>
);

// --- Sub Views ---

const PrescriptionsView = () => {
  const [searchQuery, setSearchQuery] = useState('');
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search prescriptions..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#d92d20]" 
          />
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 flex items-center justify-center gap-2">
            <Filter size={16} /> Filter
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="py-3 px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Patient / ID</th>
                <th className="py-3 px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Medications</th>
                <th className="py-3 px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Doctor</th>
                <th className="py-3 px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                <th className="py-3 px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[
                { id: 'RX-9901', patient: 'Suresh Kumar', meds: 'Metformin 500mg, Insulin 10ml', doc: 'Dr. R. Mehta', status: 'Pending Verification', alert: false },
                { id: 'RX-9902', patient: 'Ravi Mehta', meds: 'Warfarin 5mg, Aspirin 75mg', doc: 'Dr. S. Sharma', status: 'Interaction Alert', alert: true },
                { id: 'RX-9903', patient: 'Anjali Desai', meds: 'Amoxicillin 500mg (10 caps)', doc: 'Dr. V. Gupta', status: 'Verified - Ready', alert: false },
                { id: 'RX-9904', patient: 'Vikram Singh', meds: 'Telmisartan 40mg', doc: 'Dr. R. Mehta', status: 'Dispensed', alert: false },
              ].map((rx, i) => (
                <tr key={i} className="hover:bg-gray-50/50 transition">
                  <td className="py-4 px-4">
                    <p className="text-sm font-semibold text-gray-900">{rx.patient}</p>
                    <p className="text-[10px] text-gray-500 font-bold uppercase">{rx.id}</p>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-600 font-medium">{rx.meds}</td>
                  <td className="py-4 px-4 text-sm text-gray-600">{rx.doc}</td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                      rx.status === 'Dispensed' ? 'bg-emerald-50 text-emerald-700' :
                      rx.alert ? 'bg-red-50 text-red-700' :
                      rx.status.includes('Ready') ? 'bg-blue-50 text-blue-700' : 'bg-amber-50 text-amber-700'
                    }`}>
                      {rx.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    {rx.status !== 'Dispensed' ? (
                      <button className={`px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm transition ${
                        rx.alert ? 'bg-[#d92d20] text-white hover:bg-red-700' : 'bg-gray-900 text-white hover:bg-gray-800'
                      }`}>
                        {rx.alert ? 'Review' : 'Process'}
                      </button>
                    ) : (
                      <span className="text-xs font-bold text-gray-400 flex items-center justify-end gap-1">
                        <CheckCircle2 size={14} /> Done
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

const InventoryView = () => (
  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div className="relative w-full sm:w-72">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input 
          type="text" 
          placeholder="Search medicines..." 
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#d92d20]" 
        />
      </div>
      <button className="w-full sm:w-auto px-4 py-2 bg-[#d92d20] text-white rounded-lg text-sm font-semibold shadow-sm hover:bg-red-700 flex items-center justify-center gap-2">
        <Plus size={16} /> Add Stock
      </button>
    </div>

    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="py-3 px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Drug Name</th>
              <th className="py-3 px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Category</th>
              <th className="py-3 px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Stock Level</th>
              <th className="py-3 px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Expiry</th>
              <th className="py-3 px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Unit Price</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {[
              { name: 'Metformin Hydrochloride 500mg', cat: 'Anti-Diabetic', stock: 90, low: true, exp: 'Aug 2027', price: '₹4.50' },
              { name: 'Amoxicillin 500mg Capsule', cat: 'Antibiotic', stock: 450, low: false, exp: 'Dec 2025', price: '₹12.00' },
              { name: 'Atorvastatin 20mg Tablet', cat: 'Statin', stock: 120, low: false, exp: 'Jan 2028', price: '₹18.50' },
              { name: 'Azithromycin 500mg', cat: 'Antibiotic', stock: 25, low: true, exp: 'Nov 2026', price: '₹22.00' },
              { name: 'Paracetamol 650mg Tablet', cat: 'Analgesic', stock: 800, low: false, exp: 'Mar 2029', price: '₹2.00' },
            ].map((item, i) => (
              <tr key={i} className="hover:bg-gray-50/50 transition">
                <td className="py-4 px-4 font-semibold text-sm text-gray-900">{item.name}</td>
                <td className="py-4 px-4 text-sm text-gray-500">{item.cat}</td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-bold ${item.low ? 'text-[#d92d20]' : 'text-gray-900'}`}>{item.stock}</span>
                    {item.low && <span className="px-1.5 py-0.5 bg-red-50 text-[#d92d20] rounded text-[9px] font-bold uppercase tracking-wider">Low</span>}
                  </div>
                </td>
                <td className="py-4 px-4 text-sm text-gray-600">{item.exp}</td>
                <td className="py-4 px-4 text-sm font-bold text-gray-900 text-right">{item.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </motion.div>
);

const PatientsView = () => {
  const [patients] = useState([]);
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
      {patients.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center text-gray-400">
          <p className="font-semibold text-gray-600">No patient records registered yet.</p>
          <p className="text-xs text-gray-400 mt-1">Prescriptions and pharmacy orders will appear here automatically.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {patients.map((patient, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition">
              <div className="flex items-start gap-4 mb-4">
                <div className={`w-12 h-12 rounded-full ${patient.color} flex items-center justify-center font-bold text-lg shrink-0`}>
                  {patient.initials}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{patient.name}</h3>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider inline-block mt-1 ${
                    patient.type === 'High Risk' ? 'bg-red-50 text-red-700' : 'bg-gray-100 text-gray-600'
                  }`}>{patient.type}</span>
                </div>
              </div>
              <div className="space-y-2 mt-4 text-sm">
                <div className="flex justify-between items-center pb-2 border-b border-gray-50">
                  <span className="text-gray-500 font-medium">Phone</span>
                  <span className="font-semibold text-gray-900">{patient.phone}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-gray-50">
                  <span className="text-gray-500 font-medium">Auto-Refills</span>
                  <span className="font-semibold text-gray-900">{patient.refills} times</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 font-medium">Last Order</span>
                  <span className="font-semibold text-gray-900">{patient.lastVisit}</span>
                </div>
              </div>
              <button className="w-full mt-4 py-2 bg-gray-50 text-gray-700 font-semibold text-xs rounded-lg hover:bg-gray-100 transition">View History</button>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

const ReportsView = () => (
  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard label="GROSS REVENUE (YTD)" value="₹12.4L" trend="↑ 18% vs last year" />
      <StatCard label="TOTAL DISPENSATIONS" value="4,208" subtext="In the last 30 days" />
      <StatCard label="DISPENSING ERRORS" value="0" subtext="100% accuracy maintained" positive={true} />
    </div>
    
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-sm font-semibold text-gray-900">Top Moving Inventory</h3>
        <button className="text-sm font-semibold text-[#d92d20] flex items-center gap-1">Export PDF <Download size={14} /></button>
      </div>
      <div className="space-y-4">
        {[
          { name: 'Metformin 500mg', units: 1240, rev: '₹5,580', color: 'bg-blue-500' },
          { name: 'Paracetamol 650mg', units: 850, rev: '₹1,700', color: 'bg-emerald-500' },
          { name: 'Atorvastatin 20mg', units: 620, rev: '₹11,470', color: 'bg-amber-500' },
          { name: 'Amoxicillin 500mg', units: 410, rev: '₹4,920', color: 'bg-purple-500' },
        ].map((item, i) => (
          <div key={i}>
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs font-bold text-gray-700">{item.name}</span>
              <span className="text-xs font-bold text-gray-900">{item.units} units <span className="text-gray-400 font-medium">({item.rev})</span></span>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className={`h-full ${item.color}`} style={{ width: `${(item.units / 1500) * 100}%` }}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </motion.div>
);

const SettingsView = ({ pharmacyName, ownerName, licenseNumber, pharmacyInitials }) => (
  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6 max-w-3xl">
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
       <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Pharmacy Profile</h2>
          <p className="text-sm text-gray-500 mt-1">Manage your official registration and business details.</p>
       </div>
       <div className="p-6 space-y-6">
          <div className="flex items-center gap-6">
             <div className="w-20 h-20 bg-[#fdf4f4] text-[#d92d20] rounded-xl flex items-center justify-center text-2xl font-bold shadow-sm border border-[#fadcd9]">
               {pharmacyInitials}
             </div>
             <button className="px-4 py-2 border border-gray-200 text-gray-700 font-semibold text-sm rounded-lg hover:bg-gray-50">Upload Logo</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Pharmacy Name</label>
                <input type="text" defaultValue={pharmacyName} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#d92d20]" />
             </div>
             <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Owner / Admin Name</label>
                <input type="text" defaultValue={ownerName} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#d92d20]" />
             </div>
             <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Drug License Number</label>
                <input type="text" defaultValue={licenseNumber} disabled className="w-full px-4 py-2 border border-gray-200 bg-gray-50 text-gray-500 rounded-lg text-sm cursor-not-allowed" />
             </div>
          </div>
          <button className="px-6 py-2 bg-[#d92d20] text-white rounded-lg text-sm font-semibold shadow-sm hover:bg-red-700">Save Changes</button>
       </div>
    </div>

    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
       <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">System Preferences</h2>
       </div>
       <div className="p-6 space-y-4">
          {[
            { label: 'Low Stock Alerts', desc: 'Get notified when inventory items fall below minimum thresholds.' },
            { label: 'Prescription Verification', desc: 'Require manual review for scheduled drugs before dispensing.' },
            { label: 'Auto-Refill Reminders', desc: 'Automatically SMS patients when their chronic medication is due.' }
          ].map((item, i) => (
             <div key={i} className="flex justify-between items-center py-3 border-b border-gray-50 last:border-0 last:pb-0">
                <div>
                   <p className="font-semibold text-gray-900 text-sm">{item.label}</p>
                   <p className="text-xs text-gray-500">{item.desc}</p>
                </div>
                <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                    <input type="checkbox" name={`ph-toggle-${i}`} id={`ph-toggle-${i}`} defaultChecked className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 border-red-500 appearance-none cursor-pointer translate-x-5" style={{ top: '1px' }} />
                    <label htmlFor={`ph-toggle-${i}`} className="toggle-label block overflow-hidden h-5.5 rounded-full bg-red-500 cursor-pointer"></label>
                </div>
             </div>
          ))}
       </div>
    </div>
  </motion.div>
);

// --- Main Dashboard ---

const PharmacyDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Dynamic Provider Info
  const providerInfo = JSON.parse(localStorage.getItem("providerInfo") || localStorage.getItem("vendorInfo") || "{}");
  const pharmacyName = providerInfo.businessName || 'Health First Pharmacy';
  const ownerName = providerInfo.ownerName || 'Admin User';
  const pharmacyInitials = pharmacyName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'HF';
  const licenseNumber = providerInfo.licenseNumber || 'UP-LKO-2018-0341';

  return (
    <div className="flex h-screen bg-[#f8f7f5] font-sans text-slate-900 overflow-hidden">
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
        fixed inset-y-0 left-0 z-50 w-64 bg-[#f8f9fa] border-r border-gray-200 flex flex-col transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 flex items-center justify-between border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#d92d20] rounded flex items-center justify-center text-white font-bold text-sm">W</div>
            <span className="font-bold text-gray-900 tracking-tight text-sm">Wellwigen <span className="text-[#d92d20] font-semibold">Pharmacy</span></span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 text-slate-500 hover:bg-white rounded">
            <CloseIcon size={20} />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-4 overflow-y-auto">
          <NavItem icon={LayoutDashboard} label="Overview" active={activeTab === 'Overview'} onClick={() => setActiveTab('Overview')} />
          <NavItem icon={ClipboardList} label="Prescriptions" active={activeTab === 'Prescriptions'} badge={11} onClick={() => setActiveTab('Prescriptions')} />
          <NavItem icon={Pill} label="Inventory" active={activeTab === 'Inventory'} onClick={() => setActiveTab('Inventory')} />
          <NavItem icon={Users} label="Patients" active={activeTab === 'Patients'} onClick={() => setActiveTab('Patients')} />
          <NavItem icon={FileText} label="Reports" active={activeTab === 'Reports'} onClick={() => setActiveTab('Reports')} />
          <NavItem icon={Settings} label="Settings" active={activeTab === 'Settings'} onClick={() => setActiveTab('Settings')} />
        </nav>

        <div className="p-4 border-t border-gray-200 bg-[#f8f9fa]">
          <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-white transition-colors cursor-pointer" onClick={() => setActiveTab('Settings')}>
            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-slate-400 border border-gray-200 font-bold text-sm">
              {pharmacyInitials}
            </div>
            <div className="flex flex-col text-left truncate">
              <span className="text-xs font-semibold text-gray-900 truncate w-32">{pharmacyName}</span>
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest truncate w-32">{ownerName}</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="lg:hidden flex items-center justify-between p-4 border-b border-gray-100 bg-white">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsSidebarOpen(true)} className="p-2 -ml-2 text-slate-500">
              <Menu size={24} />
            </button>
            <span className="font-bold text-gray-900 text-sm">Wellwigen</span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="max-w-6xl mx-auto space-y-6">
            
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Pharmacy Dashboard</h1>
                <p className="mt-1 text-sm text-slate-600 font-medium">
                  {pharmacyName} · Drug License #{licenseNumber} · verified
                </p>
                <div className="flex items-center gap-3 mt-4">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-[#fdf4f4] text-[#d92d20] rounded-lg text-xs font-semibold border border-[#fadcd9]">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#d92d20]"></div>
                    License Verified
                  </div>
                  <button className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 flex items-center gap-1">
                    Optimize <TrendingUp size={14} className="text-gray-400" />
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button className="p-2 bg-white border border-gray-200 rounded text-slate-500 hover:text-blue-600 transition shadow-sm">
                  <Bell size={18} />
                </button>
                <button onClick={() => {
                  localStorage.removeItem("providerToken");
                  localStorage.removeItem("providerInfo");
                  localStorage.removeItem("providerStatus");
                  localStorage.removeItem("vendorToken");
                  localStorage.removeItem("vendorInfo");
                  localStorage.removeItem("vendorStatus");
                  navigate('/vendor/login');
                }} className="p-2 bg-white border border-gray-200 rounded text-slate-500 hover:text-red-600 transition shadow-sm">
                  <LogOut size={18} />
                </button>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {activeTab === 'Overview' && (
                <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                  {/* Stats Row */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <StatCard label="ORDERS TODAY" value="52" trend="↑ 6 vs avg" />
                    <StatCard label="AUTO-REFILLS" value="18" subtext="Chronic patients" />
                    <StatCard label="PENDING RX" value="11" subtext="Verification needed" />
                    <StatCard label="THIS MONTH ₹" value="84.1k" trend="↑ 15%" />
                    <StatCard label="DRUG ALERTS" value="1" subtext="Interaction flagged" alert={true} />
                  </div>

                  {/* Alert Banner */}
                  <div className="bg-[#fdf4f4] border-l-4 border-[#d92d20] rounded-r-xl p-4 flex gap-3 shadow-sm">
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-1">
                        Drug Interaction Alert
                      </h4>
                      <p className="text-sm text-gray-700">
                        Warfarin + Aspirin flagged for patient Ravi Mehta. Prescription from Dr. Mehta, NMC #DL-2021. Review required before dispensing. Order held automatically.
                      </p>
                    </div>
                  </div>

                  {/* Bottom Sections */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                    {/* Active Prescription Queue */}
                    <div className="md:col-span-2 bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="text-sm font-semibold text-gray-900">Active Prescription Queue</h3>
                        <button onClick={() => setActiveTab('Prescriptions')} className="text-xs font-semibold text-[#d92d20] hover:underline">View All</button>
                      </div>
                      
                      <div className="space-y-4">
                        {/* Item 1 */}
                        <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 border border-gray-100">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-[#fdf4f4] flex items-center justify-center">
                              <span className="text-[#d92d20] font-bold text-lg">💊</span>
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-semibold text-sm text-gray-900">Suresh Kumar — Auto-Refill</h4>
                              </div>
                              <p className="text-xs text-gray-500 mt-1">Metformin 500mg × 60 tabs · Insulin 10ml × 2</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-sm text-gray-900">₹342</p>
                            <span className="inline-block mt-1 px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded text-[10px] font-bold uppercase tracking-wider">
                              Rx verified
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Stock Alerts */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="text-sm font-semibold text-gray-900">Stock Alerts</h3>
                        <button onClick={() => setActiveTab('Inventory')} className="text-xs font-semibold text-[#d92d20] hover:underline">View Inventory</button>
                      </div>
                      
                      <div className="space-y-5">
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-xs font-semibold text-gray-700">Metformin 500</span>
                            <span className="text-xs font-bold text-gray-900 text-right leading-tight">
                              90<br/><span className="text-[10px] text-gray-500 font-normal">tabs</span>
                            </span>
                          </div>
                          <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-[#d92d20]" style={{ width: '15%' }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-xs font-semibold text-gray-700">Azithromycin 500</span>
                            <span className="text-xs font-bold text-gray-900 text-right leading-tight">
                              25<br/><span className="text-[10px] text-gray-500 font-normal">tabs</span>
                            </span>
                          </div>
                          <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-[#d92d20]" style={{ width: '10%' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                </motion.div>
              )}
              {activeTab === 'Prescriptions' && <motion.div key="prescriptions"><PrescriptionsView /></motion.div>}
              {activeTab === 'Inventory' && <motion.div key="inventory"><InventoryView /></motion.div>}
              {activeTab === 'Patients' && <motion.div key="patients"><PatientsView /></motion.div>}
              {activeTab === 'Reports' && <motion.div key="reports"><ReportsView /></motion.div>}
              {activeTab === 'Settings' && <motion.div key="settings"><SettingsView pharmacyName={pharmacyName} ownerName={ownerName} licenseNumber={licenseNumber} pharmacyInitials={pharmacyInitials} /></motion.div>}
            </AnimatePresence>

          </div>
        </main>
      </div>

      {/* Custom toggle style for Pharmacy */}
      <style dangerouslySetInnerHTML={{__html: `
        .toggle-checkbox:checked {
          right: 0;
          border-color: #f87171;
        }
        .toggle-checkbox:checked + .toggle-label {
          background-color: #f87171;
        }
        .toggle-checkbox {
          right: 0;
          z-index: 1;
          border-color: #e2e8f0;
          transition: all 0.3s;
        }
        .toggle-checkbox:checked {
          transform: translateX(100%);
          border-color: #d92d20;
        }
        .toggle-checkbox:checked + .toggle-label {
          background-color: #d92d20;
        }
        .toggle-label {
          width: 3.5rem;
          height: 1.5rem;
          background-color: #cbd5e1;
          transition: all 0.3s;
        }
      `}} />
    </div>
  );
};

export default PharmacyDashboard;
