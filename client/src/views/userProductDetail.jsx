import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Share, ShoppingCart, Heart, ChevronRight } from 'lucide-react';
import api from '../util/api.util';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        const response = await api.get(`http://localhost:5112/product/get/${id}`);
        if (response.data.success) {
          setProduct(response.data.data);
        } else {
          setError("Failed to load product details");
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError("Unable to connect to the server");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProductData();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="text-red-500 text-xl mb-4">{error || "Product not found"}</div>
        <Link to="/" className="bg-purple-600 text-white px-6 py-2 rounded-lg">
          Go Back Home
        </Link>
      </div>
    );
  }

  const discountPercentage = product.mrp && product.price 
    ? Math.round(((product.mrp - product.price) / product.mrp) * 100) 
    : 0;

  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="bg-white sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="mr-4">
              <ArrowLeft size={24} />
            </Link>
            <img src="/zepto-logo.svg" alt="Zepto" className="h-8" onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://via.placeholder.com/120x40?text=Zepto";
            }} />
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2">
              <Share size={20} />
            </button>
            <button className="p-2">
              <ShoppingCart size={20} />
            </button>
          </div>
        </div>
      </header>

      <div className="bg-white">
        <div className="container mx-auto px-4 py-2 text-sm text-gray-600">
          <div className="flex items-center">
            <Link to="/" className="hover:text-purple-600">Home</Link>
            <ChevronRight size={16} className="mx-1" />
            {product.category && (
              <>
                <Link to={`/category/${product.category.slug}`} className="hover:text-purple-600">
                  {product.category.name}
                </Link>
                <ChevronRight size={16} className="mx-1" />
              </>
            )}
            <span className="truncate max-w-xs">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row bg-white rounded-lg shadow-sm">
          <div className="md:w-2/5 p-4 md:sticky md:top-20 md:self-start">
            <div className="flex">
              <div className="w-1/5 flex flex-col space-y-3 pr-3">
                {product.images && product.images.map((img, index) => (
                  <div 
                    key={index}
                    className={`border cursor-pointer rounded-md overflow-hidden ${
                      selectedImage === index ? 'border-purple-500' : 'border-gray-200'
                    }`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img 
                      src={img} 
                      alt={`${product.name} thumbnail ${index + 1}`} 
                      className="w-full h-16 object-contain"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://via.placeholder.com/80x80?text=Image+${index + 1}`;
                      }}
                    />
                  </div>
                ))}
              </div>

              <div className="w-4/5 ml-2 border border-gray-100 rounded-lg relative">
                <div className="aspect-square flex items-center justify-center bg-gray-50 p-4 rounded-lg">
                  <img 
                    src={product.images?.[selectedImage] || product.images?.[0] || "https://via.placeholder.com/400x400?text=No+Image"} 
                    alt={product.name} 
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                <button 
                  className={`absolute top-4 right-4 p-2 rounded-full ${
                    isFavorite ? 'bg-red-50' : 'bg-gray-50'
                  }`}
                  onClick={() => setIsFavorite(!isFavorite)}
                >
                  <Heart size={20} fill={isFavorite ? "#ef4444" : "none"} stroke={isFavorite ? "#ef4444" : "currentColor"} />
                </button>
              </div>
            </div>

            <div className="md:hidden mt-6">
              <button className="w-full py-3 bg-purple-600 text-white rounded-lg font-medium">
                Add To Cart
              </button>
            </div>
          </div>

          <div className="md:w-3/5 p-4 md:p-6 md:overflow-y-auto">
            {product.brand && (
              <Link to={`/brand/${product.brand.slug}`} className="text-purple-600 font-medium">
                {product.brand.name}
              </Link>
            )}

            <h1 className="text-2xl font-bold text-gray-800 mt-2 mb-4">{product.name}</h1>

            <div className="text-gray-600 mb-4">
              Net Qty: {product.quantity || "1"} {product.unit || ""}
            </div>

            <div className="mb-6">
              <div className="flex items-center">
                <span className="text-3xl font-bold">₹{product.price?.toFixed(2) || "0.00"}</span>
                {discountPercentage > 0 && (
                  <span className="ml-3 bg-green-100 text-green-800 px-2 py-1 text-sm font-medium rounded">
                    {discountPercentage}% Off
                  </span>
                )}
              </div>
              {product.mrp && product.mrp > product.price && (
                <div className="flex items-center mt-1 text-gray-500">
                  <span className="text-sm">MRP </span>
                  <span className="text-sm line-through ml-1">₹{product.mrp?.toFixed(2)}</span>
                  <span className="text-xs ml-2">(incl. of all taxes)</span>
                </div>
              )}
            </div>

            <div className="flex space-x-6 mb-8">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-refresh-ccw">
                    <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                    <path d="M3 3v5h5" />
                    <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                    <path d="M16 21h5v-5" />
                  </svg>
                </div>
                <span className="text-xs text-center">2 Days Exchange</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-zap">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                  </svg>
                </div>
                <span className="text-xs text-center">Fast Delivery</span>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">Highlights</h2>
              <div className="grid grid-cols-2 gap-y-4">
                {product.highlights && Object.entries(product.highlights).map(([key, value]) => (
                  <div key={key} className="flex flex-col">
                    <span className="text-gray-500 text-sm">{key}</span>
                    <span className="font-medium">{value}</span>
                  </div>
                ))}
                
                {(!product.highlights || Object.keys(product.highlights).length === 0) && (
                  <>
                    <div className="flex flex-col">
                      <span className="text-gray-500 text-sm">Organic</span>
                      <span className="font-medium">{product.isOrganic ? "Yes" : "No"}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-gray-500 text-sm">Brand</span>
                      <span className="font-medium">{product.brand?.name || "GENERIC"}</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {product.description && (
              <div className="mb-8">
                <h2 className="text-xl font-bold mb-4">About this item</h2>
                <div className="text-gray-700 whitespace-pre-line">
                  {product.description}
                </div>
              </div>
            )}

            <div className="hidden md:block sticky bottom-0 bg-white pt-4">
              <button className="w-full py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition">
                Add To Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;