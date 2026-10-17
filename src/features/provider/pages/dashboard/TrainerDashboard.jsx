
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard,
  Users,
  Settings,
  Calendar,
  Dumbbell,
  CreditCard,
  Menu,
  X as CloseIcon,
  Bell,
  LogOut,
  User,
  Star,
  TrendingUp,
  Activity,
  Flame,
  ArrowUpRight,
  Search,
  Plus,
  Filter,
  CheckCircle2,
  Clock,
  ChevronRight,
  MoreVertical,
  Download
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NavItem = ({ icon: Icon, label, active, onClick, badge }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all ${
      active 
        ? 'bg-[#f3f0ff] text-[#6941c6]' 
        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
    }`}
  >
    <Icon size={18} />
    <span className="flex-1 text-left">{label}</span>
    {badge > 0 && (
      <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 text-[10px] font-bold">
        {badge}
      </span>
    )}
  </button>
);

const StatCard = ({ label, value, trend, subtext, trendIcon: TrendIcon = TrendingUp, positive = true, specialBadge }) => (
  <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
    <p className="text-gray-500 text-[11px] font-bold uppercase tracking-wider mb-2">{label}</p>
    <h4 className="text-2xl font-bold tracking-tight mb-2 text-gray-900">{value}</h4>
    {trend ? (
      <p className={`text-[11px] font-semibold flex items-center gap-1 ${positive ? 'text-emerald-600' : 'text-gray-500'}`}>
        <TrendIcon size={12} /> {trend}
      </p>
    ) : subtext ? (
      <p className={`text-[11px] font-semibold flex items-center gap-1 ${specialBadge ? 'text-amber-500' : positive ? 'text-emerald-600' : 'text-gray-500'}`}>
        {specialBadge && <Star size={12} fill="currentColor" />} {subtext}
      </p>
    ) : null}
  </div>
);

// --- Sub Views ---

const ClientsView = () => {
  const [clients, setClients] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClient, setSelectedClient] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const filteredClients = clients.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.goal.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleAddClient = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const name = formData.get('name');
    const newClient = {
      id: Date.now(),
      name: name,
      goal: formData.get('goal'),
      streak: '0d',
      progress: 'Just started',
      initials: name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'NEW',
      color: 'bg-indigo-100 text-indigo-700',
      phone: formData.get('phone'),
      email: formData.get('email'),
      joined: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      nextSession: 'Not scheduled'
    };
    setClients([newClient, ...clients]);
    setIsAddModalOpen(false);
  };

  return (
  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div className="relative w-full sm:w-72">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input 
          type="text" 
          placeholder="Search clients..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6941c6] focus:border-transparent" 
        />
      </div>
      <div className="flex gap-3 w-full sm:w-auto">
        <button className="flex-1 sm:flex-none px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 flex items-center justify-center gap-2">
          <Filter size={16} /> Filter
        </button>
        <button onClick={() => setIsAddModalOpen(true)} className="flex-1 sm:flex-none px-4 py-2 bg-[#6941c6] text-white rounded-lg text-sm font-semibold shadow-sm hover:bg-purple-700 flex items-center justify-center gap-2">
          <Plus size={16} /> Add Client
        </button>
      </div>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredClients.map((client) => (
        <div key={client.id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4 mb-4">
            <div className={`w-12 h-12 rounded-full ${client.color} flex items-center justify-center font-bold text-lg shrink-0`}>
              {client.initials}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-gray-900 truncate">{client.name}</h3>
              <span className="text-xs font-semibold text-gray-500 truncate block">{client.goal}</span>
            </div>
          </div>
          <div className="flex justify-between items-center py-3 border-t border-gray-100 mt-4">
             <div className="flex flex-col">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Streak</span>
                <span className="text-sm font-bold text-gray-900 flex items-center gap-1 mt-1"><Flame size={14} className="text-orange-500" /> {client.streak}</span>
             </div>
             <div className="flex flex-col text-right">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Progress</span>
                <span className="text-sm font-bold text-emerald-600 mt-1">{client.progress}</span>
             </div>
          </div>
          <button onClick={() => setSelectedClient(client)} className="w-full mt-4 py-2 bg-gray-50 text-gray-700 font-semibold text-xs rounded-lg hover:bg-gray-100 transition">View Contact & Details</button>
        </div>
      ))}
      
      {filteredClients.length === 0 && (
        <div className="col-span-full py-12 text-center text-gray-500">
          <p>No clients found matching your search.</p>
        </div>
      )}
    </div>

    {/* Client Details Modal */}
    <AnimatePresence>
      {selectedClient && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden"
          >
            <div className={`p-6 ${selectedClient.color.replace('text-', 'bg-opacity-20 text-')}`}>
              <div className="flex justify-between items-start mb-4">
                <div className={`w-16 h-16 rounded-full ${selectedClient.color} flex items-center justify-center font-bold text-2xl shadow-sm bg-white`}>
                  {selectedClient.initials}
                </div>
                <button onClick={() => setSelectedClient(null)} className="p-2 bg-white/50 hover:bg-white rounded-full transition">
                  <CloseIcon size={20} className="text-gray-700" />
                </button>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">{selectedClient.name}</h2>
              <p className="text-sm font-semibold text-gray-700 opacity-80 mt-1">{selectedClient.goal} · Joined {selectedClient.joined}</p>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Phone</p>
                  <p className="text-sm font-semibold text-gray-900">{selectedClient.phone}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 overflow-hidden">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Email</p>
                  <p className="text-sm font-semibold text-gray-900 truncate">{selectedClient.email}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 p-4 bg-[#f3f0ff] rounded-xl border border-[#e9d8fd]">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-[#6941c6] shadow-sm shrink-0">
                  <Calendar size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-[#6941c6] uppercase tracking-widest">Next Session</p>
                  <p className="text-sm font-bold text-gray-900">{selectedClient.nextSession}</p>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button className="flex-1 py-3 bg-gray-900 text-white rounded-xl font-bold text-sm shadow-sm hover:bg-gray-800 transition">Message</button>
                <button className="flex-1 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold text-sm shadow-sm hover:bg-gray-50 transition">Edit Plan</button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Add Client Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]"
          >
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h2 className="text-lg font-bold text-gray-900">Add New Client</h2>
              <button onClick={() => setIsAddModalOpen(false)} className="p-1 hover:bg-gray-200 rounded transition">
                <CloseIcon size={20} className="text-gray-500" />
              </button>
            </div>
            
            <form onSubmit={handleAddClient} className="p-6 overflow-y-auto space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Full Name</label>
                <input required name="name" type="text" placeholder="e.g. John Doe" className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6941c6]" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Primary Goal</label>
                <select name="goal" className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6941c6]">
                  <option value="Weight Loss">Weight Loss</option>
                  <option value="Strength">Strength & Muscle</option>
                  <option value="Flexibility">Flexibility & Yoga</option>
                  <option value="Endurance">Endurance</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Phone Number</label>
                <input required name="phone" type="tel" placeholder="+91 00000 00000" className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6941c6]" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Email Address</label>
                <input required name="email" type="email" placeholder="client@example.com" className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6941c6]" />
              </div>
              
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="flex-1 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg font-bold text-sm hover:bg-gray-50 transition">Cancel</button>
                <button type="submit" className="flex-1 py-2 bg-[#6941c6] text-white rounded-lg font-bold text-sm hover:bg-purple-700 transition shadow-sm">Save Client</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  </motion.div>
  );
};

const ScheduleView = () => (
  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
    <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
       <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition"><ChevronRight className="rotate-180 text-gray-500" size={20} /></button>
          <h2 className="font-bold text-gray-900 text-lg">Today, Oct 24</h2>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition"><ChevronRight className="text-gray-500" size={20} /></button>
       </div>
       <div className="flex gap-2">
          <button className="px-4 py-2 bg-[#f3f0ff] text-[#6941c6] font-semibold text-sm rounded-lg">Day</button>
          <button className="px-4 py-2 text-gray-500 hover:bg-gray-50 font-semibold text-sm rounded-lg">Week</button>
       </div>
    </div>

    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden p-12 text-center">
      <Calendar className="w-10 h-10 text-gray-300 mx-auto mb-3" />
      <h3 className="text-base font-bold text-gray-900 mb-1">No sessions scheduled for today</h3>
      <p className="text-xs text-gray-500 max-w-sm mx-auto">
        When clients book 1-on-1 coaching or group sessions, they will be listed here automatically.
      </p>
    </div>
  </motion.div>
);

const PlansView = () => (
  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-xl font-bold text-slate-900">Active Workout Templates</h2>
      <button className="px-4 py-2 bg-[#6941c6] text-white rounded-lg text-sm font-semibold shadow-sm hover:bg-purple-700 flex items-center gap-2">
        <Plus size={16} /> Create Plan
      </button>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
       {[
         { name: 'Fat Burner Elite', category: 'Weight Loss', weeks: 4, clients: 12, rating: 4.8 },
         { name: 'Hypertrophy Basics', category: 'Strength', weeks: 8, clients: 8, rating: 4.9 },
         { name: 'Core & Mobility', category: 'Yoga/Flexibility', weeks: 4, clients: 15, rating: 4.7 },
       ].map((plan, i) => (
         <div key={i} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
           <div className="h-32 bg-gradient-to-br from-purple-500 to-indigo-600 p-6 flex flex-col justify-between">
              <span className="self-start px-2 py-1 bg-white/20 text-white rounded text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm">{plan.category}</span>
              <h3 className="font-bold text-white text-xl tracking-tight">{plan.name}</h3>
           </div>
           <div className="p-6 flex-1 flex flex-col">
              <div className="flex justify-between items-center mb-6">
                 <div className="text-center">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Duration</p>
                    <p className="font-bold text-gray-900 mt-1">{plan.weeks} Weeks</p>
                 </div>
                 <div className="text-center">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Enrolled</p>
                    <p className="font-bold text-gray-900 mt-1">{plan.clients}</p>
                 </div>
                 <div className="text-center">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Rating</p>
                    <p className="font-bold text-gray-900 mt-1 flex items-center gap-1 justify-center"><Star size={12} className="text-amber-500" fill="currentColor"/> {plan.rating}</p>
                 </div>
              </div>
              <button className="w-full mt-auto py-2 border border-gray-200 text-gray-700 font-semibold text-sm rounded-lg hover:bg-gray-50 transition">Edit Plan</button>
           </div>
         </div>
       ))}
    </div>
  </motion.div>
);

const PaymentsView = () => (
  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
       <div className="bg-[#6941c6] text-white rounded-xl p-6 shadow-sm">
          <p className="text-purple-200 text-[11px] font-bold uppercase tracking-wider mb-2">Available for Payout</p>
          <h4 className="text-3xl font-bold tracking-tight mb-4">₹14,500</h4>
          <button className="px-4 py-2 bg-white text-[#6941c6] rounded-lg text-sm font-bold w-full">Withdraw Funds</button>
       </div>
       <StatCard label="MONTHLY EARNINGS" value="₹22,400" trend="↑ 9% vs last month" />
       <StatCard label="PENDING CLEARANCE" value="₹4,200" subtext="Usually clears in 2 days" positive={false} />
    </div>

    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
       <div className="flex justify-between items-center mb-6">
          <h3 className="text-sm font-semibold text-gray-900">Recent Transactions</h3>
          <button className="text-sm font-semibold text-[#6941c6] hover:text-purple-800 flex items-center gap-1">Download CSV <Download size={14} /></button>
       </div>
       <div className="overflow-x-auto">
       <table className="w-full text-left min-w-[480px]">
          <thead>
             <tr className="border-b border-gray-100">
                <th className="py-3 px-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date</th>
                <th className="py-3 px-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Client / Detail</th>
                <th className="py-3 px-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Amount</th>
                <th className="py-3 px-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Status</th>
             </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
             {[
               { date: 'Oct 24, 2026', desc: 'Neha Srivastava - Personal Training', amount: '+ ₹1,200', status: 'Completed', color: 'text-emerald-600', badge: 'bg-emerald-50 text-emerald-700' },
               { date: 'Oct 23, 2026', desc: 'Rajan Khanna - Online Program', amount: '+ ₹800', status: 'Pending', color: 'text-amber-600', badge: 'bg-amber-50 text-amber-700' },
               { date: 'Oct 20, 2026', desc: 'Payout to Bank ****4092', amount: '- ₹10,000', status: 'Completed', color: 'text-gray-900', badge: 'bg-gray-100 text-gray-700' },
               { date: 'Oct 18, 2026', desc: 'Priya Sharma - Diet & Training', amount: '+ ₹2,500', status: 'Completed', color: 'text-emerald-600', badge: 'bg-emerald-50 text-emerald-700' },
             ].map((tx, i) => (
                <tr key={i} className="hover:bg-gray-50">
                   <td className="py-4 px-2 text-sm text-gray-500 font-medium">{tx.date}</td>
                   <td className="py-4 px-2 text-sm font-semibold text-gray-900">{tx.desc}</td>
                   <td className={`py-4 px-2 text-sm font-bold text-right ${tx.color}`}>{tx.amount}</td>
                   <td className="py-4 px-2 text-right">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${tx.badge}`}>{tx.status}</span>
                   </td>
                </tr>
             ))}
          </tbody>
       </table>
       </div>
    </div>
  </motion.div>
);

