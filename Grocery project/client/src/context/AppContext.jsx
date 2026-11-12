import { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { dummyProducts } from "../assets/assets";
import toast from "react-hot-toast";
import axios from "axios";//user for api calls in future "sellerdeasboard" when backend is ready

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const currency = import.meta.env.VITE_APP_CURRENCY || "₹";
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [showUserLogin, setShowUserLogin] = useState(false);
  const [isSeller, setIsSeller] = useState(false);
  const [isCheckingSellerAuth, setIsCheckingSellerAuth] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState(dummyProducts);
  const [cartItems, setCartItems] = useState({});
  const [orders, setOrders] = useState([]);

  //Fetch Seller Status
  const fetchSellerStatus = async () => {
    try {
      const { data } = await axios.get('/api/seller/is-auth');
      if(data.success){
        setIsSeller(true);
        setUser(data.seller || null);
      }else{
        setIsSeller(false);
        setUser(null);
      }
    }catch(error){
      setIsSeller(false);
      setUser(null);
    }finally{
      setIsCheckingSellerAuth(false);
    }
  }

  //Check seller authentication on app mount
  useEffect(() => {
    fetchSellerStatus();
  }, []);
  const [deliveryAddress, setDeliveryAddress] = useState({
    name: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "",
    phone: "",
  });

  const clone = (obj) => {
    try {
      return typeof structuredClone === "function"
        ? structuredClone(obj)
        : JSON.parse(JSON.stringify(obj));
    } catch (e) {
      return JSON.parse(JSON.stringify(obj));
    }
  };

  const getItemId = (item) => {
    if (!item) return null;
    return typeof item === "string" ? item : item._id;
  };

  // Add product to cart
  const addToCart = (item, quantity = 1) => {
    const itemId = getItemId(item);
    if (!itemId || quantity <= 0) return;

    const cartData = clone(cartItems);

    if (cartData[itemId]) {
      cartData[itemId] += quantity;
    } else {
      cartData[itemId] = quantity;
    }

    setCartItems(cartData);
    toast.success("Added to cart");
  };

  // Update item quantity in cart
  const updateCartItem = (item, quantity) => {
    const itemId = getItemId(item);
    if (!itemId) return;
    const cartData = clone(cartItems);

    if (quantity <= 0) {
      delete cartData[itemId];
    } else {
      cartData[itemId] = quantity;
    }

    setCartItems(cartData);
    toast.success("Cart updated");
  };

  // Remove one item from cart (or by quantity)
  const removeFromCart = (item, quantity = 1) => {
    const itemId = getItemId(item);
    if (!itemId || quantity <= 0) return;

    const cartData = clone(cartItems);

    if (cartData[itemId]) {
      cartData[itemId] -= quantity;

      if (cartData[itemId] <= 0) {
        delete cartData[itemId];
      }

      setCartItems(cartData);
      toast.success("Removed from cart");
    }
  };

  // Get cart items count
  const getCartItemCount = () => {
    let totalCount = 0;

    for (const item in cartItems) {
      totalCount += cartItems[item];
    }

    return totalCount;
  };

  // Get cart total price
  const getCartTotalPrice = () => {
    let totalPrice = 0;

    for (const item in cartItems) {
      const itemInfo = products.find((product) => product._id === item);

      if (itemInfo && cartItems[item] > 0) {
        totalPrice += (itemInfo.offerPrice || itemInfo.price) * cartItems[item];
      }
    }

    return totalPrice;
  };

  const createOrder = (order) => {
    setOrders((prev) => [order, ...prev]);
  };

  const updateOrderStatus = (orderId, status) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status } : order
      )
    );
  };

  const addProduct = (product) => {
    const newProduct = {
      ...product,
      _id: product._id || `p_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      inStock: product.inStock === undefined ? true : product.inStock,
      image: product.image ? (Array.isArray(product.image) ? product.image : [product.image]) : [],
      description: Array.isArray(product.description) ? product.description : [product.description || ''],
    };
    setProducts((prev) => [newProduct, ...prev]);
    toast.success('Product added successfully');
    return newProduct;
  };

  const updateProduct = (productId, updates) => {
    setProducts((prev) =>
      prev.map((product) =>
        product._id === productId
          ? {
              ...product,
              ...updates,
              updatedAt: new Date().toISOString(),
            }
          : product
      )
    );
    toast.success('Product updated successfully');
  };

  const removeProduct = (productId) => {
    setProducts((prev) => prev.filter((product) => product._id !== productId));
    toast.success('Product removed successfully');
  };

  const value = {
    navigate,
    user,
    setUser,
    showUserLogin,
    setShowUserLogin,
    isSeller,
    setIsSeller,
    isCheckingSellerAuth,
    products,
    setProducts,
    currency,
    isLoading,
    setIsLoading,
    cartItems,
    setCartItems,
    addToCart,
    updateCartItem,
    removeFromCart,
    orders,
    setOrders,
    createOrder,
    updateOrderStatus,
    addProduct,
    updateProduct,
    removeProduct,
    searchQuery,
    setSearchQuery,
    deliveryAddress,
    setDeliveryAddress,
    getCartTotalPrice,
    getCartItemCount,
    axios
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  return useContext(AppContext);
};