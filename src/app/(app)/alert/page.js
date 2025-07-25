'use client';

import { useState, useEffect } from 'react';
import { getUserAlert, deleteUserAlert } from '@/services/indicators';
import { getUserNotifications } from '@/services/stats';
import { useAuth } from '@/hooks/auth';
import { ConfirmDelete } from '@/components/ConfirmDelete';
import { Toaster, toast } from 'react-hot-toast';
import { useAllIndicator } from '@/hooks/indicators';
import Modal from '@/components/Modal';
import Header from '@/app/(app)/Header';
import TableSkeleton from '@/components/skeletons/TableSkeleton';

export default function Alert() {
  const { user } = useAuth();
  const [userIndicator, setUserIndicator] = useState([]);
  const [userNotification, setUserNotification] = useState([]);
  const { handleUpdateUserAlert } = useAllIndicator();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [prediction, setPrediction] = useState('');
  const [timeframe, setTimeframe] = useState('');
  const [expiryWeeks, setExpiryWeeks] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserIndicators = async () => {
    try {
      const res = await getUserAlert(user.id);
      const result = res?.data?.data;
      const pivots = result?.map(item => ({
        ...item.pivot,
        stock_name: item.stock_name,
      })) || [];
      setUserIndicator(pivots);
    } catch (err) {
      console.error("Failed to load alert data:", err);
    }
  };

  const fetchUserNotification = async () => {
    try {
      const notify = await getUserNotifications();
      const result = notify?.data?.data || [];
      setUserNotification(result);
    } catch (err) {
      console.error("Failed to load notification data:", err);
    }
  };

  useEffect(() => {
    const fetchAllData = async () => {
      if (!user?.id) return;

      setIsLoading(true);
      await Promise.all([fetchUserIndicators(), fetchUserNotification()]);
      setIsLoading(false);
    };

    fetchAllData();
  }, [user?.id]);

  const expiryWeeksFromDate = (expiry_at) => {
    const expiry = new Date(expiry_at);
    const now = new Date();
    const diffTime = expiry - now;
    const diffWeeks = Math.round(diffTime / (1000 * 60 * 60 * 24 * 7));
    return diffWeeks > 0 ? diffWeeks : 1;
  };

  const handleEditClick = (pivot) => {
    setEditData(pivot);
    setPrediction(pivot.prediction);
    setTimeframe(pivot.timeframe);
    setExpiryWeeks(expiryWeeksFromDate(pivot.expiry_at));
    setIsEditOpen(true);
  };

  const updateUserAlert = async () => {
    if (!editData) return;

      const updated = {
        id: editData.id,
        prediction,
        timeframe,
        expiry_weeks: parseInt(expiryWeeks, 10),
      };

      const toastId = toast.loading('Updating alert...');

      try {
        await handleUpdateUserAlert(updated, updated.id);
        await fetchUserIndicators();
        toast.success('Alert updated successfully', { id: toastId });
        setIsEditOpen(false);
      } catch (err) {
        toast.error('Failed to update alert', { id: toastId });
      } 
    };

  return (
    <>
      <Header title="Active alerts" subtitle="Configure technical analysis alerts for your favorite indices" />
      <Toaster position="top-right" />

      {isLoading ? (
        <TableSkeleton />
      ) : (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-md p-4 md:p-6 m-2 md:m-4">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">Your Active Alerts</h2>
          <div className="w-full overflow-x-auto">
            <table className="min-w-[768px] w-full text-sm text-center border-collapse">
              <thead className="bg-gray-100 text-gray-700 uppercase tracking-wide text-xs">
                <tr>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Index</th>
                  <th className="px-4 py-3">Last Price</th>
                  <th className="px-4 py-3">Condition</th>
                  <th className="px-4 py-3">SMA Price</th>
                  <th className="px-4 py-3">Timeframe</th>
                  <th className="px-4 py-3">Expiry</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {userIndicator.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-6 text-gray-500">
                      No data available
                    </td>
                  </tr>
                ) : (
                  userIndicator.map((pivot, index) => {
                    const isPositive = parseFloat(pivot.last_price) >= parseFloat(pivot.sma_price);
                    const badgeColor = isPositive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600';

                    return (
                      <tr key={index} className="border-t hover:bg-gray-50">
                        <td className="px-4 py-3">{index + 1}</td>
                        <td className="px-4 py-3">{pivot.stock_name}</td>
                        <td className="px-4 py-3">{parseFloat(pivot.last_price).toFixed(2)}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${badgeColor}`}>
                            {pivot.prediction}
                          </span>
                        </td>
                        <td className="px-4 py-3">{parseFloat(pivot.sma_price).toFixed(2)}</td>
                        <td className="px-4 py-3">{pivot.timeframe}</td>
                        <td className="px-4 py-3">{pivot.expiry_at}</td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap justify-center gap-2">
                            <button
                              onClick={() => handleEditClick(pivot)}
                              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-sm"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => ConfirmDelete(() => deleteUserAlert(pivot.id).then(fetchUserIndicators))}
                              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {isEditOpen && (
        <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Edit Alert">
          <div className="space-y-4 text-sm">
            <div>
              <label className="block mb-1 font-medium">Prediction</label>
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="prediction"
                    value="up"
                    checked={prediction === 'up'}
                    onChange={() => setPrediction('up')}
                  />
                  <span>⬆️ Crossing Up</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="prediction"
                    value="down"
                    checked={prediction === 'down'}
                    onChange={() => setPrediction('down')}
                  />
                  <span>⬇️ Crossing Down</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block mb-1 font-medium">Time Frame</label>
              <select
                className="w-full border rounded px-3 py-2"
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
              >
                <option value="">Choose Time Frame</option>
                <option value="daily">Daily</option>
                <option value="hourly">Hourly</option>
                <option value="15-min">15-min</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 font-medium">Set Expiry (weeks)</label>
              <input
                type="number"
                min="1"
                max="52"
                className="w-full border rounded px-3 py-2"
                value={expiryWeeks}
                onChange={(e) => setExpiryWeeks(e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <button
                onClick={() => setIsEditOpen(false)}
                className="px-4 py-2 text-sm rounded bg-gray-100 hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={updateUserAlert}
                className="px-4 py-2 text-sm rounded bg-blue-600 hover:bg-blue-700 text-white"
              >
                Save Changes
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
