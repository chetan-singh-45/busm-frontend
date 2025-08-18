import axios from '@/lib/axios'

// export const getTickets = () => axios.get('/api/tickets');
export const getTickets = (params = {}) => axios.get('/api/tickets', { params });

export const createTickets = (tickets) => axios.post('/api/tickets', tickets);
export const showTickets = (id) => axios.get(`/api/tickets/${id}`);
export const replyTickets = (tickets,id) => axios.post(`/api/tickets/${id}/reply`, tickets);
export const updateTicketStatus = (id, status) => axios.put(`/api/tickets/${id}/status`, { status });

