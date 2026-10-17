import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BadgeCheck, Star, Users } from "lucide-react";
import axios from "axios";

export default function VerifiedTrainers() {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApprovedTrainers = async () => {
      try {
        const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
        const res = await axios.get(`${API_BASE}/trainers/approved`);
        if (res.data?.success && Array.isArray(res.data.trainers)) {
          setTrainers(res.data.trainers);
        }
      } catch (err) {
        console.warn("Notice: Loading approved trainers roster:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchApprovedTrainers();
  }, []);

  return (
    <section className="w-full bg-white py-24 px-4 sm:px-6 lg:px-16 overflow-hidden">
      <div className="max-w-[1200px] mx-auto">
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <BadgeCheck className="text-teal-500 w-6 h-6" />
            <p className="text-teal-600 text-xs font-bold tracking-widest uppercase">Verified Professionals</p>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold leading-tight text-gray-900 mb-6">
            Train With Our <br className="hidden md:block" /> Elite Instructors
          </h2>
          <p className="text-gray-500 text-base max-w-2xl mx-auto">
            Every coach on our platform undergoes a rigorous clinical and professional verification process. You are in expert hands.
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="w-8 h-8 border-3 border-teal-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : trainers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {trainers.map((trainer, idx) => (
              <motion.div
                key={trainer._id || trainer.id || idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-[#f8fafc] rounded-[24px] p-6 text-center hover:shadow-xl transition-all duration-300 border border-gray-100 group"
              >
                <div className="relative w-32 h-32 mx-auto mb-6">
                  {trainer.photoUrl ? (
                    <img 
                      src={trainer.photoUrl} 
                      alt={trainer.name} 
                      className="w-full h-full object-cover rounded-full border-4 border-white shadow-md group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full border-4 border-white shadow-md bg-teal-50 text-teal-700 flex items-center justify-center text-3xl font-black">
                      {(trainer.name || 'C').charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="absolute bottom-0 right-0 bg-teal-500 p-1.5 rounded-full border-2 border-white">
                    <BadgeCheck className="w-4 h-4 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{trainer.name}</h3>
                <p className="text-teal-600 text-sm font-medium mb-4">{trainer.specialization || trainer.role || 'Fitness Coach'}</p>
                
                <div className="flex items-center justify-center gap-2 text-sm">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-bold text-gray-900">{trainer.rating || '5.0'}</span>
                  <span className="text-gray-400">({trainer.reviewsCount || 0} Reviews)</span>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 px-6 bg-[#f8fafc] rounded-3xl border border-slate-100 max-w-lg mx-auto">
            <Users className="w-12 h-12 text-teal-500 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-gray-900 mb-2">Verified Coaches Enrolling</h3>
            <p className="text-sm text-gray-500 mb-6">
              Our verified instructors are currently undergoing the onboarding and verification process. Certified fitness coaches can apply today.
            </p>
            <a
              href="/trainer/register"
              className="inline-flex items-center justify-center px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md"
            >
              Apply as a Coach
            </a>
          </div>
        )}

      </div>
    </section>
  );
}
