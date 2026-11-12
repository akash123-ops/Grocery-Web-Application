import React, { useMemo, useState } from 'react';
import { useAppContext } from '../context/AppContext';

const MyOrders = () => {
  const { orders, updateOrderStatus } = useAppContext();
  const [searchId, setSearchId] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesId = searchId === '' || order.id.toString().includes(searchId);
      const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
      return matchesId && matchesStatus;
    });
  }, [orders, searchId, statusFilter]);

  if (!orders.length) {
    return (
      <div className="max-w-5xl mx-auto mt-16 p-6 bg-white border border-gray-200 rounded-lg">
        <h1 className="text-2xl font-semibold mb-4">My Orders</h1>
        <p className="text-gray-600">You have no orders yet. Place an order to see it here.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto mt-16 p-6 bg-white border border-gray-200 rounded-lg">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
        <h1 className="text-2xl font-semibold">My Orders</h1>
        <div className="flex items-center gap-2 text-sm">
          <input
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            placeholder="Search by order ID"
            className="border border-gray-300 rounded px-3 py-2 w-48"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2"
          >
            <option>All</option>
            <option>Processing</option>
            <option>Shipped</option>
            <option>Delivered</option>
            <option>Cancelled</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <div key={order.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
              <div>
                <p>
                  <span className="font-semibold">Order ID:</span> {order.id}
                </p>
                <p>
                  <span className="font-semibold">Status:</span>{' '}
                  <span className={
                    order.status === 'Delivered' ? 'text-green-600' :
                    order.status === 'Cancelled' ? 'text-red-600' : 'text-orange-600'
                  }>{order.status}</span>
                </p>
              </div>

              <div className="flex items-center gap-2">
                {order.status === 'Processing' && (
                  <button
                    onClick={() => updateOrderStatus(order.id, 'Delivered')}
                    className="bg-green-600 text-white px-3 py-1 rounded hover:opacity-90 text-xs"
                  >
                    Mark Delivered
                  </button>
                )}
                {order.status !== 'Cancelled' && (
                  <button
                    onClick={() => updateOrderStatus(order.id, 'Cancelled')}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:opacity-90 text-xs"
                  >
                    Cancel Order
                  </button>
                )}
              </div>
            </div>

            <div className="mt-3">
              <p className="font-semibold">Items</p>
              <div className="space-y-2 mt-2">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 border p-2 rounded">
                    <img
                      src={item.image || 'https://via.placeholder.com/80'}
                      alt={item.name}
                      className="w-14 h-14 object-contain rounded"
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/80'; }}
                    />
                    <div className="flex-1 text-sm">
                      <p className="font-medium">{item.name}</p>
                      <p>Qty: {item.quantity}</p>
                      <p>Price: {item.price.toFixed(2)}</p>
                    </div>
                    <div className="text-sm text-right">
                      <p>Subtotal</p>
                      <p>{item.subtotal.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        ))}

        {filteredOrders.length === 0 && (
          <p className="text-gray-600">No orders match your filter.</p>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
