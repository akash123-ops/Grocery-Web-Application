import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

// User APIs
export const registerUser = (data) => api.post('/user/register', data);
export const loginUser = (data) => api.post('/user/login', data);
export const logoutUser = () => api.get('/user/logout');
export const isAuthUser = () => api.get('/user/is-auth');

// Seller APIs
export const registerSeller = (data) => api.post('/seller/register', data);
export const loginSeller = (data) => api.post('/seller/login', data);
export const logoutSeller = () => api.get('/seller/logout');
export const isAuthSeller = () => api.get('/seller/is-auth');

// Product APIs
export const getAllProducts = () => api.get('/product/list');
export const getProductById = (id) => api.get(`/product/${id}`);
export const getProductsByCategory = (category) => api.get(`/product/category/${category}`);
export const addProduct = (data) => api.post('/product/add', data);
export const updateProduct = (id, data) => api.put(`/product/${id}`, data);
export const deleteProduct = (id) => api.delete(`/product/${id}`);

// Cart APIs
export const getCart = () => api.get('/cart');
export const addToCart = (productId, quantity) => api.post('/cart/add', { productId, quantity });
export const updateCart = (productId, quantity) => api.put('/cart/update', { productId, quantity });
export const removeFromCart = (productId) => api.delete(`/cart/${productId}`);
export const clearCart = () => api.delete('/cart/clear');

// Order APIs
export const getOrders = () => api.get('/order/list');
export const getOrderById = (id) => api.get(`/order/${id}`);
export const createOrder = (data) => api.post('/order/add', data);
export const cancelOrder = (id) => api.put(`/order/cancel/${id}`);

// Address APIs
export const getAddresses = () => api.get('/address/list');
export const addAddress = (data) => api.post('/address/add', data);
export const updateAddress = (id, data) => api.put(`/address/${id}`, data);
export const deleteAddress = (id) => api.delete(`/address/${id}`);
export const setDefaultAddress = (id) => api.put(`/address/default/${id}`);

export default api;