const SettingsView = ({ trainerName, trainerTitle, trainerInitials }) => (
  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6 max-w-3xl">
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
       <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Profile Settings</h2>
          <p className="text-sm text-gray-500 mt-1">Manage your public trainer profile and certifications.</p>
       </div>
       <div className="p-6 space-y-6">
          <div className="flex items-center gap-6">
             <div className="w-20 h-20 bg-[#f3f0ff] text-[#6941c6] rounded-full flex items-center justify-center text-2xl font-bold">{trainerInitials}</div>
             <button className="px-4 py-2 border border-gray-200 text-gray-700 font-semibold text-sm rounded-lg hover:bg-gray-50">Change Avatar</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Full Name</label>
                <input type="text" defaultValue={trainerName} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6941c6]" />
             </div>
             <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Professional Title</label>
                <input type="text" defaultValue={trainerTitle} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6941c6]" />
             </div>
             <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Bio</label>
                <textarea rows="3" defaultValue="Helping busy professionals achieve their fitness goals through sustainable habits and structured training." className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6941c6]" />
             </div>
          </div>
          <button className="px-6 py-2 bg-[#6941c6] text-white rounded-lg text-sm font-semibold shadow-sm hover:bg-purple-700">Save Changes</button>
       </div>
    </div>

    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
       <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Notifications</h2>
          <p className="text-sm text-gray-500 mt-1">Control when and how you receive alerts.</p>
       </div>
       <div className="p-6 space-y-4">
          {[
            { label: 'New Client Bookings', desc: 'Receive a notification when a client books a session.' },
            { label: 'Client Messages', desc: 'Receive alerts for new chat messages.' },
            { label: 'Payment Receipts', desc: 'Get an email when a payout is processed.' }
          ].map((item, i) => (
             <div key={i} className="flex justify-between items-center py-3 border-b border-gray-50 last:border-0 last:pb-0">
                <div>
                   <p className="font-semibold text-gray-900 text-sm">{item.label}</p>
                   <p className="text-xs text-gray-500">{item.desc}</p>
                </div>
                <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                    <input type="checkbox" name="toggle" id={`toggle-${i}`} defaultChecked className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 border-purple-500 appearance-none cursor-pointer translate-x-5" style={{ top: '1px' }} />
                    <label htmlFor={`toggle-${i}`} className="toggle-label block overflow-hidden h-5.5 rounded-full bg-purple-500 cursor-pointer"></label>
                </div>
             </div>
          ))}
       </div>
    </div>
  </motion.div>
);


