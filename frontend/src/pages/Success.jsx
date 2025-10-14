import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, Package, ArrowRight, Home } from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import Loader from '../components/Loader';

const Success = () => {
  const [searchParams] = useSearchParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (sessionId) {
      fetchOrderDetails();
    } else {
      setLoading(false);
    }
  }, [sessionId]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      
      // First try to get order by session ID
      const response = await api.get(`/orders/session/${sessionId}`);
      
      if (response.data.success) {
        setOrder(response.data.data);
      } else {
        // If order not found, try to verify the session
        const sessionResponse = await api.get(`/verify-session/${sessionId}`);
        if (sessionResponse.data.success) {
          toast.success('Payment successful! Your order is being processed.');
        }
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
      toast.error('Unable to fetch order details, but payment was successful.');
    } finally {
      setLoading(false);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader size="large" text="Processing your order..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-6">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Payment Successful!
          </h1>
          
          <p className="text-xl text-gray-600 mb-8">
            Thank you for your order. We've received your payment and will process your order shortly.
          </p>

          {order && (
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Order Details
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Order Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Order ID:</span>
                      <span className="font-medium">{order._id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Order Date:</span>
                      <span className="font-medium">{formatDate(order.createdAt)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className={`font-medium px-2 py-1 rounded-full text-xs ${
                        order.orderStatus === 'Processing' 
                          ? 'bg-yellow-100 text-yellow-800'
                          : order.orderStatus === 'Shipped'
                          ? 'bg-blue-100 text-blue-800'
                          : order.orderStatus === 'Delivered'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {order.orderStatus}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Status:</span>
                      <span className="font-medium text-green-600">{order.paymentStatus}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Shipping Information</h3>
                  <div className="text-sm text-gray-600">
                    <p className="font-medium">{order.shippingAddress?.name}</p>
                    <p>{order.shippingAddress?.address}</p>
                    <p>{order.shippingAddress?.city} - {order.shippingAddress?.postalCode}</p>
                    <p>{order.shippingAddress?.country}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Order Items */}
          {order && order.items && (
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Order Items
              </h2>
              
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-16 w-16 object-cover rounded"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/64x64?text=No+Image';
                      }}
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      <p className="text-sm text-gray-600">Price: {formatPrice(item.price)} each</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total Amount:</span>
                  <span>{formatPrice(order.totalAmount)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Next Steps */}
          <div className="bg-blue-50 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-blue-900 mb-4 flex items-center">
              <Package className="h-6 w-6 mr-2" />
              What's Next?
            </h2>
            <div className="text-left space-y-3 text-blue-800">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                  1
                </div>
                <p>You'll receive an email confirmation with your order details.</p>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                  2
                </div>
                <p>We'll process your order and prepare it for shipment.</p>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                  3
                </div>
                <p>You'll receive tracking information once your order ships.</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/orders"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              View All Orders
              <ArrowRight className="h-5 w-5 ml-2" />
            </Link>
            
            <Link
              to="/"
              className="inline-flex items-center px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Home className="h-5 w-5 mr-2" />
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Success;
