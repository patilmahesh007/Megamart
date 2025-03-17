import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from "../../util/api.util.js";
import { toast } from "react-hot-toast";

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
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
          category: product.category?._id || product.category,
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
  useEffect(() => {
    console.log("Product ID:", id);
  }, [id]);
  
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
      await api.put(`/product/update/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Product updated successfully");
      navigate(-1);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating product");
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
    onCancel && onCancel();
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <button onClick={() => navigate(-1)} className="mb-4 text-teal-400 hover:underline">&larr; Back</button>
      <h1 className="text-3xl font-bold mb-6">Edit Product</h1>
      {existingProduct ? (
        <div className="flex h-[calc(100vh-150px)] gap-6">
          <div className="w-1/3 pr-4">
            <img src={displayedMainImage} alt={existingProduct.name} className="w-full h-64 object-cover rounded" />
            <div className="mt-4 grid grid-cols-3 gap-2">
              {existingProduct.images && existingProduct.images.map((img, idx) => (
                <img key={idx} src={img} alt={`Additional ${idx}`} className="w-full h-24 object-cover rounded cursor-pointer" onMouseEnter={() => setDisplayedMainImage(img)} onMouseLeave={() => setDisplayedMainImage(existingProduct.mainImage)} />
              ))}
            </div>
          </div>
          <div className="w-2/3 overflow-y-auto no-scrollbar pr-2">
            <form onSubmit={handleSubmit} className="space-y-4 pb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1">Product Name</label>
                  <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white" required />
                </div>
                <div>
                  <label className="block mb-1">Category</label>
                  <select name="category" value={formData.category} onChange={handleInputChange} className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white" required>
                    <option value="">Select a category</option>
                    {categories.filter(cat => !cat.parent).map(mainCat => (
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
              <div>
                <label className="block mb-1">Description</label>
                <textarea name="description" value={formData.description} onChange={handleInputChange} className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white h-24" required></textarea>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block mb-1">Current Price</label>
                  <input type="number" name="currentPrice" value={formData.currentPrice} onChange={handleInputChange} className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white" required />
                </div>
                <div>
                  <label className="block mb-1">Original Price</label>
                  <input type="number" name="originalPrice" value={formData.originalPrice} onChange={handleInputChange} className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white" required />
                </div>
                <div>
                  <label className="block mb-1">Stock</label>
                  <input type="number" name="stock" value={formData.stock} onChange={handleInputChange} className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white" required />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1">Brand</label>
                  <input type="text" name="brand" value={formData.brand} onChange={handleInputChange} className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white" />
                </div>
                <div>
                  <label className="block mb-1">Dietary Preference</label>
                  <input type="text" name="dietaryPreference" value={formData.dietaryPreference} onChange={handleInputChange} className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white" />
                </div>
              </div>
              <div>
                <label className="block mb-1">Allergen Information</label>
                <textarea name="allergenInformation" value={formData.allergenInformation} onChange={handleInputChange} className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white h-20"></textarea>
              </div>
              <div>
                <label className="block mb-1">Serving Size</label>
                <input type="text" name="servingSize" value={formData.servingSize} onChange={handleInputChange} className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white" />
              </div>
              <div>
                <label className="block mb-1">Disclaimer</label>
                <textarea name="disclaimer" value={formData.disclaimer} onChange={handleInputChange} className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white h-20"></textarea>
              </div>
              <div>
                <label className="block mb-1">Customer Care Details</label>
                <textarea name="customerCareDetails" value={formData.customerCareDetails} onChange={handleInputChange} className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white h-20"></textarea>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1">Seller Name</label>
                  <input type="text" name="sellerName" value={formData.sellerName} onChange={handleInputChange} className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white" />
                </div>
                <div>
                  <label className="block mb-1">Seller Address</label>
                  <input type="text" name="sellerAddress" value={formData.sellerAddress} onChange={handleInputChange} className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white" />
                </div>
              </div>
              <div>
                <label className="block mb-1">Seller License No.</label>
                <input type="text" name="sellerLicenseNo" value={formData.sellerLicenseNo} onChange={handleInputChange} className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1">Manufacturer Name</label>
                  <input type="text" name="manufacturerName" value={formData.manufacturerName} onChange={handleInputChange} className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white" />
                </div>
                <div>
                  <label className="block mb-1">Manufacturer Address</label>
                  <input type="text" name="manufacturerAddress" value={formData.manufacturerAddress} onChange={handleInputChange} className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1">Country of Origin</label>
                  <input type="text" name="countryOfOrigin" value={formData.countryOfOrigin} onChange={handleInputChange} className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white" />
                </div>
                <div>
                  <label className="block mb-1">Shelf Life</label>
                  <input type="text" name="shelfLife" value={formData.shelfLife} onChange={handleInputChange} className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white" />
                </div>
              </div>
              <div>
                <label className="block text-gray-300 mb-1">Main Image</label>
                <div className="flex items-center">
                  <label htmlFor="mainImage" className="cursor-pointer bg-teal-600 hover:bg-teal-700 px-4 py-2 rounded-md text-white">
                    Choose File
                  </label>
                  <span className="ml-4 text-gray-400">{mainImage ? mainImage.name : "No file chosen"}</span>
                </div>
                <input id="mainImage" type="file" accept="image/*" onChange={handleMainImageChange} className="hidden" required={!existingProduct} />
              </div>
              <div>
                <label className="block text-gray-300 mb-1">Additional Images</label>
                <div className="flex items-center">
                  <label htmlFor="additionalImages" className="cursor-pointer bg-teal-600 hover:bg-teal-700 px-4 py-2 rounded-md text-white">
                    Choose Files
                  </label>
                  <span className="ml-4 text-gray-400">{images.length > 0 ? `${images.length} file(s) chosen` : "No file chosen"}</span>
                </div>
                <input id="additionalImages" type="file" accept="image/*" multiple onChange={handleImagesChange} className="hidden" />
              </div>
              <div className="flex space-x-3">
                <button type="submit" className="bg-teal-600 hover:bg-teal-700 px-4 py-2 rounded-md">
                  {existingProduct ? 'Update Product' : 'Add Product'}
                </button>
                <button type="button" onClick={resetForm} className="bg-slate-600 hover:bg-slate-700 px-4 py-2 rounded-md">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <p>Loading product details...</p>
      )}
      <style jsx="true">{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default ProductDetailPage;
