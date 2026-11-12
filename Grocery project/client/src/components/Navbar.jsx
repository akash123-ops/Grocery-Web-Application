import React from 'react'
import { assets } from '../assets/assets'
import { Link, useLocation } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'

const Navbar = () => {
  const {
    user,
    setUser,
    isSeller,
    setIsSeller,
    setShowUserLogin,
    navigate,
    searchQuery,
    setSearchQuery,
    cartItems
  } = useAppContext();

  const location = useLocation();
  const isHome = location.pathname === '/';


  const handleLogout = async () => {
    setUser(null);
    setIsSeller(false);
    setShowUserLogin(false);
    navigate('/');
  };

  return (
    <nav className='flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-gray-200 bg-white relative transition-all'>
      <Link to='/' onClick={() => setSearchQuery("")}>
        <img className='h-9' src={assets.logo} alt="logo" />
      </Link>

      <div className='hidden sm:flex items-center gap-8'>
        <Link to='/' className='hover:text-primary transition'>Home</Link>
        <Link to='/products' className='hover:text-primary transition'>All Products</Link>
        <Link to='/seller' className='hover:text-primary transition'>Seller</Link>
        <Link to='/contact' className='hover:text-primary transition'>Contact</Link>
      </div>

      <div className='flex items-center gap-4 md:gap-6'>
        <div className='hidden md:flex items-center text-sm gap-2 border border-gray-300 px-3 rounded-full'>
          <input
            onChange={(e) => setSearchQuery(e.target.value)}
            value={searchQuery}
            className='py-1.5 w-full bg-transparent outline-none placeholder-gray-500'
            type="text"
            placeholder='Search products'
          />
          <img src={assets.search_icon} alt="search" className='w-4 h-4' />
        </div>

        <div onClick={() => navigate('/cart')} className='relative cursor-pointer'>
          <img src={assets.nav_cart_icon} alt="cart icon" className='w-6 opacity-80' />
          <button className='absolute -top-2 -right-3 text-xs text-white bg-primary min-w-4.5 h-4.5 px-1 rounded-full'>
            {Object.keys(cartItems).length}
          </button>
        </div>

        <Link to='/seller' className='inline-flex sm:hidden rounded-full border border-primary/40 px-3 py-1.5 text-sm font-medium text-primary transition hover:bg-primary/5'>Seller</Link>

        {!user ? (
          <button
            onClick={() => setShowUserLogin(true)}
            className='cursor-pointer px-8 py-2 bg-primary hover:bg-primary-dull transition text-white rounded-full'
          >
            Login
          </button>
        ) : (
          <div className='relative group'>
            <img src={assets.profile_icon} className='w-10' alt="profile" />
            <ul className='hidden group-hover:block absolute top-10 right-0 bg-white shadow border border-gray-200 py-2.5 w-32 rounded-md text-sm z-40'>
              <li onClick={() => navigate('/cart')} className='p-1.5 pl-3 hover:bg-primary/10 cursor-pointer'>
                Cart
              </li>
              <li onClick={handleLogout} className='p-1.5 pl-3 hover:bg-primary/10 cursor-pointer'>
                Logout
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar