import React from 'react';
import { useParams } from 'react-router-dom';

import User from "./admin/user.jsx";
import Order from "./admin/order.jsx";
import Product from "./admin/product.jsx";
import sales from "./admin/sales.jsx";
import categories from "./admin/categories.jsx";

function Dynamic() {
  const { route } = useParams();

  const componentMapping = {
    users: User,
    orders: Order,
    products: Product,
    sales: sales,
    categories: categories,
   
  };

  const ComponentToRender = componentMapping[route];

  return (
    <div className="p-6 bg-black min-h-screen">
      {ComponentToRender ? (
        <ComponentToRender />
      ) : (
        <div>
          <h1 className="text-2xl font-bold mb-4">No component found for route: {route}</h1>
          <p className="text-gray-700">Please check the route parameter.</p>
        </div>
      )}
    </div>
  );
}

export default Dynamic;
