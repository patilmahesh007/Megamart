import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from "../util/api.util.js";
import { toast } from "react-hot-toast";

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('basic');
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    currentPrice: "",
    originalPrice: "",
    category: "",
    stock: "",
    brand: "",
    dietaryPreference: "",
    allergenInformation: "",
    servingSize: "",
    disclaimer: "",
    customerCareDetails: "",
    sellerName: "",
    sellerAddress: "",
    sellerLicenseNo: "",
    manufacturerName: "",
    manufacturerAddress: "",
    countryOfOrigin: "",
    shelfLife: ""
  });
  const [mainImage, setMainImage] = useState(null);
  const [images, setImages] = useState([]);
  const [existingProduct, setExistingProduct] = useState(null);
  const [displayedMainImage, setDisplayedMainImage] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (id) {
      const fetchProductDetail = async () => {
        try {
          const res = await api.get(`/product/get/${id}`);
          const product = res.data.data;
          setExistingProduct(product);
          setDisplayedMainImage(product.mainImage);
          setFormData({
            name: product.name,
            description: product.description,
            currentPrice: product.currentPrice,
            originalPrice: product.originalPrice,
            category: product.category?._id || product.category || "",
            stock: product.stock,
            brand: product.brand || "",
            dietaryPreference: product.dietaryPreference || "",
            allergenInformation: product.allergenInformation || "",
            servingSize: product.servingSize || "",
            disclaimer: product.disclaimer || "",
            customerCareDetails: product.customerCareDetails || "",
            sellerName: product.sellerName || "",
            sellerAddress: product.sellerAddress || "",
            sellerLicenseNo: product.sellerLicenseNo || "",
            manufacturerName: product.manufacturerName || "",
            manufacturerAddress: product.manufacturerAddress || "",
            countryOfOrigin: product.countryOfOrigin || "",
            shelfLife: product.shelfLife || ""
          });
        } catch (error) {
          toast.error("Failed to fetch product details");
        }
      };
      fetchProductDetail();
    }
  }, [id]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/category/list");
        setCategories(res.data.data || []);
      } catch (error) {
        toast.error("Failed to fetch categories");
      }
    };
    fetchCategories();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMainImageChange = (e) => {
    setMainImage(e.target.files[0]);
  };

  const handleImagesChange = (e) => {
    setImages([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    if (mainImage) data.append("mainImage", mainImage);
    images.forEach(file => data.append("images", file));
    try {
      if (id) {
        await api.put(`/products/update/${id}`, data);
        toast.success("Product updated successfully");
      } else {
        await api.post("/product/add", data);
        toast.success("Product added successfully");
      }
      navigate(-1);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error submitting product");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      currentPrice: "",
      originalPrice: "",
      category: "",
      stock: "",
      brand: "",
      dietaryPreference: "",
      allergenInformation: "",
      servingSize: "",
      disclaimer: "",
      customerCareDetails: "",
      sellerName: "",
      sellerAddress: "",
      sellerLicenseNo: "",
      manufacturerName: "",
      manufacturerAddress: "",
      countryOfOrigin: "",
      shelfLife: ""
    });
    setMainImage(null);
    setImages([]);
  };

  const TabButton = ({ id, label, active }) => (
    <button
      type="button"
      onClick={() => setActiveTab(id)}
      className={`px-4 py-2 rounded-t-lg font-medium ${active ? "bg-slate-700 text-white border-b-2 border-teal-500" : "bg-slate-800 text-gray-400 hover:bg-slate-700"}`}
    >
      {label}
    </button>
  );

  return (
    <div className="bg-slate-800 rounded-lg shadow-lg overflow-hidden">
      <div className="border-b border-slate-700 px-6 py-4 flex items-center justify-between">
        <h3 className="text-xl font-semibold text-white flex items-center">
          {id ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
              Edit Product
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add New Product
            </>
          )}
        </h3>
      </div>
      <div className="px-6 pt-2">
        <div className="flex border-b border-slate-700">
          <TabButton id="basic" label="Basic Info" active={activeTab === 'basic'} />
          <TabButton id="details" label="Product Details" active={activeTab === 'details'} />
          <TabButton id="seller" label="Seller Info" active={activeTab === 'seller'} />
          <TabButton id="images" label="Images" active={activeTab === 'images'} />
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="p-6">
          <div className={activeTab === 'basic' ? 'block' : 'hidden'}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-1">Product Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-teal-500" required />
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-1">Category</label>
                <select name="category" value={formData.category} onChange={handleInputChange} className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-teal-500" required>
                  <option value="">Select a category</option>
                  {categories
                    .filter(cat => !cat.parent)
                    .map(mainCat => (
                      <optgroup key={mainCat._id} label={mainCat.name}>
                        <option value={mainCat._id}>{mainCat.name} (Main)</option>
                        {mainCat.subCategories && mainCat.subCategories.map(subCat => (
                          <option key={subCat._id} value={subCat._id}>&nbsp;&nbsp;— {subCat.name}</option>
                        ))}
                      </optgroup>
                    ))}
                </select>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-gray-300 text-sm font-medium mb-1">Description</label>
              <textarea name="description" value={formData.description} onChange={handleInputChange} className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white h-24 focus:outline-none focus:ring-2 focus:ring-teal-500" required></textarea>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-1">Current Price</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-400">₹</span>
                  </div>
                  <input type="number" name="currentPrice" value={formData.currentPrice} onChange={handleInputChange} className="w-full pl-8 px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-teal-500" required />
                </div>
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-1">Original Price</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-400">₹</span>
                  </div>
                  <input type="number" name="originalPrice" value={formData.originalPrice} onChange={handleInputChange} className="w-full pl-8 px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-teal-500" required />
                </div>
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-1">Stock</label>
                <input type="number" name="stock" value={formData.stock} onChange={handleInputChange} className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-teal-500" required />
              </div>
            </div>
          </div>
  
          <div className={activeTab === 'details' ? 'block' : 'hidden'}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-1">Brand</label>
                <input type="text" name="brand" value={formData.brand} onChange={handleInputChange} className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-teal-500" />
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-1">Dietary Preference</label>
                <input type="text" name="dietaryPreference" value={formData.dietaryPreference} onChange={handleInputChange} className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-teal-500" />
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-300 text-sm font-medium mb-1">Allergen Information</label>
              <textarea name="allergenInformation" value={formData.allergenInformation} onChange={handleInputChange} className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white h-20 focus:outline-none focus:ring-2 focus:ring-teal-500"></textarea>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-300 text-sm font-medium mb-1">Serving Size</label>
              <input type="text" name="servingSize" value={formData.servingSize} onChange={handleInputChange} className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-teal-500" required />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-300 text-sm font-medium mb-1">Disclaimer</label>
              <textarea name="disclaimer" value={formData.disclaimer} onChange={handleInputChange} className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white h-20 focus:outline-none focus:ring-2 focus:ring-teal-500"></textarea>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-300 text-sm font-medium mb-1">Customer Care Details</label>
              <textarea name="customerCareDetails" value={formData.customerCareDetails} onChange={handleInputChange} className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white h-20 focus:outline-none focus:ring-2 focus:ring-teal-500"></textarea>
            </div>
          </div>
  
          <div className={activeTab === 'seller' ? 'block' : 'hidden'}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-1">Seller Name</label>
                <input type="text" name="sellerName" value={formData.sellerName} onChange={handleInputChange} className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-teal-500" />
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-1">Seller Address</label>
                <input type="text" name="sellerAddress" value={formData.sellerAddress} onChange={handleInputChange} className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-teal-500" />
              </div>
            </div>
  
            <div className="mb-4">
              <label className="block text-gray-300 text-sm font-medium mb-1">Seller License No.</label>
              <input type="text" name="sellerLicenseNo" value={formData.sellerLicenseNo} onChange={handleInputChange} className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-teal-500" />
            </div>
  
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-1">Manufacturer Name</label>
                <input type="text" name="manufacturerName" value={formData.manufacturerName} onChange={handleInputChange} className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-teal-500" />
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-1">Manufacturer Address</label>
                <input type="text" name="manufacturerAddress" value={formData.manufacturerAddress} onChange={handleInputChange} className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-teal-500" />
              </div>
            </div>
  
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-1">Country of Origin</label>
                <input type="text" name="countryOfOrigin" value={formData.countryOfOrigin} onChange={handleInputChange} className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-teal-500" />
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-1">Shelf Life</label>
                <input type="text" name="shelfLife" value={formData.shelfLife} onChange={handleInputChange} className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-teal-500" />
              </div>
            </div>
          </div>
  
          <div className={activeTab === 'images' ? 'block' : 'hidden'}>
            <div className="mb-4">
              <label className="block text-gray-300 text-sm font-medium mb-2">Main Product Image</label>
              <div className="flex items-center">
                <label htmlFor="mainImage" className="cursor-pointer bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-md text-white border border-slate-600 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                  </svg>
                  Upload Image
                </label>
                <span className="ml-4 text-gray-400 text-sm">{mainImage ? mainImage.name : "No file chosen"}</span>
              </div>
              <input id="mainImage" type="file" accept="image/*" onChange={handleMainImageChange} className="hidden" required={!existingProduct} />
            </div>
  
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Additional Images</label>
              <div className="flex items-center">
                <label htmlFor="additionalImages" className="cursor-pointer bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-md text-white border border-slate-600 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4V5h12v10z" clipRule="evenodd" />
                    <path d="M4 12h3l1-2 3 4 2-2 3 3H4v-3z" />
                  </svg>
                  Upload Multiple
                </label>
                <span className="ml-4 text-gray-400 text-sm">{images.length > 0 ? `${images.length} file(s) chosen` : "No file chosen"}</span>
              </div>
              <input id="additionalImages" type="file" accept="image/*" multiple onChange={handleImagesChange} className="hidden" />
            </div>
          </div>
  
          <div className="bg-slate-900 px-6 py-4 flex justify-end space-x-3">
            <button type="button" onClick={resetForm} className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-md text-white flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Cancel
            </button>
            <button type="submit" className="bg-teal-600 hover:bg-teal-500 px-4 py-2 rounded-md text-white flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              {existingProduct ? 'Update Product' : 'Save Product'}
            </button>
          </div>
        </div>
      </form>
      <style jsx="true">{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default ProductDetailPage;
