import React from 'react'
import { useLocation, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Login from './components/Login'
import AllProducts from './pages/AllProducts'
import Categories from './pages/Categories'
import Cart from './pages/Cart'
import { useAppContext } from './context/AppContext'
import ProductCategory from './pages/productCatgory'
import ProductDetail from './pages/ProductDetail'
import AddAddress from './pages/AddAddress'
import MyOrders from './pages/MyOrders'
import Seller from './pages/Seller'
import SellerLogin from './pages/SellerLogin'
import SellerDashboard from './pages/SellerDashboard'
import SellerLayout from './pages/seller/SellerLayout'
import SellerProductList from './pages/seller/SellerProductList'
import SellerOrders from './pages/seller/SellerOrders'
import Contact from './pages/Contact'

const App = () => {
  const location = useLocation();
  const isSellerpath = location.pathname.startsWith('/seller');
  const { showUserLogin, isSeller, isCheckingSellerAuth } = useAppContext();

  return (
    <div className='text-default min-h-screen text-gray-700 bg-white'>
      {isSellerpath ? null : <Navbar />}
      {showUserLogin ? <Login /> : null}

      <Toaster />

      <div className={`${isSellerpath ? "" : "px-6 md:px-16 lg:px-24 xl:px-32"}`}>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/products' element={<AllProducts />} />
          <Route path='/products/:category/:id' element={<ProductDetail />} />
          <Route path='/products/:category' element={<ProductCategory />} />
          <Route path='/categories' element={<Categories />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/orders' element={<MyOrders />} />
          <Route path='/add-address' element={<AddAddress />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/seller' element={<Seller />} />
          <Route path='/seller-login' element={<SellerLogin />} />
          <Route
            path='/seller-dashboard'
            element={isCheckingSellerAuth ? <div className='min-h-screen flex items-center justify-center'>Loading...</div> : (isSeller ? <SellerLayout /> : <SellerLogin />)}
          >
            <Route index element={<SellerDashboard />} />
            <Route path='overview' element={<SellerDashboard />} />
            <Route path='chat' element={<SellerDashboard />} />
            <Route path='product-list' element={<SellerProductList />} />
            <Route path='orders' element={<SellerOrders />} />
          </Route>
        </Routes>
      </div>

      <Footer />
    </div>
  )
}

export default App

