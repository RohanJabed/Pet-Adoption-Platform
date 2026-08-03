import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../utils/api';
import { FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function AdoptionModal({ pet, onClose, onSuccess }) {
  const { user } = useAuth();
  const [pickupDate, setPickupDate] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getMinDate = () => {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    return today.toISOString().split('T')[0];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!pickupDate || !message) {
      toast.error('Please fill in all fields');
      return;
    }
    setIsSubmitting(true);
    try {
      await apiFetch('/api/requests', { method: 'POST', body: { petId: pet._id, pickupDate, message } });
      toast.success(`Adoption request submitted for ${pet.name}!`);
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.message || 'Failed to submit adoption request');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = "w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 dark:focus:ring-violet-900 transition-all";
  const labelClass = "block text-sm font-semibold text-gray-500 mb-1.5";

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[1000] flex items-center justify-center p-6 animate-fade-in">
      <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-lg border border-gray-200 dark:border-gray-800 shadow-2xl flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center px-6 py-5 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">Adopt {pet.name}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 dark:hover:text-white text-2xl transition-colors"><FiX /></button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="p-6 overflow-y-auto flex flex-col gap-5">
            <div>
              <label className={labelClass}>Pet Name</label>
              <input type="text" className={`${inputClass} opacity-70 cursor-not-allowed`} value={pet.name} readOnly />
            </div>
            <div>
              <label className={labelClass}>Your Name</label>
              <input type="text" className={`${inputClass} opacity-70 cursor-not-allowed`} value={user?.name || ''} readOnly />
            </div>
            <div>
              <label className={labelClass}>Your Email</label>
              <input type="email" className={`${inputClass} opacity-70 cursor-not-allowed`} value={user?.email || ''} readOnly />
            </div>
            <div>
              <label className={labelClass}>Preferred Pickup Date</label>
              <input type="date" className={inputClass} value={pickupDate} onChange={(e) => setPickupDate(e.target.value)} min={getMinDate()} required />
            </div>
            <div>
              <label className={labelClass}>Message to Owner / Shelter</label>
              <textarea className={inputClass} rows={4} placeholder="Tell the owner why you'd be a great parent..." value={message} onChange={(e) => setMessage(e.target.value)} required />
            </div>
          </div>

          <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
            <button type="button" onClick={onClose} disabled={isSubmitting} className="px-4 py-2 text-sm font-semibold bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-60">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="px-5 py-2 text-sm font-semibold bg-violet-600 hover:bg-violet-700 text-white rounded-xl transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:translate-y-0">
              {isSubmitting ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
