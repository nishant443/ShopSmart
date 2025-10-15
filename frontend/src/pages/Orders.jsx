import { useState, useEffect } from 'react';
import { useSearchParams, Link, Navigate } from 'react-router-dom';
import { Package, Calendar, MapPin, CreditCard, Search, Filter } from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import Loader from '../components/Loader';
import { useAuth } from '../context/AuthContext';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const [email, setEmail] = useState(searchParams.get('email') || '');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPaymentStatus, setFilterPaymentStatus] = useState('');
  const [orderIdSearch, setOrderIdSearch] = useState('');

  // When auth user becomes available, use their email to fetch orders
  // Avoid flicker: if there is no logged-in user in context and none in localStorage,
  // immediately navigate to login page using <Navigate>.
  const stored = localStorage.getItem('auth_user');
  if (!user && !stored) {
    return <Navigate to="/login" replace />;
  }

  useEffect(() => {
    if (user && user.email) {
      setEmail(user.email);
      // remove any ?email= query param in the URL
      setSearchParams({});
    }
  }, [user, setSearchParams]);

  // Fetch whenever email or any filter changes
  useEffect(() => {
    if (!user) return;
    if (email) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [email, filterStatus, filterPaymentStatus, orderIdSearch, user]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      // FIXED: Changed to use api instance with proper URL
      const response = await api.get('/orders', {
        params: { email: email }
      });

      console.log('Orders response:', response.data);

      if (response.data.success) {
        let filteredOrders = response.data.data || [];

        // Apply order status filter
        if (filterStatus) {
          filteredOrders = filteredOrders.filter(order => (order.orderStatus || '').toLowerCase() === filterStatus.toLowerCase());
        }

        // Apply payment status filter
        if (filterPaymentStatus) {
          filteredOrders = filteredOrders.filter(order => (order.paymentStatus || '').toLowerCase() === filterPaymentStatus.toLowerCase());
        }

        // Apply order ID search (partial)
        if (orderIdSearch && orderIdSearch.trim()) {
          const q = orderIdSearch.trim().toLowerCase();
          filteredOrders = filteredOrders.filter(order => (order._id || '').toLowerCase().includes(q));
        }

        // Ensure newest first
        filteredOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        setOrders(filteredOrders);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      // Don't show toast here - axios interceptor already handles it
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSearchParams({ email: email.trim() });
      fetchOrders();
    } else {
      toast.error('Please enter an email address');
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // FIXED: Changed to lowercase to match model
  const getStatusColor = (status) => {
    const statusLower = status?.toLowerCase();
    switch (statusLower) {
      case 'pending':
        return 'bg-gray-100 text-gray-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // FIXED: Changed to lowercase to match model
  const getPaymentStatusColor = (status) => {
    const statusLower = status?.toLowerCase();
    switch (statusLower) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Helper to capitalize first letter for display
  const capitalizeFirstLetter = (string) => {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  if (loading) {
    return <Loader size="large" text="Loading your orders..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 flex items-center">
            <Package className="h-8 w-8 mr-3" />
            My Orders
          </h1>
          <p className="text-gray-600">
            Track and manage your orders
          </p>
        </div>

        {/* Email Input Form (only for unauthenticated users) */}
        {!user && !email && (
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Enter Your Email to View Orders
            </h2>
            <form onSubmit={handleEmailSubmit} className="flex gap-4">
              <div className="flex-1">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <Search className="h-5 w-5 mr-2" />
                View Orders
              </button>
            </form>
          </div>
        )}

        {/* Orders Section */}
        {email && (
          <>
            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex flex-wrap items-center gap-3">
                  <Filter className="h-5 w-5 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Order status</span>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All</option>
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>

                  <span className="text-sm font-medium text-gray-700 ml-2">Payment</span>
                  <select
                    value={filterPaymentStatus}
                    onChange={(e) => setFilterPaymentStatus(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All</option>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="failed">Failed</option>
                    <option value="refunded">Refunded</option>
                  </select>

                  <input
                    type="text"
                    placeholder="Search order id"
                    value={orderIdSearch}
                    onChange={(e) => setOrderIdSearch(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />

                  <button
                    onClick={() => { setFilterStatus(''); setFilterPaymentStatus(''); setOrderIdSearch(''); }}
                    className="px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    Clear
                  </button>
                </div>

                <div className="text-sm text-gray-600">
                  Showing orders for: <span className="font-medium">{email}</span>
                </div>
              </div>
            </div>

            {/* Orders List */}
            {orders.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-gray-400 mb-4">
                  <Package className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No orders found
                </h3>
                <p className="text-gray-600 mb-6">
                  {filterStatus
                    ? `No orders with status "${capitalizeFirstLetter(filterStatus)}" found.`
                    : 'You haven\'t placed any orders yet or the email address is incorrect.'
                  }
                </p>
                <Link
                  to="/"
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div key={order._id} className="bg-white rounded-lg shadow-sm border">
                    {/* Order Header */}
                    <div className="p-6 border-b border-gray-200">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            Order #{order._id.slice(-8).toUpperCase()}
                          </h3>
                          <p className="text-sm text-gray-600 flex items-center mt-1">
                            <Calendar className="h-4 w-4 mr-1" />
                            {formatDate(order.createdAt)}
                          </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.orderStatus)}`}>
                            {capitalizeFirstLetter(order.orderStatus)}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                            {capitalizeFirstLetter(order.paymentStatus)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="p-6">
                      <div className="space-y-4">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex items-center space-x-4">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="h-16 w-16 object-cover rounded"
                              onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/64x64?text=No+Image';
                              }}
                            />
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900">{item.name}</h4>
                              <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                              <p className="text-sm text-gray-600">
                                Price: {formatPrice(item.price)} each
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-gray-900">
                                {formatPrice(item.price * item.quantity)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Shipping Address */}
                      {order.shippingAddress && (
                        <div className="mt-6 pt-6 border-t border-gray-200">
                          <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                            <MapPin className="h-4 w-4 mr-2" />
                            Shipping Address
                          </h4>
                          <div className="text-sm text-gray-600">
                            <p>{order.shippingAddress.name}</p>
                            <p>{order.shippingAddress.address}</p>
                            <p>{order.shippingAddress.city} - {order.shippingAddress.postalCode}</p>
                            <p>{order.shippingAddress.country}</p>
                          </div>
                        </div>
                      )}

                      {/* Order Total */}
                      <div className="mt-6 pt-6 border-t border-gray-200">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center text-gray-600">
                            <CreditCard className="h-5 w-5 mr-2" />
                            <span className="text-sm">Payment Method: Stripe</span>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-600">Total Amount</p>
                            <p className="text-xl font-bold text-gray-900">
                              {formatPrice(order.totalAmount)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Orders;