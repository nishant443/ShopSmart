import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Package, Calendar, MapPin, CreditCard, Search, Filter } from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import Loader from '../components/Loader';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [email, setEmail] = useState(searchParams.get('email') || '');
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    if (email) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [email, filterStatus]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/orders?email=${encodeURIComponent(email)}`);
      
      if (response.data.success) {
        let filteredOrders = response.data.data;
        
        if (filterStatus) {
          filteredOrders = filteredOrders.filter(order => order.orderStatus === filterStatus);
        }
        
        setOrders(filteredOrders);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to fetch orders');
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'Processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'Shipped':
        return 'bg-blue-100 text-blue-800';
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Failed':
        return 'bg-red-100 text-red-800';
      case 'Refunded':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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

        {/* Email Input Form */}
        {!email && (
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
                <div className="flex items-center gap-4">
                  <Filter className="h-5 w-5 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Filter by status:</span>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Orders</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
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
                    ? `No orders with status "${filterStatus}" found.`
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
                            {order.orderStatus}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                            {order.paymentStatus}
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
