'use client';

import { useState, useEffect } from 'react';
import { getUserAlert, deleteUserAlert } from '@/services/indicators';
import { getUserNotifications } from '@/services/stats';

import { useAuth } from '@/hooks/auth';
import { ConfirmDelete } from '@/components/ConfirmDelete';
import { Toaster, toast } from 'react-hot-toast';
import { useAllIndicator } from '@/hooks/indicators';
import Modal from '@/components/Modal';
import Header from '@/app/(app)/Header'

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

  const fetchUserIndicators = async () => {
    try {
      const res = await getUserAlert(user.id);
      const notify = await getUserNotifications();
      const result = res?.data?.data;

      if (result?.length) {
        const pivots = result.map(item => ({
          ...item.pivot,
          stock_name: item.stock_name
        }));
        setUserIndicator(pivots);
      } else {
        setUserIndicator([]);
      }
    } catch (err) {
      console.error("Failed to load alert data:", err);
    }
  };

  const fetchUserNotification = async () => {
    try {
      const notify = await getUserNotifications();
      const result = notify?.data?.data;

      if (result?.length) {
        const pivots = result.map(item => item);
        console.log(pivots)
        setUserNotification(pivots);
      } else {
        setUserNotification([]);
      }
    } catch (err) {
      console.error("Failed to load notification data:", err);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchUserIndicators();
      fetchUserNotification();
    }
  }, [user.id]);


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

    try {
      await handleUpdateUserAlert(updated, updated.id);
      await fetchUserIndicators()
      toast.success("Alert updated successfully");
      setIsEditOpen(false);
    } catch (err) {
      toast.error("Failed to update alert");
    }
  };

  return (
    <>
      <Header title="Active alerts" />
      <Toaster position="top-right" />

      <div className="bg-white border border-gray-200 rounded-2xl shadow-md p-4 my-6 mx-4 md:mx-8 lg:mx-16">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Your Active Alerts</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto text-sm text-center">
            <thead className="bg-gray-100 text-gray-700 uppercase tracking-wide text-xs">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Index</th>
                <th className="px-4 py-3">Last Price</th>
                <th className="px-4 py-3">Condition</th>
                <th className="px-4 py-3">SMA Price</th>
                <th className="px-4 py-3">Timeframe</th>
                <th className="px-4 py-3">Expiry Date</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {userIndicator.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-gray-500">
                    No data available
                  </td>
                </tr>
              ) : (
                userIndicator.map((pivot, index) => {
                  const isPositive = parseFloat(pivot.last_price) >= parseFloat(pivot.sma_price);
                  const badgeColor = isPositive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600';

                  return (
                    <tr
                      key={index}
                      className="border-t hover:bg-gray-50 transition duration-150"
                    >
                      <td className="px-4 py-3 font-medium text-gray-800">{index + 1}</td>
                      <td className="px-4 py-3">{(pivot.stock_name)}</td>
                      <td className="px-4 py-3">{parseFloat(pivot.last_price).toFixed(2)}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${badgeColor}`}>
                          {pivot.prediction}
                        </span>
                      </td>
                      <td className="px-4 py-3">{parseFloat(pivot.sma_price).toFixed(2)}</td>
                      <td className="px-4 py-3 text-gray-700">{pivot.timeframe}</td>
                      <td className="px-4 py-3 text-gray-700">{pivot.expiry_at}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleEditClick(pivot)}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm transition"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => ConfirmDelete(() => deleteUserAlert(pivot.id))}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-sm transition"
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



      {isEditOpen && (
        <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title={`Edit Alert`}>
          <div className="space-y-4 text-sm">
            <div>
              <label className="block mb-1 font-medium">Prediction</label>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-1">
                  <input
                    type="radio"
                    name="prediction"
                    value="up"
                    checked={prediction === 'up'}
                    onChange={() => setPrediction('up')}
                  />
                  <span>⬆️ Crossing Up</span>
                </label>
                <label className="flex items-center gap-1">
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
                name="timeframe"
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
              <label className="block mb-1 font-medium">Set Expiry (in weeks)</label>
              <input
                type="number"
                name="expiry_weeks"
                min="1"
                max="52"
                className="w-full border rounded px-3 py-2"
                value={expiryWeeks}
                onChange={(e) => setExpiryWeeks(e.target.value)}
              />
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setIsEditOpen(false)}
                className="px-4 py-2 text-sm rounded bg-gray-100 hover:bg-gray-200 text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={updateUserAlert}
                className="px-4 py-2 text-sm rounded bg-gray-800 text-white hover:bg-gray-700"
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
