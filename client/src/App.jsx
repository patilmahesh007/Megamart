import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from './components/Navbar';

function App() {
  return (
    <div>
      <Navbar />
      <h1 className="text-8xl font-bold text-emerald-700">
        Hello world!
      </h1>
      <Link to="/AdminPanel" className="text-blue-500 underline">
        Go to Admin Panel
      </Link>
    </div>
  );
}

export default App;
