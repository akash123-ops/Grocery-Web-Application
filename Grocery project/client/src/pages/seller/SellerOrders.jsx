import React from 'react';
import { assets } from '../../assets/assets';

const SellerOrders = () => {
  const orders = [
    { 
      id: 1, 
      items: [{ 
        product: { 
          name: "Amul Milk 1L", 
          image: assets.amul_milk_image 
        }, 
        quantity: 2 
      }], 
      address: { 
        firstName: "John", 
        lastName: "Doe", 
        street: "123 Main St", 
        city: "New York", 
        state: "NY", 
        zipcode: "10001", 
        country: "USA"
      }, 
      amount: 110.0, 
      paymentType: "Credit Card", 
      orderDate: "10/10/2024", 
      isPaid: true 
    },
    { 
      id: 2, 
      items: [{ 
        product: { 
          name: "Fresh Apple 1kg", 
          image: assets.apple_image 
        }, 
        quantity: 1 
      }], 
      address: { 
        firstName: "Jane", 
        lastName: "Smith", 
        street: "456 Oak Ave", 
        city: "Los Angeles", 
        state: "CA", 
        zipcode: "90210", 
        country: "USA"
      }, 
      amount: 120.0, 
      paymentType: "PayPal", 
      orderDate: "10/11/2024", 
      isPaid: true 
    },
    { 
      id: 3, 
      items: [{ 
        product: { 
          name: "Paneer 200g", 
          image: assets.paneer_image 
        }, 
        quantity: 3 
      }], 
      address: { 
        firstName: "Bob", 
        lastName: "Johnson", 
        street: "789 Pine Rd", 
        city: "Chicago", 
        state: "IL", 
        zipcode: "60601", 
        country: "USA"
      }, 
      amount: 270.0, 
      paymentType: "Credit Card", 
      orderDate: "10/12/2024", 
      isPaid: false 
    }
  ];

  return (
    <div className="flex-1 py-10 flex flex-col justify-between">
      <div className="w-full md:p-10 p-4 space-y-4">
        <h2 className="text-lg font-medium">Orders List</h2>
        {orders.map((order, index) => (
          <div key={index} className="flex flex-col md:grid md:grid-cols-[2fr_1fr_1fr_1fr] md:items-center gap-5 p-5 max-w-4xl rounded-md border border-gray-300 text-gray-800 bg-white shadow-sm">
            <div className="flex gap-5 items-start md:items-center">
              <>
                {order.items.map((item, i) => (
                  <div key={i} className="flex flex-col justify-center min-w-0">
                    <img className="w-12 h-12 object-cover rounded opacity-80" src={item.product.image} alt={item.product.name} />
                    <p className="font-medium text-sm mt-1 truncate">
                      {item.product.name} 
                      <span className={`text-indigo-500 ml-1 ${item.quantity < 2 ? 'hidden' : ''}`}>
                        x {item.quantity}
                      </span>
                    </p>
                  </div>
                ))}
              </>
            </div>

            <div className="text-sm">
              <p className='font-medium mb-1'>
                {order.address.firstName} {order.address.lastName}
              </p>
              <p className="text-xs">
                {order.address.street}, {order.address.city}, {order.address.state}
                <br />
                {order.address.zipcode}, {order.address.country}
              </p>
            </div>

            <p className="font-medium text-base my-auto text-black/70">
              $ {order.amount.toLocaleString()}
            </p>

            <div className="flex flex-col text-sm">
              <p>Method: {order.paymentType}</p>
              <p>Date: {order.orderDate}</p>
              <p>Payment: <span className={`font-medium ${order.isPaid ? 'text-green-600' : 'text-orange-600'}`}>
                {order.isPaid ? "Paid" : "Pending"}
              </span></p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SellerOrders;

