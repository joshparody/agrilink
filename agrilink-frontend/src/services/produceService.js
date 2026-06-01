import API from './api';

export const getMyListings    = ()           => API.get('/produce/my-listings');
export const getAllProduce     = (category)  => API.get('/produce', { params: category ? { category } : {} });
export const createListing    = (data)       => API.post('/produce', data);
export const updateListing    = (id, data)   => API.patch(`/produce/${id}`, data);
export const deleteListing    = (id)         => API.delete(`/produce/${id}`);