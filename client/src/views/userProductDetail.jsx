import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, Truck, RefreshCcw, Shield, Heart } from 'lucide-react';
import api from '../util/api.util';
import Header from '../components/Header';
import { toast } from 'react-hot-toast';
import CartButton, { MobileCartButton } from '../components/button';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [cartQuantity, setCartQuantity] = useState(null);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/product/get/${id}`);
        if (response.data.success) {
          setProduct(response.data.data);
        } else {
          setError("Failed to load product details");
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Unable to connect to the server");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProductData();
  }, [id]);

  useEffect(() => {
    const fetchCartDetails = async () => {
      try {
        const response = await api.get('/cart/get');
        if (response.data.success) {
          const items = response.data.data.items;
          const foundItem = items.find(item => item.product._id === product._id);
          setCartQuantity(foundItem ? foundItem.quantity : 0);
        } else {
          toast.error("Failed to fetch cart details");
          setCartQuantity(0);
        }
      } catch (error) {
        console.error("Error fetching cart details:", error);
        toast.error("Error fetching cart details");
        setCartQuantity(0);
      }
    };

    if (product) {
      fetchCartDetails();
    }
  }, [product]);

  const discountPercentage =
    product && product.originalPrice && product.currentPrice
      ? Math.round(((product.originalPrice - product.currentPrice) / product.originalPrice) * 100)
      : 0;

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => {
    if (quantity > 1) setQuantity(prev => prev - 1);
  };

  const handleAddToCart = async () => {
    try {
      await api.post('/cart/add', { product: product._id, quantity });
      toast.success("Item added to cart!");
      setCartQuantity(quantity);
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add item to cart");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
        <div className="text-red-500 text-xl mb-4">{error || "Product not found"}</div>
        <Link to="/" className="bg-purple-600 hover:bg-purple-700 transition text-white px-6 py-2 rounded-lg shadow">
          Go Back Home
        </Link>
      </div>
    );
  }

  const mainImageUrl =
    product.mainImage || product.images?.[0] || "https://dummyimage.com/400x400/e5e7eb/6b46c1.png&text=No+Image";

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />

      {/*Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 py-3 text-sm text-gray-600">
          <div className="flex items-center flex-wrap">
            <Link to="/" className="hover:text-purple-600 transition">Home</Link>
            <ChevronRight size={14} className="mx-1 text-gray-400" />
            {product.category && (
              <>
                <Link to={`/category/${product.category.slug}`} className="hover:text-purple-600 transition">
                  {product.category.name}
                </Link>
                <ChevronRight size={14} className="mx-1 text-gray-400" />
              </>
            )}
            <span className="truncate max-w-xs text-gray-500">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row">
        <div className="w-full md:w-2/5 p-4 md:sticky md:top-20 md:self-start border-b md:border-r border-gray-100">
          <div className="flex flex-col md:flex-row">
            <div className="flex md:flex-col space-x-4 md:space-x-0 md:space-y-4 overflow-x-auto md:overflow-visible pb-4 md:pb-0">
              {product.images && product.images.map((img, index) => (
                <div
                  key={index}
                  className={`flex-shrink-0 border-2 cursor-pointer rounded-lg overflow-hidden transition ${
                    selectedImage === index ? 'border-purple-600 shadow-sm' : 'border-gray-200 hover:border-purple-300'
                  }`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img
                    src={img}
                    alt={`${product.name} thumbnail ${index + 1}`}
                    className="h-16 w-16 md:w-full object-contain"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `https://dummyimage.com/80x80/e5e7eb/6b46c1.png&text=${index + 1}`;
                    }}
                  />
                </div>
              ))}
            </div>
            {/* Main Image */}
            <div className="flex-grow ml-0 md:ml-4 relative">
              <div className="aspect-square flex items-center justify-center bg-gray-50 p-4 sm:p-6 md:p-8 rounded-xl border border-gray-100">
                <img
                  src={product.images?.[selectedImage] || mainImageUrl}
                  alt={product.name}
                  className="max-h-full object-contain"
                />
              </div>
              <button
                className={`absolute top-2 right-2 p-2 rounded-full shadow-sm transition ${
                  isFavorite ? 'bg-red-50 hover:bg-red-100' : 'bg-white hover:bg-gray-100'
                }`}
                onClick={() => setIsFavorite(!isFavorite)}
              >
                <Heart size={22} fill={isFavorite ? "#ef4444" : "none"} stroke={isFavorite ? "#ef4444" : "currentColor"} />
              </button>
            </div>
          </div>
        </div>

        <div className="w-full md:w-3/5 pl-0 md:pl-4 pt-4 md:pt-0 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 100px)', scrollbarWidth: 'none' }}>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">{product.name}</h1>
          <div className="text-gray-600 mb-4 text-sm md:text-base">
            Net Qty: {product.quantity || ""} {product.servingSize && `(${product.servingSize})`}
          </div>
          <div className="mb-6">
            <div className="flex items-center flex-wrap">
              <span className="text-2xl md:text-3xl font-bold text-gray-900">₹{(product.currentPrice ?? 0).toFixed(2)}</span>
              {discountPercentage > 0 && (
                <span className="ml-3 bg-green-100 text-green-800 px-2.5 py-1 text-xs md:text-sm font-medium rounded-md">
                  {discountPercentage}% Off
                </span>
              )}
            </div>
            {product.originalPrice && product.originalPrice > product.currentPrice && (
              <div className="flex items-center mt-1 text-gray-500 text-xs md:text-sm">
                <span>MRP </span>
                <span className="line-through ml-1">₹{(product.originalPrice ?? 0).toFixed(2)}</span>
                <span className="ml-2">(incl. of all taxes)</span>
              </div>
            )}
          </div>
          <div className="flex justify-between md:justify-start space-x-6 mb-8">
            <div className="flex flex-col items-center">
              <Truck size={18} className="text-green-600 mb-1" />
              <span className="text-xs text-center">Fast Delivery</span>
            </div>
            <div className="flex flex-col items-center">
              <RefreshCcw size={18} className="text-purple-600 mb-1" />
              <span className="text-xs text-center">10 Days Return</span>
            </div>
            <div className="flex flex-col items-center">
              <Shield size={18} className="text-blue-600 mb-1" />
              <span className="text-xs text-center">Quality Assured</span>
            </div>
          </div>

          <div className="mt-6 hidden md:block">
            <CartButton
              product={product}
              quantity={quantity}
              cartQuantity={cartQuantity}
              setCartQuantity={setCartQuantity}
              handleAddToCart={handleAddToCart}
            />
          </div>

          <div className="mb-8">
            <h2 className="text-lg font-bold mb-4 border-b border-gray-100 pb-2">Product Highlights</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
              {product.highlights &&
                Object.entries(product.highlights).map(([key, value]) => (
                  <div key={key} className="flex flex-col">
                    <span className="text-gray-500 text-sm">{key}</span>
                    <span className="font-medium text-gray-800">{value}</span>
                  </div>
                ))}
              {(!product.highlights || Object.keys(product.highlights).length === 0) && (
                <>
                  <div className="flex flex-col">
                    <span className="text-gray-500 text-sm">Organic</span>
                    <span className="font-medium text-gray-800">{product.isOrganic ? "Yes" : "No"}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-500 text-sm">Brand</span>
                    <span className="font-medium text-gray-800">{product.brand?.name || "GENERIC"}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-500 text-sm">Shelf Life</span>
                    <span className="font-medium text-gray-800">{product.shelfLife || "12 months"}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-500 text-sm">Country of Origin</span>
                    <span className="font-medium text-gray-800">{product.countryOfOrigin || "India"}</span>
                  </div>
                </>
              )}
            </div>
          </div>
          {product.description && (
            <div className="mb-8">
              <h2 className="text-lg font-bold mb-4 border-b border-gray-100 pb-2">About this item</h2>
              <div className="text-gray-700 whitespace-pre-line leading-relaxed text-sm md:text-base">
                {product.description}
              </div>
            </div>
          )}
          <div className="mb-8 bg-white rounded-lg border border-gray-200 p-5">
            <h2 className="text-lg font-bold mb-4 pb-2 border-b border-gray-100">Additional Information</h2>
            <div className="text-gray-700 space-y-2 text-xs md:text-sm">
              <p><strong>Allergen Information:</strong> {product.allergenInformation}</p>
              <p><strong>Disclaimer:</strong> {product.disclaimer}</p>
              <p><strong>Customer Care Details:</strong> {product.customerCareDetails}</p>
              <p><strong>Seller Name:</strong> {product.sellerName}</p>
              <p><strong>Seller Address:</strong> {product.sellerAddress}</p>
              <p><strong>Seller License No.:</strong> {product.sellerLicenseNo}</p>
              <p><strong>Manufacturer Name:</strong> {product.manufacturerName}</p>
              <p><strong>Manufacturer Address:</strong> {product.manufacturerAddress}</p>
              <p><strong>Country of Origin:</strong> {product.countryOfOrigin}</p>
              <p><strong>Shelf Life:</strong> {product.shelfLife}</p>
              <p><strong>Serving Size:</strong> {product.servingSize}</p>
            </div>
          </div>
        </div>
      </div>

      <MobileCartButton
        product={product}
        quantity={quantity}
        cartQuantity={cartQuantity}
        setCartQuantity={setCartQuantity}
        incrementQuantity={incrementQuantity}
        decrementQuantity={decrementQuantity}
        handleAddToCart={handleAddToCart}
        discountPercentage={discountPercentage}
      />
    </div>
  );
};

export default ProductDetail;
