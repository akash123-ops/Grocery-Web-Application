import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'

const AddAddress = () => {
  const { deliveryAddress, setDeliveryAddress } = useAppContext();
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    name: deliveryAddress.name || '',
    street: deliveryAddress.street || '',
    city: deliveryAddress.city || '',
    state: deliveryAddress.state || '',
    zip: deliveryAddress.zip || '',
    country: deliveryAddress.country || '',
    phone: deliveryAddress.phone || '',
  });
  const [addressMode, setAddressMode] = useState('manual');

  const selectAddressMode = (mode) => {
    setAddressMode(mode);
    if (mode === 'live') {
      fillCurrentLocation();
    }
  };

  const handleChange = (field, value) => {
    setAddress((prev) => ({ ...prev, [field]: value }));
  };

  const fillCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        toast.success('Location found, filling address fields...');

        // Optional: real reverse geocoding with an API (e.g., OpenCage, Google)
        // Simplified sample: fill coords and leave fields for user adjust.
        setAddress((prev) => ({
          ...prev,
          street: `Lat ${latitude.toFixed(5)}, Lng ${longitude.toFixed(5)}`,
          city: prev.city || 'Auto-detect city',
          state: prev.state || 'Auto-detect state',
          zip: prev.zip || '',
          country: prev.country || 'Auto-detect country',
        }));
      },
      (error) => {
        toast.error('Unable to determine location. Please enter manually.');
      },
      { timeout: 10000 }
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Required fields for a usable delivery address
    const requiredFields = ['name', 'street', 'city', 'state', 'zip', 'country', 'phone'];
    const missingFields = requiredFields.filter((field) => !address[field]?.trim());

    if (missingFields.length > 0) {
      const labelMap = {
        name: 'Name',
        street: 'Street',
        city: 'City',
        state: 'State',
        zip: 'ZIP',
        country: 'Country',
        phone: 'Phone',
      };
      const missingLabels = missingFields.map((field) => labelMap[field]).join(', ');
      toast.error(`Please fill in: ${missingLabels}`);
      return;
    }

    setDeliveryAddress(address);
    toast.success('Address saved successfully');
    navigate('/cart');
  };

  return (
    <div className="max-w-2xl mx-auto mt-16 mb-16 p-6 bg-white border border-gray-200 rounded-lg">
      <h1 className="text-2xl font-semibold mb-4">Add / Update Shipping Address</h1>
      <div className="mb-4">
        <span className="block text-sm font-medium text-gray-700 mb-2">Select address source:</span>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="addressMode"
              value="manual"
              checked={addressMode === 'manual'}
              onChange={() => selectAddressMode('manual')}
              className="accent-primary"
            />
            Manual entry
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="addressMode"
              value="live"
              checked={addressMode === 'live'}
              onChange={() => selectAddressMode('live')}
              className="accent-primary"
            />
            Live location
          </label>
        </div>
        {addressMode === 'live' && (
          <p className="text-xs text-gray-500 mt-1">Getting current coordinates and filling street field automatically. You can still adjust any address fields manually.</p>
        )}
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            value={address.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Name"
            className="border border-gray-300 rounded px-3 py-2 w-full"
          />
          <input
            value={address.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            placeholder="Phone"
            className="border border-gray-300 rounded px-3 py-2 w-full"
          />
        </div>
        <input
          value={address.street}
          onChange={(e) => handleChange('street', e.target.value)}
          placeholder="Street Address"
          className="border border-gray-300 rounded px-3 py-2 w-full"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            value={address.city}
            onChange={(e) => handleChange('city', e.target.value)}
            placeholder="City"
            className="border border-gray-300 rounded px-3 py-2 w-full"
          />
          <input
            value={address.state}
            onChange={(e) => handleChange('state', e.target.value)}
            placeholder="State"
            className="border border-gray-300 rounded px-3 py-2 w-full"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            value={address.zip}
            onChange={(e) => handleChange('zip', e.target.value)}
            placeholder="ZIP / PIN"
            className="border border-gray-300 rounded px-3 py-2 w-full"
          />
          <input
            value={address.country}
            onChange={(e) => handleChange('country', e.target.value)}
            placeholder="Country"
            className="border border-gray-300 rounded px-3 py-2 w-full"
          />
        </div>

        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <button
            type="button"
            onClick={fillCurrentLocation}
            className="bg-secondary text-white px-5 py-2 rounded hover:opacity-90"
          >
            Use Current Location
          </button>
          <div className="flex gap-3">
            <button
              type="submit"
              className="bg-primary text-white px-5 py-2 rounded hover:opacity-90"
            >
              Save Address
            </button>
            <button
              type="button"
              onClick={() => navigate('/cart')}
              className="border border-gray-300 px-5 py-2 rounded hover:bg-gray-100"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default AddAddress