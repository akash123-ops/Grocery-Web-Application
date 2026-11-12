import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const Cart = () => {
  const {
    products,
    cartItems,
    currency,
    addToCart,
    removeFromCart,
    navigate,
    deliveryAddress,
    setDeliveryAddress,
    setCartItems,
    createOrder,
  } = useAppContext();

  const [liveLocationEnabled, setLiveLocationEnabled] = useState(false);

  const useLiveLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported by the browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        const fakeAddress = {
          name: deliveryAddress.name || "",
          street: `Current location: ${latitude.toFixed(5)}, ${longitude.toFixed(5)}`,
          city: deliveryAddress.city || "",
          state: deliveryAddress.state || "",
          zip: deliveryAddress.zip || "",
          country: deliveryAddress.country || "",
          phone: deliveryAddress.phone || "",
        };

        setDeliveryAddress(fakeAddress);
        toast.success("Live location applied. You can still edit it.");
      },
      () => {
        toast.error("Unable to get current location. Please allow location access.");
      },
      { timeout: 15000 }
    );
  };

  const paymentMethods = ["Credit Card", "Debit Card", "Net Banking", "UPI", "Cash on Delivery"];
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(paymentMethods[0]);

  const cartProducts = products.filter((product) => cartItems[product._id]);

  const totalAmount = cartProducts.reduce(
    (total, product) => total + product.offerPrice * cartItems[product._id],
    0
  );

  const shippingFee = cartProducts.length > 0 ? 50 : 0;
  const taxAmount = Number((totalAmount * 0.12).toFixed(2));
  const finalTotal = Number((totalAmount + shippingFee + taxAmount).toFixed(2));

  const placeOrder = () => {
    if (cartProducts.length === 0) {
      toast.error("Cart is empty.");
      return;
    }

    const order = {
      id: Date.now(),
      items: cartProducts.map((product) => ({
        id: product._id,
        name: product.name,
        image: product.image?.[0] || '',
        quantity: cartItems[product._id],
        price: product.offerPrice,
        subtotal: product.offerPrice * cartItems[product._id],
      })),
      totalItems: cartProducts.reduce((total, product) => total + cartItems[product._id], 0),
      subtotal: totalAmount,
      shippingFee,
      taxAmount,
      totalAmount: finalTotal,
      paymentMethod: selectedPaymentMethod,
      deliveryAddress,
      status: "Processing",
      createdAt: new Date().toLocaleString(),
    };

    createOrder(order);
    setCartItems({});

    toast.success("Order placed successfully!\nAddress and payment details confirmed.");
    navigate("/orders");
  };

  return (
    <div className="max-w-6xl w-full py-8">
      <h1 className="text-2xl md:text-3xl font-semibold mb-2">My Cart</h1>
      <div className="w-20 h-1 bg-primary rounded mb-8"></div>

      {cartProducts.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-xl text-gray-600 mb-4">Your cart is empty</p>
          <button
            onClick={() => navigate("/products")}
            className="bg-primary text-white px-6 py-3 rounded-lg hover:opacity-90 transition"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cartProducts.map((product) => (
              <div
                key={product._id}
                className="flex items-center gap-4 border border-gray-200 rounded-lg p-4 bg-white"
              >
                <img
                  src={product.image[0]}
                  alt={product.name}
                  className="w-20 h-20 object-contain"
                />

                <div className="flex-1">
                  <h2 className="text-lg font-medium text-gray-800">
                    {product.name}
                  </h2>
                  <p className="text-sm text-gray-500">{product.category}</p>
                  <p className="text-indigo-500 font-semibold mt-1">
                    {currency}
                    {product.offerPrice}
                  </p>
                </div>

                <div className="flex items-center gap-3 bg-indigo-500/10 rounded px-2 py-1">
                  <button
                    onClick={() => removeFromCart(product)}
                    className="text-lg px-2"
                  >
                    -
                  </button>
                  <span className="w-6 text-center">
                    {cartItems[product._id]}
                  </span>
                  <button
                    onClick={() => addToCart(product, 1)}
                    className="text-lg px-2"
                  >
                    +
                  </button>
                </div>

                <p className="font-semibold text-gray-800 min-w-22.5 text-right">
                  {currency}
                  {product.offerPrice * cartItems[product._id]}
                </p>
              </div>
            ))}
          </div>

          <div className="border border-gray-200 rounded-lg p-6 bg-white h-fit">
            <h2 className="text-xl font-semibold mb-4">Cart Summary</h2>

            <div className="mb-4">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-semibold text-gray-700">Delivery Address</h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={useLiveLocation}
                    className="text-xs text-secondary hover:underline"
                  >
                    Use Live Location
                  </button>
                  <button
                    onClick={() => navigate("/add-address")}
                    className="text-xs text-primary hover:underline"
                  >
                    Edit Address
                  </button>
                </div>
              </div>
              <label className="flex items-center gap-2 mb-2 text-sm">
                <input
                  type="checkbox"
                  checked={liveLocationEnabled}
                  onChange={(e) => {
                    const value = e.target.checked;
                    setLiveLocationEnabled(value);
                    if (value) useLiveLocation();
                  }}
                  className="accent-primary"
                />
                Use live location automatically
              </label>
              {deliveryAddress.name || deliveryAddress.street ? (
                <>
                  <p className="text-sm text-gray-600">{deliveryAddress.name}</p>
                  <p className="text-sm text-gray-600">
                    {deliveryAddress.street}
                    {deliveryAddress.city ? `, ${deliveryAddress.city}` : ""}
                    {deliveryAddress.state ? `, ${deliveryAddress.state}` : ""}
                    {deliveryAddress.zip ? `, ${deliveryAddress.zip}` : ""}
                    {deliveryAddress.country ? `, ${deliveryAddress.country}` : ""}
                  </p>
                  <p className="text-sm text-gray-600">Phone: {deliveryAddress.phone}</p>
                </>
              ) : (
                <div className="text-sm text-red-500">
                  No delivery address entered. Please add your address or use live location.
                </div>
              )}
            </div>

            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-700">Payment Method</h3>
              <div className="space-y-1 mt-2">
                {paymentMethods.map((method) => (
                  <label key={method} className="flex items-center gap-2 text-sm text-gray-600">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method}
                      checked={selectedPaymentMethod === method}
                      onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                      className="accent-primary"
                    />
                    {method}
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-between text-gray-600 mb-3">
              <span>Items</span>
              <span>{cartProducts.length}</span>
            </div>

            <div className="flex justify-between text-gray-600 mb-3">
              <span>Total Quantity</span>
              <span>
                {cartProducts.reduce(
                  (total, product) => total + cartItems[product._id],
                  0
                )}
              </span>
            </div>

            <div className="border-t pt-4 mt-4 space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>
                  {currency}
                  {totalAmount.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping Fee</span>
                <span>
                  {currency}
                  {shippingFee.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax (12%)</span>
                <span>
                  {currency}
                  {taxAmount.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-lg font-semibold border-t pt-3">
                <span>Total Amount</span>
                <span>
                  {currency}
                  {finalTotal.toFixed(2)}
                </span>
              </div>
            </div>

            <button
              onClick={placeOrder}
              className="w-full mt-6 bg-primary text-white py-3 rounded-lg hover:opacity-90 transition"
            >
              Place Order
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;