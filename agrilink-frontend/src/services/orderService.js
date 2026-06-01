import API from './api';

export const placeOrder       = (data)  => API.post('/orders', data);
export const getMyOrders      = ()      => API.get('/orders/my-orders');
export const getIncomingOrders= ()      => API.get('/orders/incoming');
export const updateOrderStatus= (id, status) => API.patch(`/orders/${id}/status`, { status });