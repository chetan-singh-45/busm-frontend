import axios from '@/lib/axios'

export const getUserNotifications = () => axios.get(`/api/userNotifications`)
export const getRecentNotifications = () => axios.get(`/api/recentNotifications`)
export const notificationStats = () => axios.get(`/api/notificationStats`)