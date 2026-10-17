import React, { useState } from 'react';
import { CreditCard, ShieldCheck, X, Loader2 } from 'lucide-react';

const DummyPaymentGateway = ({ plan, amount, onClose, onSuccess }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242');
  const [expiry, setExpiry] = useState('12/26');
  const [name, setName] = useState(() => {
    try {
      const u = JSON.parse(localStorage.getItem('user') || localStorage.getItem('userInfo') || '{}');
      return u.name || '';
    } catch {
      return '';
    }
  });

  const handlePayment = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate network request
    setTimeout(() => {
      setIsProcessing(false);
      onSuccess();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="bg-slate-50 border-b border-gray-100 p-6 relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-teal-100 p-2 rounded-lg text-teal-600">
              <CreditCard className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Secure Payment</h2>
          </div>
          <p className="text-sm text-gray-500 flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-green-500" />
            Test Environment (Dummy Gateway)
          </p>
        </div>

        {/* Body */}
        <div className="p-6">
          <div className="mb-6 p-4 bg-teal-50 rounded-xl border border-teal-100 flex justify-between items-center">
            <div>
              <p className="text-sm text-teal-800 font-medium">{plan} Plan</p>
              <p className="text-xs text-teal-600">Subscription</p>
            </div>
            <div className="text-xl font-bold text-teal-700">{amount}</div>
          </div>

          <form onSubmit={handlePayment} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name on Card</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
              <input 
                type="text" 
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Expiry (MM/YY)</label>
                <input 
                  type="text" 
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                <input 
                  type="password" 
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  maxLength="3"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
                  required
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={isProcessing}
              className="w-full mt-6 bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-teal-500/30"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                `Pay ${amount}`
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DummyPaymentGateway;