// --- Main Dashboard ---

const TrainerDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const providerInfo = JSON.parse(localStorage.getItem("providerInfo") || localStorage.getItem("vendorInfo") || "{}");
  const trainerName = providerInfo.ownerName || providerInfo.businessName || 'Coach';
  const trainerTitle = providerInfo.specialization || 'Certified Fitness Coach';
  const trainerInitials = (trainerName || 'CO').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'CO';

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
          <div className="flex flex-col items-start gap-1.5">
            <img
              src="/images/wellwigen-logo.webp"
              alt="Wellwigen"
              className="h-9 sm:h-10 md:h-11 w-auto object-contain select-none"
            />
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-purple-50 text-purple-700 border border-purple-200 ml-0.5">
              Trainer
            </span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 text-slate-500 hover:bg-white rounded">
            <CloseIcon size={20} />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-4 overflow-y-auto">
          <NavItem icon={LayoutDashboard} label="Dashboard" active={activeTab === 'Overview'} onClick={() => setActiveTab('Overview')} />
          <NavItem icon={Users} label="Clients" active={activeTab === 'Clients'} badge={28} onClick={() => setActiveTab('Clients')} />
          <NavItem icon={Calendar} label="Schedule" active={activeTab === 'Schedule'} onClick={() => setActiveTab('Schedule')} />
          <NavItem icon={Dumbbell} label="Workout Plans" active={activeTab === 'Plans'} onClick={() => setActiveTab('Plans')} />
          <NavItem icon={CreditCard} label="Payments" active={activeTab === 'Payments'} onClick={() => setActiveTab('Payments')} />
          <NavItem icon={Settings} label="Settings" active={activeTab === 'Settings'} onClick={() => setActiveTab('Settings')} />
        </nav>

        <div className="p-4 border-t border-gray-200 bg-[#f8f9fa]">
          <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-white transition-colors cursor-pointer" onClick={() => setActiveTab('Settings')}>
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-slate-400 border border-gray-200 font-bold text-sm">
              {trainerInitials}
            </div>
            <div className="flex flex-col text-left truncate">
              <span className="text-xs font-semibold text-gray-900 truncate w-32">{trainerName}</span>
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest truncate w-32">{trainerTitle}</span>
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
            <img
              src="/images/wellwigen-logo.webp"
              alt="Wellwigen"
              className="h-8 sm:h-9 w-auto object-contain select-none"
            />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="max-w-6xl mx-auto space-y-6">
            
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Fitness Trainer Dashboard</h1>
                <p className="mt-1 text-sm text-slate-600 font-medium">
                  {trainerName} · {trainerTitle}
                </p>
                <div className="flex items-center gap-3 mt-4">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-[#f3f0ff] text-[#6941c6] rounded-lg text-xs font-semibold border border-[#e9d8fd]">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#6941c6]"></div>
                    ACE Certified
                  </div>
                  <button className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 flex items-center gap-1">
                    Grow Clients <ArrowUpRight size={14} className="text-gray-400" />
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button className="p-2 bg-white border border-gray-200 rounded text-slate-500 hover:text-purple-600 transition shadow-sm">
                  <Bell size={18} />
                </button>
                <button onClick={() => navigate('/vendor/login')} className="p-2 bg-white border border-gray-200 rounded text-slate-500 hover:text-red-600 transition shadow-sm">
                  <LogOut size={18} />
                </button>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {activeTab === 'Overview' && (
                <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                  {/* Stats Row */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <StatCard label="SESSIONS TODAY" value="6" trend="↑ 1 vs plan" />
                    <StatCard label="ACTIVE CLIENTS" value="28" trend="↑ 4 this month" />
                    <StatCard label="THIS MONTH ₹" value="22.4k" trend="↑ 9%" />
                    <StatCard label="AVG RATING" value="4.9" subtext="Top trainer" specialBadge={true} />
                    <StatCard label="COMPLETION RATE" value="91%" subtext="Above avg" positive={true} />
                  </div>

                  {/* Bottom Sections */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Today's Sessions */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="text-sm font-semibold text-gray-900">Today's Sessions</h3>
                        <button onClick={() => setActiveTab('Schedule')} className="text-xs font-semibold text-[#6941c6] hover:underline">View All</button>
                      </div>
                      <div className="space-y-4">
                        {/* Session 1 */}
                        <div className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0">
                          <div className="w-16 text-xs font-semibold text-gray-500 pt-1">
                            6:00 AM
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-sm text-gray-900">Batch Yoga (5 members)</h4>
                              <span className="px-2 py-0.5 bg-teal-50 text-teal-700 rounded text-[10px] font-bold">Done</span>
                            </div>
                            <p className="text-xs text-gray-500">Society session · Sector 3 Park</p>
                          </div>
                        </div>

                        {/* Session 2 */}
                        <div className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0">
                          <div className="w-16 text-xs font-semibold text-gray-500 pt-1">
                            7:30 AM
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-sm text-gray-900">Neha Srivastava</h4>
                              <span className="px-2 py-0.5 bg-teal-50 text-teal-700 rounded text-[10px] font-bold">Done</span>
                            </div>
                            <p className="text-xs text-gray-500">Weight loss · Home visit · Completed workout B</p>
                          </div>
                        </div>

                        {/* Session 3 */}
                        <div className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0">
                          <div className="w-16 text-xs font-semibold text-gray-500 pt-1">
                            9:00 AM
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-sm text-gray-900">Rajan Khanna</h4>
                              <span className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded text-[10px] font-bold">In 45 min</span>
                            </div>
                            <p className="text-xs text-gray-500">Strength training · Online video session</p>
                          </div>
                        </div>

                      </div>
                    </div>

                    {/* Client Progress Tracker */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm overflow-hidden">
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="text-sm font-semibold text-gray-900">Client Progress Tracker</h3>
                        <button onClick={() => setActiveTab('Clients')} className="text-xs font-semibold text-[#6941c6] hover:underline">View All</button>
                      </div>
                      
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-gray-100">
                              <th className="py-2 px-1 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400">CLIENT</th>
                              <th className="py-2 px-1 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400">GOAL</th>
                              <th className="py-2 px-1 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400">STREAK</th>
                              <th className="py-2 px-1 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400">PROGRESS</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {/* Client 1 */}
                            <tr>
                              <td className="py-4 px-1">
                                <div className="flex items-center gap-2">
                                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-xs shrink-0">
                                    NS
                                  </div>
                                  <span className="text-sm font-semibold text-gray-900 whitespace-nowrap">Neha S.</span>
                                </div>
                              </td>
                              <td className="py-4 px-1">
                                <span className="px-2 py-1 bg-purple-50 text-purple-700 rounded-full text-[10px] font-bold">Weight Loss</span>
                              </td>
                              <td className="py-4 px-1">
                                <div className="flex items-center gap-1 text-sm font-semibold text-gray-900">
                                  <Flame size={14} className="text-orange-500" fill="currentColor" /> 14d
                                </div>
                              </td>
                              <td className="py-4 px-1">
                                <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                                  <TrendingUp size={12} /> -3.2 kg
                                </span>
                              </td>
                            </tr>
                            {/* Client 2 */}
                            <tr>
                              <td className="py-4 px-1">
                                <div className="flex items-center gap-2">
                                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs shrink-0">
                                    RK
                                  </div>
                                  <span className="text-sm font-semibold text-gray-900 whitespace-nowrap">Rajan K.</span>
                                </div>
                              </td>
                              <td className="py-4 px-1">
                                <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-[10px] font-bold">Strength</span>
                              </td>
                              <td className="py-4 px-1">
                                <div className="flex items-center gap-1 text-sm font-semibold text-gray-900">
                                  <Flame size={14} className="text-orange-500" fill="currentColor" /> 22d
                                </div>
                              </td>
                              <td className="py-4 px-1">
                                <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                                  <TrendingUp size={12} /> Bench +8 kg
                                </span>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              {activeTab === 'Clients' && <motion.div key="clients"><ClientsView /></motion.div>}
              {activeTab === 'Schedule' && <motion.div key="schedule"><ScheduleView /></motion.div>}
              {activeTab === 'Plans' && <motion.div key="plans"><PlansView /></motion.div>}
              {activeTab === 'Payments' && <motion.div key="payments"><PaymentsView /></motion.div>}
              {activeTab === 'Settings' && <motion.div key="settings"><SettingsView trainerName={trainerName} trainerTitle={trainerTitle} trainerInitials={trainerInitials} /></motion.div>}
            </AnimatePresence>

          </div>
        </main>
      </div>
      
      {/* CSS for toggle switch */}
      <style dangerouslySetInnerHTML={{__html: `
        .toggle-checkbox:checked {
          right: 0;
          border-color: #68D391;
        }
        .toggle-checkbox:checked + .toggle-label {
          background-color: #68D391;
        }
        .toggle-checkbox {
          right: 0;
          z-index: 1;
          border-color: #e2e8f0;
          transition: all 0.3s;
        }
        .toggle-checkbox:checked {
          transform: translateX(100%);
          border-color: #6941c6;
        }
        .toggle-checkbox:checked + .toggle-label {
          background-color: #6941c6;
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

export default TrainerDashboard;
