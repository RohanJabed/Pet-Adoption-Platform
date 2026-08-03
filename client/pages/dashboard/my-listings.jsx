import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiFetch } from '../../utils/api';
import PrivateRoute from '../../components/PrivateRoute';
import DashboardLayout from '../../components/DashboardLayout';
import ConfirmationModal from '../../components/ConfirmationModal';
import { FiEye, FiEdit, FiTrash2, FiUsers, FiX, FiCheck, FiMinusCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function MyListings() {
  const [listings, setListings] = useState([]);
  const [stats, setStats] = useState({ total: 0, available: 0, adopted: 0 });
  const [loading, setLoading] = useState(true);
  const [showRequestsModal, setShowRequestsModal] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);
  const [petRequests, setPetRequests] = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [petToDelete, setPetToDelete] = useState(null);

  const fetchListings = async () => {
    try {
      const data = await apiFetch('/api/pets/my-listings');
      setListings(data.listings);
      setStats(data.stats);
    } catch {
      toast.error('Failed to load listings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchListings(); }, []);

  const handleConfirmDelete = async () => {
    if (!petToDelete) return;
    try {
      await apiFetch(`/api/pets/${petToDelete._id}`, { method: 'DELETE' });
      toast.success(`${petToDelete.name} deleted successfully`);
      fetchListings();
      setShowDeleteModal(false);
    } catch (err) {
      toast.error(err.message || 'Failed to delete pet listing');
    }
  };

  const handleRequestsClick = async (pet) => {
    setSelectedPet(pet);
    setShowRequestsModal(true);
    setRequestsLoading(true);
    try {
      const requests = await apiFetch(`/api/requests/listings/${pet._id}`);
      setPetRequests(requests);
    } catch {
      toast.error('Failed to load adoption requests');
      setShowRequestsModal(false);
    } finally {
      setRequestsLoading(false);
    }
  };

  const handleRequestAction = async (requestId, status) => {
    try {
      await apiFetch(`/api/requests/${requestId}`, { method: 'PUT', body: { status } });
      toast.success(`Request successfully ${status}!`);
      if (selectedPet) {
        const updated = await apiFetch(`/api/requests/listings/${selectedPet._id}`);
        setPetRequests(updated);
      }
      fetchListings();
    } catch (err) {
      toast.error(err.message || 'Failed to update request status');
    }
  };

  const badgeClass = (status) =>
    `text-xs font-bold uppercase tracking-wide px-3 py-1 rounded-full ${
      status === 'available' || status === 'approved'
        ? 'bg-green-100 text-green-600 border border-green-200'
        : status === 'pending'
        ? 'bg-yellow-100 text-yellow-600 border border-yellow-200'
        : 'bg-red-100 text-red-500 border border-red-200'
    }`;

  if (loading) {
    return (
      <PrivateRoute>
        <DashboardLayout>
          <div className="min-h-[40vh] flex flex-col items-center justify-center gap-6">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-violet-600 rounded-full animate-spin" />
            <p className="text-gray-500 font-semibold">Loading your listings...</p>
          </div>
        </DashboardLayout>
      </PrivateRoute>
    );
  }

  return (
    <PrivateRoute>
      <DashboardLayout>
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
          {[
            { label: 'Total Listings', value: stats.total, color: 'text-violet-600' },
            { label: 'Available for Adoption', value: stats.available, color: 'text-green-500' },
            { label: 'Adopted', value: stats.adopted, color: 'text-red-500' },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-md border border-white/40 dark:border-white/5 rounded-2xl p-6">
              <h3 className={`text-4xl font-extrabold ${color} mb-1`}>{value}</h3>
              <p className="text-sm font-semibold text-gray-500">{label}</p>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-md border border-white/40 dark:border-white/5 rounded-2xl p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">My Pet Listings</h2>
            <p className="text-sm text-gray-500 mt-1">Update your listings, view adoption requests, or remove listings</p>
          </div>

          {listings.length > 0 ? (
            <div className="w-full overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800">
                    {['Pet', 'Species / Breed', 'Fee', 'Status', 'Actions'].map((h) => (
                      <th key={h} className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-gray-500 border-b border-gray-200 dark:border-gray-700">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {listings.map((pet) => (
                    <tr key={pet._id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors last:border-0">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <img src={pet.image} alt={pet.name} className="w-12 h-12 rounded-xl object-cover" />
                          <div>
                            <p className="font-bold text-gray-800 dark:text-white text-sm">{pet.name}</p>
                            <p className="text-xs text-gray-400">{pet.location}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-sm text-gray-700 dark:text-gray-200">{pet.species}</p>
                        <p className="text-xs text-gray-400">{pet.breed}</p>
                      </td>
                      <td className="px-5 py-4 font-semibold text-gray-700 dark:text-gray-200">${pet.adoptionFee}</td>
                      <td className="px-5 py-4"><span className={badgeClass(pet.status)}>{pet.status}</span></td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2 flex-wrap">
                          <button onClick={() => handleRequestsClick(pet)} className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition-colors">
                            <FiUsers /> Requests
                          </button>
                          <Link href={`/pets/${pet._id}`} className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors"><FiEye /></Link>
                          {pet.status === 'available' && (
                            <Link href={`/dashboard/edit-pet/${pet._id}`} className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors"><FiEdit /></Link>
                          )}
                          <button onClick={() => { setPetToDelete(pet); setShowDeleteModal(true); }} className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-red-500 hover:text-white text-gray-600 dark:text-gray-300 transition-colors"><FiTrash2 /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4 py-12 text-center">
              <p className="text-gray-500">You haven&apos;t listed any pets yet.</p>
              <Link href="/dashboard/add-pet" className="bg-violet-600 text-white font-semibold px-5 py-2 rounded-xl text-sm hover:bg-violet-700 transition-colors">Add Your First Pet</Link>
            </div>
          )}
        </div>

        {/* Requests Modal */}
        {showRequestsModal && selectedPet && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[1000] flex items-center justify-center p-6">
            <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-2xl border border-gray-200 dark:border-gray-800 shadow-2xl flex flex-col max-h-[90vh]">
              <div className="flex justify-between items-center px-6 py-5 border-b border-gray-200 dark:border-gray-800">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">Adoption Requests for {selectedPet.name}</h2>
                <button onClick={() => setShowRequestsModal(false)} className="text-gray-400 hover:text-gray-700 dark:hover:text-white text-2xl transition-colors"><FiX /></button>
              </div>
              <div className="p-6 overflow-y-auto flex-1">
                {requestsLoading ? (
                  <div className="flex justify-center items-center min-h-[150px]">
                    <div className="w-10 h-10 border-4 border-gray-200 border-t-violet-600 rounded-full animate-spin" />
                  </div>
                ) : petRequests.length > 0 ? (
                  <div className="flex flex-col gap-4">
                    {petRequests.map((req) => (
                      <div key={req._id} className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-bold text-gray-800 dark:text-white">{req.requesterName}</h4>
                            <p className="text-xs text-gray-400">{req.requesterEmail}</p>
                          </div>
                          <span className={badgeClass(req.status)}>{req.status}</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300"><strong>Pickup Date:</strong> {new Date(req.pickupDate).toLocaleDateString()}</p>
                        <p className="text-sm text-gray-500 bg-white dark:bg-gray-900 rounded-lg px-3 py-2 mt-2"><strong>Message:</strong> &ldquo;{req.message}&rdquo;</p>
                        {req.status === 'pending' && selectedPet.status === 'available' && (
                          <div className="flex justify-end gap-3 mt-4">
                            <button onClick={() => handleRequestAction(req._id, 'rejected')} className="flex items-center gap-1 text-sm font-semibold px-4 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600 transition-colors">
                              <FiMinusCircle /> Reject
                            </button>
                            <button onClick={() => handleRequestAction(req._id, 'approved')} className="flex items-center gap-1 text-sm font-semibold px-4 py-2 rounded-xl bg-violet-600 text-white hover:bg-violet-700 transition-colors">
                              <FiCheck /> Approve
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center min-h-[150px] text-gray-500 text-sm">
                    No adoption requests have been submitted for {selectedPet.name} yet.
                  </div>
                )}
              </div>
              <div className="flex justify-end px-6 py-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                <button onClick={() => setShowRequestsModal(false)} className="text-sm font-semibold px-4 py-2 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">Close</button>
              </div>
            </div>
          </div>
        )}

        {showDeleteModal && petToDelete && (
          <ConfirmationModal
            title="Delete Pet Listing"
            message={`Are you sure you want to delete the listing for "${petToDelete.name}"? This action cannot be undone.`}
            onConfirm={handleConfirmDelete}
            onCancel={() => setShowDeleteModal(false)}
            confirmText="Delete"
            isDanger
          />
        )}
      </DashboardLayout>
    </PrivateRoute>
  );
}
