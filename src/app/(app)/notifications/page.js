'use client';

import { useEffect, useState } from 'react';
import Notification from '@/components/Notification';
import { getUserNotifications } from '@/services/stats';
import Header from '@/app/(app)/Header';
import TableSkeleton from '@/components/skeletons/TableSkeleton';

const NotificationsPage = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Header title="Notifications" />
      {loading ? (
        <TableSkeleton />
      ) : (
        <Notification title="Notifications" fetchNotifications={getUserNotifications} />
      )}
    </>
  );
};

export default NotificationsPage;
