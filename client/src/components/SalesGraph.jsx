import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import api from '../util/api.util.js';
import { Calendar, DollarSign, ArrowUpRight, RefreshCw } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const SalesGraph = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('month');
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [percentChange, setPercentChange] = useState(0);

  const fetchData = async (range) => {
    setLoading(true);
    try {
      const res = await api.get(`/order/stats?range=${range}`);
      if (!res.data || !res.data.data) {
        throw new Error("Unexpected API response format");
      }
      
      // API returns labels, counts and sales
      const { labels, counts, sales } = res.data.data;
      
      // Calculate total revenue from the sales array
      const total = sales.reduce((sum, current) => sum + current, 0);
      setTotalRevenue(total);
      
      // Calculate growth rate by comparing first half vs second half of the period
      const halfIndex = Math.floor(sales.length / 2);
      const firstHalf = sales.slice(0, halfIndex).reduce((sum, current) => sum + current, 0);
      const secondHalf = sales.slice(halfIndex).reduce((sum, current) => sum + current, 0);
      const change = firstHalf > 0 ? ((secondHalf - firstHalf) / firstHalf) * 100 : 0;
      setPercentChange(change);
      
      setChartData({
        labels,
        datasets: [
          {
            label: 'Revenue',
            data: sales,
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.2)',
            borderWidth: 2,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#fff',
            pointBorderColor: '#10b981',
            pointRadius: 4,
            pointHoverRadius: 6,
          },
        ],
      });
    } catch (error) {
      console.error("Error fetching revenue stats:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(timeRange);
  }, [timeRange]);

  const changeTimeRange = (range) => {
    setTimeRange(range);
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#10b981',
        borderWidth: 1,
        padding: 10,
        usePointStyle: true,
        callbacks: {
          label: function(context) {
            return `Revenue: ₹${context.parsed.y}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: { display: false, drawBorder: false },
        ticks: { color: '#9ca3af' }
      },
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(156, 163, 175, 0.1)', drawBorder: false },
        ticks: { color: '#9ca3af', padding: 10 }
      }
    },
    interaction: {
      mode: 'index',
      intersect: false,
    },
    elements: {
      point: { radius: 0, hoverRadius: 6 }
    },
  };

  return (
    <div className="bg-gray-800 rounded-xl shadow-lg p-6 w-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-teal-300 mb-1">Revenue Trend</h2>
          <div className="flex items-center text-gray-400">
            <Calendar size={16} className="mr-2" />
            <span>
              {timeRange === 'week' ? 'Past 7 Days' : 
               timeRange === 'month' ? 'Past 30 Days' : 'Past 90 Days'}
            </span>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button 
            onClick={() => changeTimeRange('week')} 
            className={`px-3 py-1 rounded-md text-sm ${
              timeRange === 'week' 
                ? 'bg-teal-500 text-black' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Week
          </button>
          <button 
            onClick={() => changeTimeRange('month')} 
            className={`px-3 py-1 rounded-md text-sm ${
              timeRange === 'month' 
                ? 'bg-teal-500 text-black' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Month
          </button>
          <button 
            onClick={() => changeTimeRange('quarter')} 
            className={`px-3 py-1 rounded-md text-sm ${
              timeRange === 'quarter' 
                ? 'bg-teal-500 text-black' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Quarter
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="text-gray-400 text-sm">Total Revenue</div>
            <div className="p-2 bg-teal-500/20 rounded-full">
              <DollarSign size={16} className="text-teal-500" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white mt-2">₹{totalRevenue.toLocaleString()}</div>
        </div>
        
        <div className="bg-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="text-gray-400 text-sm">Growth Rate</div>
            <div className="p-2 bg-teal-500/20 rounded-full">
              <ArrowUpRight size={16} className="text-teal-500" />
            </div>
          </div>
          <div className={`text-2xl font-bold mt-2 ${percentChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {percentChange >= 0 ? '+' : ''}{percentChange.toFixed(1)}%
          </div>
        </div>
      </div>
      
      <div className="h-64 md:h-80 relative">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <RefreshCw size={24} className="text-teal-500 animate-spin" />
          </div>
        ) : chartData ? (
          <Line data={chartData} options={options} />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-gray-400">No data available</p>
          </div>
        )}
      </div>
      
      <div className="mt-4 flex justify-end">
        <button 
          onClick={() => fetchData(timeRange)} 
          className="flex items-center text-sm text-teal-400 hover:text-teal-300"
        >
          <RefreshCw size={14} className="mr-1" />
          Refresh Data
        </button>
      </div>
    </div>
  );
};

export default SalesGraph;
