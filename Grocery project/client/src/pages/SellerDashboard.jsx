
import React from 'react';
import { assets } from '../assets/assets';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const SellerDashboard = () => {
    const { addProduct, user } = useAppContext();
    const [files, setFiles] = React.useState([null, null, null, null]);
    const [price, setPrice] = React.useState('');
    const [offerPrice, setOfferPrice] = React.useState('');
    const [productName, setProductName] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [category, setCategory] = React.useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validation
        if (!productName.trim()) {
            toast.error('Product name is required');
            return;
        }
        if (!price || price <= 0) {
            toast.error('Valid product price is required');
            return;
        }
        if (!category) {
            toast.error('Please select a category');
            return;
        }

        // Create new product object
        const newProduct = {
            name: productName,
            description: description,
            price: parseFloat(price),
            offerPrice: offerPrice ? parseFloat(offerPrice) : parseFloat(price),
            category: category,
            image: files.filter(file => file !== null), // Only include uploaded images
            seller: {
                _id: user?._id || 'seller-1',
                name: user?.name || 'Seller',
                email: user?.email || 'seller@example.com'
            }
        };

        // Add product using context function
        addProduct(newProduct);

        // Reset form
        setProductName('');
        setDescription('');
        setPrice('');
        setOfferPrice('');
        setCategory('');
        setFiles([null, null, null, null]);
    };

    return (
        <div className="py-10 flex flex-col justify-between bg-white">
            <form onSubmit={handleSubmit} className="md:p-10 p-4 space-y-5 max-w-lg">
                <div>
                    <p className="text-base font-medium">Product Image</p>
                    <div className="flex flex-wrap items-center gap-3 mt-2">
                        {Array(4).fill('').map((_, index) => (
                            <label key={index} htmlFor={`image${index}`}>
                                <input onChange={(e)=>{
                                  const updatedFiles=[...files];
                                  updatedFiles[index]=e.target.files[0]
                                  setFiles(updatedFiles)
                                }}
                                 type="file" id={`image${index}`} hidden />
                                <img className="max-w-24 cursor-pointer" src={files[index]? URL.createObjectURL(files[index]): assets.upload_area} alt="uploadArea" width={100} height={100} />
                            </label>
                        ))}
                    </div>
                </div>
                <div className="flex flex-col gap-1 max-w-md">
                    <label className="text-base font-medium" htmlFor="product-name">Product Name</label>
                    <input id="product-name" type="text" value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="Type here" className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40" required />
                </div>
                <div className="flex flex-col gap-1 max-w-md">
                    <label className="text-base font-medium" htmlFor="product-description">Product Description</label>
                    <textarea id="product-description" rows={4} value={description} onChange={(e) => setDescription(e.target.value)} className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none" placeholder="Type here"></textarea>
                </div>
                <div className="w-full flex flex-col gap-1">
                    <label className="text-base font-medium" htmlFor="category">Category</label>
                    <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40">
                        <option value="">Select Category</option>
                        {[{ name: 'Electronics' }, { name: 'Clothing' }, { name: 'Accessories' }].map((item, index) => (
                            <option key={index} value={item.name}>{item.name}</option>
                        ))}
                    </select>
                </div>
                <div className="flex items-center gap-5 flex-wrap">
                    <div className="flex-1 flex flex-col gap-1 w-32">
                        <label className="text-base font-medium" htmlFor="product-price">Product Price</label>
                        <input onChange={(e)=>setPrice(e.target.value)} value={price} 
                         id="product-price" type="number" placeholder="0" className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40" required />
                    </div>
                    <div className="flex-1 flex flex-col gap-1 w-32">
                        <label className="text-base font-medium" htmlFor="offer-price">Offer Price</label>
                        <input id="offer-price" type="number" value={offerPrice} onChange={(e) => setOfferPrice(e.target.value)} placeholder="0" className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40" required />
                    </div>
                </div>
                <button type="submit" className="px-8 py-2.5 bg-primary text-white font-medium rounded hover:bg-primary/90 transition-colors">ADD PRODUCT</button>
            </form>
        </div>
    );
};

export default SellerDashboard;