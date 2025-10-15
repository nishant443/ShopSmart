import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, Package, Mail, MapPin, CreditCard, Home } from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import Loader from '../components/Loader';

const Success = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');

  const [loading, setLoading] = useState(true);
  const [orderData, setOrderData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!sessionId) {
      setError('No session ID found');
      setLoading(false);
      return;
    }

    verifyPaymentAndGetOrder();
  }, [sessionId]);

  const verifyPaymentAndGetOrder = async () => {
    try {
      setLoading(true);
      console.log('🔍 Verifying payment for session:', sessionId);

      // Make API call to verify payment
      const response = await api.get(`/orders/verify-payment/${sessionId}`);

      console.log('📦 API Response:', response.data);

      if (response.data.success) {
        // Store the data object which contains both order and session
        setOrderData(response.data.data);
        console.log('✅ Order verified:', response.data.data);

        // Show success message
        toast.success('Payment successful! Your order has been placed.');
      } else {
        throw new Error(response.data.message || 'Failed to verify payment');
      }
    } catch (error) {
      console.error('❌ Error verifying payment:', error);
      console.error('❌ Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        url: error.config?.url
      });

      const errorMessage = error.response?.data?.message || error.message || 'Failed to verify payment';
      setError(errorMessage);
      toast.error(errorMessage);
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
    return <Loader size="large" text="Verifying your payment..." />;
  }

  if (error || !orderData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-sm border p-8 text-center">
          <div className="text-red-500 mb-4">
            <Package className="h-16 w-16 mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Payment Verification Failed
          </h2>
          <p className="text-gray-600 mb-6">
            {error || 'Unable to verify your payment. Please contact support.'}
          </p>
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Home className="h-5 w-5 mr-2" />
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  // Safely destructure order and session
  const { order, session } = orderData;

  // Add safety check
  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-sm border p-8 text-center">
          <div className="text-red-500 mb-4">
            <Package className="h-16 w-16 mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Order Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            Unable to load order details. Please contact support.
          </p>
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Home className="h-5 w-5 mr-2" />
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Header */}
        <div className="bg-white rounded-lg shadow-sm border p-8 mb-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-green-100 rounded-full p-3">
              <CheckCircle className="h-16 w-16 text-green-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Payment Successful!
          </h1>
          <p className="text-lg text-gray-600 mb-4">
            Thank you for your order. Your payment has been processed successfully.
          </p>
          <div className="bg-blue-50 rounded-lg p-4 inline-block">
            <p className="text-sm text-gray-600">Order ID</p>
            <p className="text-xl font-mono font-bold text-blue-600">
              #{order._id.slice(-8).toUpperCase()}
            </p>
          </div>
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Order Details
          </h2>

          {/* Order Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <div className="flex items-center text-gray-600 mb-2">
                <Mail className="h-5 w-5 mr-2" />
                <span className="font-medium">Email</span>
              </div>
              <p className="text-gray-900 ml-7">{order.email}</p>
            </div>
            <div>
              <div className="flex items-center text-gray-600 mb-2">
                <Package className="h-5 w-5 mr-2" />
                <span className="font-medium">Order Date</span>
              </div>
              <p className="text-gray-900 ml-7">{formatDate(order.createdAt)}</p>
            </div>
          </div>

          {/* Items */}
          <div className="border-t pt-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">Items Ordered</h3>
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
                    <p className="text-sm text-gray-600">
                      Quantity: {item.quantity} × {formatPrice(item.price)}
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
          </div>

          {/* Shipping Address */}
          {order.shippingAddress && (
            <div className="border-t pt-6 mb-6">
              <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Shipping Address
              </h3>
              <div className="text-gray-600 ml-7">
                <p>{order.shippingAddress.name}</p>
                <p>{order.shippingAddress.address}</p>
                <p>{order.shippingAddress.city} - {order.shippingAddress.postalCode}</p>
                <p>{order.shippingAddress.country}</p>
              </div>
            </div>
          )}

          {/* Payment Summary */}
          <div className="border-t pt-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center text-gray-600">
                <CreditCard className="h-5 w-5 mr-2" />
                <span className="font-medium">Payment Method</span>
              </div>
              <span className="text-gray-900">Stripe</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Payment Status</span>
              <span className="font-medium text-green-600 capitalize">
                {order.paymentStatus}
              </span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Order Status</span>
              <span className="font-medium text-blue-600 capitalize">
                {order.orderStatus}
              </span>
            </div>
            <div className="flex justify-between items-center mb-2 mt-4">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">{formatPrice(order.totalAmount)}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Shipping</span>
              <span className="font-medium text-green-600">FREE</span>
            </div>
            <div className="flex justify-between items-center text-lg font-bold border-t pt-2 mt-2">
              <span>Total Paid</span>
              <span className="text-green-600">{formatPrice(order.totalAmount)}</span>
            </div>
          </div>
        </div>

        {/* Order Status */}
        <div className="bg-blue-50 rounded-lg p-6 mb-6">
          <h3 className="font-semibold text-gray-900 mb-2">What's Next?</h3>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">✓</span>
              <span>You will receive an order confirmation email at <strong>{order.email}</strong></span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">✓</span>
              <span>Your order is being processed and will be shipped soon</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">✓</span>
              <span>You can track your order status using your email address</span>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to={`/orders?email=${order.email}`}
            className="flex-1 flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Package className="h-5 w-5 mr-2" />
            View My Orders
          </Link>
          <Link
            to="/"
            className="flex-1 flex items-center justify-center px-6 py-3 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Home className="h-5 w-5 mr-2" />
            Continue Shopping
          </Link>
        </div>

        {/* Support */}
        <div className="text-center mt-8 text-sm text-gray-600">
          <p>
            Need help? Contact us at{' '}
            <a href="mailto:support@example.com" className="text-blue-600 hover:underline">
              support@example.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Success;