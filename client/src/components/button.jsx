import React from 'react';
import { ShoppingCart } from 'lucide-react';

export const CartButton = ({
  product,
  quantity,
  cartQuantity,
  setCartQuantity,
  handleAddToCart,
}) => {
  return (
    <div className="flex flex-col items-center">
      {cartQuantity > 0 ? (
        <div className="flex items-center justify-center space-x-4 border border-gray-300 rounded-lg p-2">
          <button
            onClick={() => setCartQuantity((prev) => Math.max(0, prev - 1))}
            className="w-10 h-10 flex justify-center items-center bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
          >
            -
          </button>
          <span className="text-xl font-semibold">{cartQuantity}</span>
          <button
            onClick={() => setCartQuantity((prev) => prev + 1)}
            className="w-10 h-10 flex justify-center items-center bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            +
          </button>
        </div>
      ) : (
        <button
          onClick={handleAddToCart}
          className="px-6 py-3 bg-purple-600 hover:bg-purple-700 transition text-white text-lg font-semibold rounded-lg flex items-center justify-center space-x-2"
        >
          <ShoppingCart size={20} />
          <span>Add to Cart</span>
        </button>
      )}
    </div>
  );
};

export const MobileCartButton = ({
  product,
  quantity,
  cartQuantity,
  setCartQuantity,
  handleAddToCart,
  incrementQuantity,
  decrementQuantity,
  discountPercentage,
}) => {
  return (
    <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-4 md:hidden">
      {cartQuantity > 0 ? (
        <div className="flex flex-col items-center">
          <div className="flex items-center justify-center space-x-4 border border-gray-300 rounded-lg p-2">
            <button
              onClick={() => setCartQuantity((prev) => Math.max(0, prev - 1))}
              className="w-10 h-10 flex justify-center items-center bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
            >
              -
            </button>
            <span className="text-xl font-semibold">{cartQuantity}</span>
            <button
              onClick={() => setCartQuantity((prev) => prev + 1)}
              className="w-10 h-10 flex justify-center items-center bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
            >
              +
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={handleAddToCart}
          className="w-full py-3.5 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition shadow-md flex items-center justify-center space-x-2"
        >
          <ShoppingCart size={20} className="mr-2" />
          <span>Add to Cart</span>
        </button>
      )}
    </div>
  );
};

export default CartButton;
