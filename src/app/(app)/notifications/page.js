'use client'

import Notification from '@/components/Notification'
import { getUserNotifications } from '@/services/stats';

const NotificationsPage = () => {
  return (
    <Notification fetchNotifications={getUserNotifications} />
  )
}

export default NotificationsPage;
