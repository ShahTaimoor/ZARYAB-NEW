import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '../ui/button';
import { fetchOrdersMetrics } from '@/redux/slices/order/orderSlice';

const Analytics = () => {
  const dispatch = useDispatch();
  const {
    metrics: data,
    metricsStatus: status,
    metricsError: error,
  } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchOrdersMetrics());
  }, [dispatch]);

  if (status === 'loading') return <div className="p-8">Loading...</div>;
  if (status === 'failed') return <div className="p-8 text-red-500">{error}</div>;
  if (!data) return <div className="p-8">No data available.</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-500 mt-2">Last updated: {new Date().toLocaleDateString()}</p>
        </div>
        <Button variant="outline" className="mt-4 sm:mt-0">Export Report</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <p className="text-sm text-gray-500">Total Sales</p>
          <p className="text-2xl font-bold mt-2">${data.totalSales.count}</p>
          <p className="text-sm text-green-600 mt-2">↑ {data.totalSales.growth}% from last month</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <p className="text-sm text-gray-500">Total Orders</p>
          <p className="text-2xl font-bold mt-2">{data.recentSales.orders?.length || 0}</p>
          <p className="text-sm text-blue-600 mt-2">↑ {data.sales.growth}% from last month</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <p className="text-sm text-gray-500">Active Now</p>
          <p className="text-2xl font-bold mt-2">{data.activeNow.count}</p>
          <p className="text-sm text-purple-600 mt-2">↑ {data.activeNow.growth}% from yesterday</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <p className="text-sm text-gray-500">New Users</p>
          <p className="text-2xl font-bold mt-2">{data.users.count}</p>
          <p className="text-sm text-orange-600 mt-2">↑ {data.users.growth}% from last month</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border mb-8">
        <h2 className="text-xl font-semibold mb-4">Sales Overview</h2>
        <div className="h-96 bg-gray-50 flex items-center justify-center text-gray-400">
          Sales Chart Placeholder
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>
        <div className="space-y-4">
          {data.recentSales.orders.map((order, index) => (
            <div key={index} className="flex justify-between p-3 hover:bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">Order #{order._id}</p>
                <p className="text-sm text-gray-500">{order.userId?.name || 'Guest'}</p>
              </div>
              <p className="text-gray-700">${order.amount}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
