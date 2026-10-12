import React, { useState, useEffect } from 'react';
import {
  Dumbbell,
  Plus,
  Calendar,
  Clock,
  Users,
  Video,
  Filter,
  Search,
  CheckCircle2,
  X,
  AlertCircle,
} from 'lucide-react';
import { trainerApi } from '../../../services/trainerApi';

export default function TrainerClasses() {
  const [classes, setClasses] = useState([]);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newClass, setNewClass] = useState({
    title: '',
    category: 'Strength & Conditioning',
    date: 'Tomorrow, 07:00 AM IST',
    duration: '45 mins',
    capacity: 25,
    price: 499,
  });

  useEffect(() => {
    setClasses(trainerApi.getClasses());
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newClass.title.trim()) return;

    await trainerApi.createClass(newClass);
    setClasses(trainerApi.getClasses());
    setShowModal(false);
    setNewClass({
      title: '',
      category: 'Strength & Conditioning',
      date: 'Tomorrow, 07:00 AM IST',
      duration: '45 mins',
      capacity: 25,
      price: 499,
    });
  };

  const filtered = classes.filter((c) => {
    const matchesFilter = filter === 'All' || c.status === filter;
    const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase()) ||
                          c.category.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Live Group Classes</h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Schedule and host high-energy virtual group sessions with multiple attendees.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-teal-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
        >
          <Plus size={16} />
          <span>Schedule New Class</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {['All', 'Upcoming', 'Scheduled'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filter === tab
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search classes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
          />
        </div>
      </div>

      {/* Classes List */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-3">
          <Dumbbell size={40} className="mx-auto text-slate-300" />
          <h3 className="text-base font-bold text-slate-800">No classes found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {search ? 'Try clearing your search term.' : 'Click "Schedule New Class" above to set up your upcoming session.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((cls) => (
            <div
              key={cls.id}
              className="p-6 bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-5"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200/60 uppercase">
                    {cls.category}
                  </span>
                  <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    {cls.status}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 leading-snug">{cls.title}</h3>

                <div className="space-y-1.5 text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-slate-400" />
                    <span>{cls.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-slate-400" />
                    <span>{cls.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users size={14} className="text-slate-400" />
                    <span>{cls.enrolled} / {cls.capacity} Enrolled &bull; ₹{cls.price} / seat</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                <div className="text-xs">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Revenue</span>
                  <span className="font-black text-slate-900 text-sm">₹{cls.enrolled * cls.price}</span>
                </div>

                <button
                  onClick={() => alert(`Launching stream room for "${cls.title}"`)}
                  className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Video size={14} />
                  <span>Host Room</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Schedule Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-black text-slate-900">Schedule Group Class</h3>
              <button onClick={() => setShowModal(false)} className="p-1.5 text-slate-400 hover:text-slate-700">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Class Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Saturday Functional MetCon"
                  value={newClass.title}
                  onChange={(e) => setNewClass({ ...newClass, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Category
                  </label>
                  <select
                    value={newClass.category}
                    onChange={(e) => setNewClass({ ...newClass, category: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  >
                    <option value="HIIT & Conditioning">HIIT &amp; Conditioning</option>
                    <option value="Strength & Conditioning">Strength &amp; Conditioning</option>
                    <option value="Mobility & Rehab">Mobility &amp; Rehab</option>
                    <option value="Core & Abs">Core &amp; Abs</option>
                    <option value="Yoga Flow">Yoga Flow</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Duration
                  </label>
                  <select
                    value={newClass.duration}
                    onChange={(e) => setNewClass({ ...newClass, duration: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  >
                    <option value="30 mins">30 mins</option>
                    <option value="45 mins">45 mins</option>
                    <option value="50 mins">50 mins</option>
                    <option value="60 mins">60 mins</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Schedule Date &amp; Time
                </label>
                <input
                  type="text"
                  value={newClass.date}
                  onChange={(e) => setNewClass({ ...newClass, date: e.target.value })}
                  placeholder="e.g. Saturday, 08:00 AM IST"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Max Capacity (seats)
                  </label>
                  <input
                    type="number"
                    value={newClass.capacity}
                    onChange={(e) => setNewClass({ ...newClass, capacity: parseInt(e.target.value, 10) || 20 })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Price per seat (₹)
                  </label>
                  <input
                    type="number"
                    value={newClass.price}
                    onChange={(e) => setNewClass({ ...newClass, price: parseInt(e.target.value, 10) || 499 })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold"
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md shadow-teal-600/20"
                >
                  Publish Class
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
