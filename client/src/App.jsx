import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from './components/Header.jsx';
import api from './util/api.util';
import Footer from "./components/Footer.jsx";

const CategoryNavbar = ({ categories, onSelectCategory, selectedCategory }) => {
  return (
    <div className="overflow-x-auto bg-white shadow-sm">
      <div className="flex space-x-6 p-4 w-4/5 mx-auto">
        {categories.map((category) => (
          <div 
            key={category.id} 
            className={`flex flex-col items-center cursor-pointer min-w-max transition-all ${
              selectedCategory?.id === category.id ? "scale-105" : ""
            }`}
            onClick={() => onSelectCategory(category)}
          >
            {category.categoryImg ? (
              <img 
                src={category.categoryImg} 
                alt={category.name} 
                className={`w-24 h-24 object-contain rounded-lg mb-2 ${
                  selectedCategory?.id === category.id ? "ring-2 ring-purple-500" : ""
                }`}
              />
            ) : (
              <div className={`w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mb-2 ${
                selectedCategory?.id === category.id ? "bg-purple-100 ring-2 ring-purple-500" : ""
              }`}>
                <span className="text-sm font-bold">{category.name.charAt(0)}</span>
              </div>
            )}
            <span className={`text-xs font-medium text-center ${
              selectedCategory?.id === category.id ? "text-purple-600 font-bold" : ""
            }`}>{category.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const SubcategoryNavbar = ({ subcategories }) => {
  if (!subcategories || subcategories.length === 0) return null;
  
  return (
    <div className="bg-white shadow-md mb-6">
      <div className="flex overflow-x-auto py-3 w-4/5 mx-auto">
        {subcategories.map((subcat) => (
          <Link 
            key={subcat.id} 
            to={`/category/${subcat.slug || subcat.id}`}
            className="flex flex-col items-center mx-4 min-w-max group"
          >
            <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mb-1 overflow-hidden group-hover:ring-2 group-hover:ring-purple-300 transition-all">
              {subcat.imageUrl ? (
                <img 
                  src={subcat.imageUrl} 
                  alt={subcat.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-purple-500 font-medium">{subcat.name.substring(0, 2)}</span>
              )}
            </div>
            <span className="text-xs whitespace-nowrap group-hover:text-purple-600">{subcat.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

const WelcomeBanner = () => {
  return (
    <div className="bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl overflow-hidden shadow-lg mb-8 relative">
      <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-300 rounded-full -translate-y-1/2 translate-x-1/2 opacity-20"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-400 rounded-full translate-y-1/2 -translate-x-1/2 opacity-20"></div>
      
      <div className="w-4/5 mx-auto py-10 px-6 relative z-10 flex flex-col md:flex-row items-center justify-between">
        <div className="md:w-3/5 mb-6 md:mb-0">
          <h1 className="text-4xl font-bold mb-3 text-white">Fresh Delights at Your Doorstep</h1>
          <p className="text-lg text-white opacity-90 mb-6">
            Discover a world of quality products with lightning-fast delivery in minutes.
          </p>
          <div className="flex space-x-4">
            <button className="bg-white text-teal-600 px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-teal-50 transition-all">
              Shop Now
            </button>
            <button className="border border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:bg-opacity-10 transition-all">
              View Offers
            </button>
          </div>
        </div>
        
        <div className="md:w-2/5 flex justify-center">
          <div className="relative">
            <div className="w-48 h-48 bg-white bg-opacity-20 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
            <img 
              src="/images/grocery-basket.png" 
              alt="Fresh groceries" 
              className="w-64 h-64 object-contain relative z-10"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/250x250?text=Fresh+Groceries";
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

function App() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get('http://localhost:5112/category/list')
      .then((response) => {
        const data = response.data;
        if (data.success) {
          const mainCategories = data.data.filter(cat => cat.parent === null);
          const enhancedData = mainCategories.map(category => ({
            ...category,
            id: category._id,
            subCategories: category.subCategories ? 
              category.subCategories.map(sub => ({
                ...sub,
                id: sub._id,
                imageUrl: sub.imageUrl || sub.categoryImg || `https://via.placeholder.com/100x100?text=${sub.name.charAt(0)}`
              })) : []
          }));
          
          setCategories(enhancedData);
          if (enhancedData && enhancedData.length > 0) {
            setSelectedCategory(enhancedData[0]);
          }
        } else {
          setError('Failed to load categories');
        }
        setLoadingCategories(false);
      })
      .catch((error) => {
        console.error('Error fetching categories:', error);
        setError('Unable to connect to the server');
        setLoadingCategories(false);
      });
  }, []);

  const handleSelectCategory = (category) => {
    setSelectedCategory(category);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      {loadingCategories ? (
        <div className="text-center p-8">
          <div className="inline-block w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading categories...</p>
        </div>
      ) : error ? (
        <div className="text-center p-8 text-red-500 font-medium">{error}</div>
      ) : (
        <>
          <CategoryNavbar 
            categories={categories} 
            onSelectCategory={handleSelectCategory}
            selectedCategory={selectedCategory}
          />
          <SubcategoryNavbar 
            subcategories={selectedCategory?.subCategories || []} 
          />
        </>
      )}
      
      <main className="flex-grow w-4/5 mx-auto py-6">
        <WelcomeBanner />
        
        <div className="mb-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Today's Deals</h2>
            <Link to="/deals" className="text-purple-600 hover:text-purple-800 font-medium text-sm">
              View All →
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map(item => (
              <div key={item} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div className="h-40 bg-gray-100 flex items-center justify-center">
                  <div className="w-24 h-24 bg-gray-200 rounded-lg"></div>
                </div>
                <div className="p-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

export default App;
