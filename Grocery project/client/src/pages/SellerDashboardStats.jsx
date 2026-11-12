import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const SellerDashboard = () => {
    const { isSeller } = useAppContext();
    const navigate = useNavigate();
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!isSeller) {
            navigate('/seller-login');
            return;
        }

        fetchDashboardData();
    }, [isSeller, navigate]);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            setError(null);

            const token = localStorage.getItem('sellerToken');
            console.log('Token from localStorage:', token);

            if (!token) {
                throw new Error('No authentication token found');
            }

            console.log('Making API call to dashboard...');
            const response = await axios.get('http://localhost:5000/api/seller/dashboard', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            console.log('API Response:', response.data);

            if (response.data.success) {
                setDashboardData(response.data.data);
            } else {
                throw new Error(response.data.message || 'Failed to fetch dashboard data');
            }
        } catch (err) {
            console.error('Dashboard fetch error:', err);
            console.error('Error response:', err.response?.data);
            setError(err.message);
            toast.error('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="py-10 flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="py-10 flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="text-red-500 mb-4">
                        <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Dashboard</h2>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button
                        onClick={fetchDashboardData}
                        className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="py-10 px-4 md:px-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Seller Dashboard</h1>
                <p className="text-gray-600 mt-2">Welcome to your seller dashboard. Here's an overview of your store.</p>
            </div>

            {dashboardData && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow-md border">
                        <div className="flex items-center">
                            <div className="p-3 bg-blue-100 rounded-full">
                                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-semibold text-gray-800">Total Products</h3>
                                <p className="text-2xl font-bold text-blue-600">{dashboardData.totalProducts}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md border">
                        <div className="flex items-center">
                            <div className="p-3 bg-green-100 rounded-full">
                                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-semibold text-gray-800">Total Orders</h3>
                                <p className="text-2xl font-bold text-green-600">{dashboardData.totalOrders}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md border">
                        <div className="flex items-center">
                            <div className="p-3 bg-yellow-100 rounded-full">
                                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-semibold text-gray-800">Total Revenue</h3>
                                <p className="text-2xl font-bold text-yellow-600">₹{dashboardData.totalRevenue.toFixed(2)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="mt-8">
                <div className="bg-white p-6 rounded-lg shadow-md border">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <button
                            onClick={() => navigate('/seller')}
                            className="flex items-center justify-center p-4 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                        >
                            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Add Product
                        </button>
                        <button
                            onClick={() => navigate('/seller/product-list')}
                            className="flex items-center justify-center p-4 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            View Products
                        </button>
                        <button
                            onClick={() => navigate('/seller/orders')}
                            className="flex items-center justify-center p-4 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            View Orders
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SellerDashboard;