'use client'

import Notification from '@/components/Notification'
import { getUserNotifications } from '@/services/stats';
import Header from '@/app/(app)/Header';

const NotificationsPage = () => {
  return (
    <>
      <Header title="Notifications" />
      <Notification title="Notifications" fetchNotifications={getUserNotifications} />
    </>
  )
}

export default NotificationsPage;
