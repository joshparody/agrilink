import API from './api';

export const getMySupplies    = ()          => API.get('/supplies/my-supplies');
export const getAllSupplies    = ()          => API.get('/supplies');
export const createSupply     = (data)      => API.post('/supplies', data);
export const updateSupply     = (id, data)  => API.patch(`/supplies/${id}`, data);
export const deleteSupply     = (id)        => API.delete(`/supplies/${id}`);