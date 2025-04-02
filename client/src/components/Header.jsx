import React from 'react';
import { Search, User, ShoppingCart, ChevronDown } from 'lucide-react';
import {Link} from 'react-router-dom';
const Navbar = () => {
  return (
    <nav className="w-full bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-2xl font-bold text-emrald-300 ">MegaMart</div>
           
          </div>

          <div className="flex items-center space-x-2 cursor-pointer">
            <div className="text-sm">
              <div className="font-medium">Delivery in 9 Mins</div>
              <div className="text-gray-500 text-xs truncate max-w-xs">
                Saswad Road, Gadital, Hadapsar, Pune
              </div>
            </div>
            <ChevronDown className="h-4 w-4 text-gray-500" />
          </div>

          <div className="flex-1 max-w-md mx-8">
            <div className="relative flex">
              <Search className="absolute left-3 top-2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search for 'chocolate box'"
                className="w-full pl-9 pr-4 py-1.5 border  text-sm border-gray-200 rounded-lg focus:outline-none focus:border-emrald-500"
              />
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <Link to="/profile" className="flex items-center space-x-1 hover:text-emrald-600">
              <User className="h-5 w-5" />
              <span className="text-sm">Profile</span>
            </Link>

            <Link to="/cart" className="flex items-center space-x-1 hover:text-emrald-600">
             <ShoppingCart className="h-5 w-5" />
              <span className="text-sm">Cart</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;