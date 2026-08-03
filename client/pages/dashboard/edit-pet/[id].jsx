import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../../context/AuthContext';
import { apiFetch } from '../../../utils/api';
import PrivateRoute from '../../../components/PrivateRoute';
import DashboardLayout from '../../../components/DashboardLayout';
import { FiSave, FiArrowLeft } from 'react-icons/fi';
import toast from 'react-hot-toast';

const inputClass = "w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 dark:focus:ring-violet-900 transition-all";
const labelClass = "block text-sm font-semibold text-gray-500 mb-1.5";

export default function EditPet() {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '', species: 'Dog', breed: '', age: '', gender: 'Male',
    image: '', healthStatus: 'Healthy', vaccinationStatus: 'Fully Vaccinated',
    location: '', adoptionFee: '', description: '', status: 'available',
  });

  useEffect(() => {
    if (!id || !user) return;
    const fetchPet = async () => {
      try {
        const pet = await apiFetch(`/api/pets/${id}`);
        if (pet.ownerEmail !== user.email) {
          toast.error('You are not authorized to edit this listing');
          router.replace('/dashboard/my-listings');
          return;
        }
        setFormData({
          name: pet.name, species: pet.species, breed: pet.breed, age: pet.age,
          gender: pet.gender, image: pet.image, healthStatus: pet.healthStatus,
          vaccinationStatus: pet.vaccinationStatus, location: pet.location,
          adoptionFee: pet.adoptionFee, description: pet.description, status: pet.status,
        });
      } catch {
        toast.error('Failed to load pet details');
        router.replace('/dashboard/my-listings');
      } finally {
        setLoading(false);
      }
    };
    fetchPet();
  }, [id, user]);

  const handleChange = (e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Number(formData.adoptionFee) < 0) { toast.error('Adoption fee cannot be negative'); return; }
    setIsSubmitting(true);
    try {
      await apiFetch(`/api/pets/${id}`, { method: 'PUT', body: formData });
      toast.success('Pet listing updated successfully!');
      router.push('/dashboard/my-listings');
    } catch (err) {
      toast.error(err.message || 'Failed to update pet listing');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <PrivateRoute>
        <DashboardLayout>
          <div className="min-h-[40vh] flex flex-col items-center justify-center gap-6">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-violet-600 rounded-full animate-spin" />
            <p className="text-gray-500 font-semibold">Loading pet details...</p>
          </div>
        </DashboardLayout>
      </PrivateRoute>
    );
  }

  return (
    <PrivateRoute>
      <DashboardLayout>
        <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-md border border-white/40 dark:border-white/5 rounded-2xl p-8">
          <div className="flex justify-between items-start flex-wrap gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Update Listing</h2>
              <p className="text-sm text-gray-500 mt-1">Modify listing details or update pet status</p>
            </div>
            <button onClick={() => router.push('/dashboard/my-listings')} className="flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition-colors">
              <FiArrowLeft /> Back
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div><label className={labelClass}>Pet Name</label><input type="text" name="name" className={inputClass} value={formData.name} onChange={handleChange} required /></div>
              <div>
                <label className={labelClass}>Species</label>
                <select name="species" className={inputClass} value={formData.species} onChange={handleChange} required>
                  {['Dog','Cat','Bird','Rabbit','Reptile','Other'].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div><label className={labelClass}>Breed</label><input type="text" name="breed" className={inputClass} value={formData.breed} onChange={handleChange} required /></div>
              <div><label className={labelClass}>Age Description</label><input type="text" name="age" className={inputClass} value={formData.age} onChange={handleChange} required /></div>
              <div>
                <label className={labelClass}>Gender</label>
                <select name="gender" className={inputClass} value={formData.gender} onChange={handleChange} required>
                  {['Male','Female','Unknown'].map(g => <option key={g}>{g}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
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
              <div>
                <label className={labelClass}>Availability Status</label>
                <select name="status" className={inputClass} value={formData.status} onChange={handleChange} required>
                  <option value="available">Available</option>
                  <option value="adopted">Adopted</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div><label className={labelClass}>Location</label><input type="text" name="location" className={inputClass} value={formData.location} onChange={handleChange} required /></div>
              <div><label className={labelClass}>Adoption Fee ($)</label><input type="number" name="adoptionFee" className={inputClass} value={formData.adoptionFee} onChange={handleChange} min="0" required /></div>
            </div>

            <div><label className={labelClass}>Image URL</label><input type="url" name="image" className={inputClass} value={formData.image} onChange={handleChange} required /></div>
            <div><label className={labelClass}>Pet Description</label><textarea name="description" className={inputClass} rows={5} value={formData.description} onChange={handleChange} required /></div>

            <div className="flex justify-end">
              <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-bold px-6 py-3 rounded-xl transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:translate-y-0">
                <FiSave /> {isSubmitting ? 'Saving changes...' : 'Save changes'}
              </button>
            </div>
          </form>
        </div>
      </DashboardLayout>
    </PrivateRoute>
  );
}
