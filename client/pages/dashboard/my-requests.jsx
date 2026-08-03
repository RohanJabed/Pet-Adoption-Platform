import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiFetch } from '../../utils/api';
import PrivateRoute from '../../components/PrivateRoute';
import DashboardLayout from '../../components/DashboardLayout';
import ConfirmationModal from '../../components/ConfirmationModal';
import { FiEye, FiTrash2, FiCalendar, FiClock } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function MyRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [requestToCancel, setRequestToCancel] = useState(null);

  const fetchRequests = async () => {
    try {
      const data = await apiFetch('/api/requests/my-requests');
      setRequests(data);
    } catch {
      toast.error('Failed to load your requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRequests(); }, []);

  const handleConfirmCancel = async () => {
    if (!requestToCancel) return;
    try {
      await apiFetch(`/api/requests/${requestToCancel._id}`, { method: 'DELETE' });
      toast.success('Adoption request cancelled successfully');
      fetchRequests();
      setShowCancelModal(false);
    } catch (err) {
      toast.error(err.message || 'Failed to cancel request');
    }
  };

  const badgeClass = (status) =>
    `text-xs font-bold uppercase tracking-wide px-3 py-1 rounded-full ${
      status === 'approved' ? 'bg-green-100 text-green-600 border border-green-200'
      : status === 'rejected' ? 'bg-red-100 text-red-500 border border-red-200'
      : 'bg-yellow-100 text-yellow-600 border border-yellow-200'
    }`;

  if (loading) {
    return (
      <PrivateRoute>
        <DashboardLayout>
          <div className="min-h-[40vh] flex flex-col items-center justify-center gap-6">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-violet-600 rounded-full animate-spin" />
            <p className="text-gray-500 font-semibold">Loading your adoption requests...</p>
          </div>
        </DashboardLayout>
      </PrivateRoute>
    );
  }

  return (
    <PrivateRoute>
      <DashboardLayout>
        <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-md border border-white/40 dark:border-white/5 rounded-2xl p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">My Adoption Requests</h2>
            <p className="text-sm text-gray-500 mt-1">Monitor the status of your adoption applications or cancel pending ones</p>
          </div>

          {requests.length > 0 ? (
            <div className="w-full overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800">
                    {['Pet Name', 'Request Date', 'Pickup Date', 'Status', 'Actions'].map((h) => (
                      <th key={h} className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-gray-500 border-b border-gray-200 dark:border-gray-700">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {requests.map((req) => (
                    <tr key={req._id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors last:border-0">
                      <td className="px-5 py-4 font-bold text-gray-800 dark:text-white text-sm">{req.petName}</td>
                      <td className="px-5 py-4">
                        <span className="flex items-center gap-2 text-sm text-gray-500"><FiClock /> {new Date(req.createdAt).toLocaleDateString()}</span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="flex items-center gap-2 text-sm text-gray-500"><FiCalendar /> {new Date(req.pickupDate).toLocaleDateString()}</span>
                      </td>
                      <td className="px-5 py-4"><span className={badgeClass(req.status)}>{req.status}</span></td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <Link href={`/pets/${req.petId}`} className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition-colors">
                            <FiEye /> View Pet
                          </Link>
                          {req.status === 'pending' && (
                            <button onClick={() => { setRequestToCancel(req); setShowCancelModal(true); }}
                              className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-red-500 hover:text-white text-gray-700 dark:text-gray-200 transition-colors">
                              <FiTrash2 /> Cancel
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4 py-12 text-center">
              <p className="text-gray-500">You haven&apos;t submitted any adoption requests yet.</p>
              <Link href="/all-pets" className="bg-violet-600 text-white font-semibold px-5 py-2 rounded-xl text-sm hover:bg-violet-700 transition-colors">Browse Pets</Link>
            </div>
          )}
        </div>

        {showCancelModal && requestToCancel && (
          <ConfirmationModal
            title="Cancel Adoption Request"
            message={`Are you sure you want to cancel your adoption request for "${requestToCancel.petName}"? This will permanently delete your application.`}
            onConfirm={handleConfirmCancel}
            onCancel={() => setShowCancelModal(false)}
            confirmText="Yes, Cancel Request"
            isDanger
          />
        )}
      </DashboardLayout>
    </PrivateRoute>
  );
}
