import { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';
import { apiFetch } from '../../utils/api';
import PrivateRoute from '../../components/PrivateRoute';
import DashboardLayout from '../../components/DashboardLayout';
import { FiPlus } from 'react-icons/fi';
import toast from 'react-hot-toast';

const inputClass = "w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 dark:focus:ring-violet-900 transition-all";
const labelClass = "block text-sm font-semibold text-gray-500 mb-1.5";

export default function AddPet() {
  const { user } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '', species: 'Dog', breed: '', age: '', gender: 'Male',
    image: '', healthStatus: 'Healthy', vaccinationStatus: 'Fully Vaccinated',
    location: '', adoptionFee: '', description: '',
  });

  const handleChange = (e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Number(formData.adoptionFee) < 0) { toast.error('Adoption fee cannot be negative'); return; }
    setIsSubmitting(true);
    try {
      await apiFetch('/api/pets', { method: 'POST', body: formData });
      toast.success('Pet listing created successfully!');
      router.push('/dashboard/my-listings');
    } catch (err) {
      toast.error(err.message || 'Failed to create pet listing');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PrivateRoute>
      <DashboardLayout>
        <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-md border border-white/40 dark:border-white/5 rounded-2xl p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Add a New Pet Listing</h2>
            <p className="text-sm text-gray-500 mt-1">List a pet looking for adoption and review prospective families</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div><label className={labelClass}>Pet Name</label><input type="text" name="name" className={inputClass} placeholder="e.g. Buddy" value={formData.name} onChange={handleChange} required /></div>
              <div>
                <label className={labelClass}>Species</label>
                <select name="species" className={inputClass} value={formData.species} onChange={handleChange} required>
                  {['Dog','Cat','Bird','Rabbit','Reptile','Other'].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div><label className={labelClass}>Breed</label><input type="text" name="breed" className={inputClass} placeholder="e.g. Golden Retriever" value={formData.breed} onChange={handleChange} required /></div>
              <div><label className={labelClass}>Age Description</label><input type="text" name="age" className={inputClass} placeholder="e.g. 2 years" value={formData.age} onChange={handleChange} required /></div>
              <div>
                <label className={labelClass}>Gender</label>
                <select name="gender" className={inputClass} value={formData.gender} onChange={handleChange} required>
                  {['Male','Female','Unknown'].map(g => <option key={g}>{g}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>Health Status</label>
                <select name="healthStatus" className={inputClass} value={formData.healthStatus} onChange={handleChange} required>
                  {['Healthy','Mild Injury / Recovering','Special Needs','Undergoing Treatment'].map(h => <option key={h}>{h}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>Vaccination Status</label>
                <select name="vaccinationStatus" className={inputClass} value={formData.vaccinationStatus} onChange={handleChange} required>
                  {['Fully Vaccinated','Partially Vaccinated','Not Vaccinated'].map(v => <option key={v}>{v}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div><label className={labelClass}>Location (City, State)</label><input type="text" name="location" className={inputClass} placeholder="e.g. San Francisco, CA" value={formData.location} onChange={handleChange} required /></div>
              <div><label className={labelClass}>Adoption Fee ($)</label><input type="number" name="adoptionFee" className={inputClass} placeholder="e.g. 150" value={formData.adoptionFee} onChange={handleChange} min="0" required /></div>
            </div>

            <div><label className={labelClass}>Image URL</label><input type="url" name="image" className={inputClass} placeholder="e.g. https://images.unsplash.com/..." value={formData.image} onChange={handleChange} required /></div>
            <div><label className={labelClass}>Pet Description</label><textarea name="description" className={inputClass} rows={5} placeholder="Describe the pet's personality, behavior, background..." value={formData.description} onChange={handleChange} required /></div>

            <div>
              <label className={labelClass}>Owner Email (Auto-filled)</label>
              <input type="email" className={`${inputClass} opacity-70 cursor-not-allowed`} value={user?.email || ''} readOnly />
            </div>

            <div className="flex justify-end">
              <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-bold px-6 py-3 rounded-xl transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:translate-y-0">
                <FiPlus /> {isSubmitting ? 'Creating listing...' : 'Create listing'}
              </button>
            </div>
          </form>
        </div>
      </DashboardLayout>
    </PrivateRoute>
  );
}
