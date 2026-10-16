import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  PlusIcon, 
  PencilSquareIcon, 
  TrashIcon, 
  TagIcon,
  SparklesIcon,
  XMarkIcon,
  Square3Stack3DIcon,
  FunnelIcon,
  AdjustmentsHorizontalIcon,
  MagnifyingGlassIcon
} from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: "", icon: "", description: "" });
  const [loading, setLoading] = useState(true);

  const API = import.meta.env.VITE_API_URL || "http://localhost:8000/api";
  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API}/category`);
      setCategories(res.data);
    } catch (err) {
      console.warn("Could not fetch categories (passive notice):", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const config = { headers: { Authorization: `Bearer ${token}` } };
    
    try {
      if (editingCategory) {
        await axios.put(`${API}/category/${editingCategory._id}`, formData, config);
        toast.success("Category refined successfully");
      } else {
        await axios.post(`${API}/category`, formData, config);
        toast.success("New category established");
      }
      setIsModalOpen(false);
      setEditingCategory(null);
      setFormData({ name: "", icon: "", description: "" });
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this category?")) return;
    const config = { headers: { Authorization: `Bearer ${token}` } };
    try {
      await axios.delete(`${API}/category/${id}`, config);
      toast.success("Category removed");
      fetchCategories();
    } catch (err) {
      toast.error("Deletion failed");
    }
  };

  const openEditModal = (cat) => {
    setEditingCategory(cat);
    setFormData({ name: cat.name, icon: cat.icon, description: cat.description });
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] p-6 md:p-12 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER SECTION */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 bg-indigo-100 text-indigo-600 text-[10px] font-black uppercase tracking-widest rounded-full">System Architecture</span>
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Active Database</span>
            </div>
            <h1 className="text-5xl font-black text-slate-900 tracking-tight leading-none">Health <br/><span className="text-indigo-600">Categories</span></h1>
            <p className="text-slate-400 mt-4 font-medium max-w-md">Orchestrate the primary health goals and product groupings for the entire platform.</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-2 p-4 bg-white rounded-3xl border border-white shadow-sm">
              <div className="w-10 h-10 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400">
                <Square3Stack3DIcon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Nodes</p>
                <p className="text-xl font-black text-slate-900 leading-tight">{categories.length}</p>
              </div>
            </div>
            <button 
              onClick={() => { setEditingCategory(null); setFormData({ name: "", icon: "", description: "" }); setIsModalOpen(true); }}
              className="flex items-center gap-3 bg-slate-900 text-white px-8 py-5 rounded-[2rem] font-black text-sm uppercase tracking-widest hover:bg-indigo-600 hover:shadow-2xl hover:shadow-indigo-200 transition-all active:scale-95"
            >
              <PlusIcon className="w-6 h-6" /> Create Category
            </button>
          </div>
        </header>

        {/* CONTROLS BAR */}
        <div className="bg-white/50 backdrop-blur-md rounded-[2.5rem] border border-white p-4 mb-10 flex flex-wrap items-center gap-4 shadow-sm">
          <div className="relative flex-1 min-w-[200px]">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input type="text" placeholder="Search architecture nodes..." className="w-full pl-12 pr-4 py-4 bg-white border border-slate-100 rounded-3xl outline-none focus:ring-4 focus:ring-indigo-600/5 transition-all text-sm font-medium" />
          </div>
          <button className="p-4 bg-white rounded-3xl border border-slate-100 text-slate-400 hover:text-indigo-600 transition-all">
            <FunnelIcon className="w-6 h-6" />
          </button>
          <button className="p-4 bg-white rounded-3xl border border-slate-100 text-slate-400 hover:text-indigo-600 transition-all">
            <AdjustmentsHorizontalIcon className="w-6 h-6" />
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-24">
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {categories.map((cat, i) => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0, transition: { delay: i * 0.05 } }}
                  key={cat._id} 
                  className="bg-white p-8 rounded-[3rem] border border-white shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-indigo-200/50 transition-all group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-50/50 rounded-bl-full -mr-20 -mt-20 group-hover:bg-indigo-100 transition-colors duration-500 -z-10"></div>
                  
                  <div className="flex items-start justify-between mb-8">
                    <div className="w-16 h-16 bg-white rounded-3xl shadow-lg border border-slate-50 flex items-center justify-center font-bold text-3xl group-hover:scale-110 transition-transform duration-500">
                      {cat.icon?.includes("http") ? <img src={cat.icon} className="w-10 h-10 object-contain" /> : (cat.icon || "🏷️")}
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => openEditModal(cat)} className="p-3 bg-slate-50 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-2xl transition-all">
                        <PencilSquareIcon className="w-5 h-5" />
                      </button>
                      <button onClick={() => handleDelete(cat._id)} className="p-3 bg-slate-50 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-2xl transition-all">
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight leading-tight">{cat.name}</h3>
                  <p className="text-slate-500 font-medium leading-relaxed mb-8 text-sm line-clamp-3">{cat.description}</p>
                  
                  <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[10px] font-black text-indigo-400 uppercase tracking-widest">
                      <TagIcon className="w-3 h-3" /> System Node
                    </div>
                    <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                      {new Date(cat.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-xl rounded-[3.5rem] p-10 md:p-14 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-indigo-600"></div>
              
              <div className="flex items-center justify-between mb-10">
                <div>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight">{editingCategory ? "Refine Node" : "New Architecture"}</h2>
                  <p className="text-sm text-slate-400 font-medium mt-1">Configure system category parameters.</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-3 bg-slate-50 rounded-2xl text-slate-400 hover:text-slate-600 transition-all">
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Category Title</label>
                    <input 
                      type="text"
                      required
                      placeholder="e.g. Berry Fruits"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-600/5 transition-all outline-none font-bold text-slate-800"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Visual Icon (Emoji)</label>
                    <input 
                      type="text"
                      placeholder="e.g. 🍓"
                      value={formData.icon}
                      onChange={(e) => setFormData({...formData, icon: e.target.value})}
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-600/5 transition-all outline-none font-bold text-slate-800"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Strategic Description</label>
                  <textarea 
                    rows="4"
                    placeholder="Describe the primary health value of this grouping..."
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-600/5 transition-all outline-none font-bold text-slate-800 resize-none"
                  ></textarea>
                </div>

                <div className="flex gap-4">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-5 bg-slate-50 text-slate-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-100 transition-all">Cancel</button>
                  <button type="submit" className="flex-[2] py-5 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 hover:shadow-2xl hover:shadow-indigo-200 transition-all shadow-xl">
                    {editingCategory ? "Commit Changes" : "Initialize Category"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminCategories;
