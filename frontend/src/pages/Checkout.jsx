import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ArrowLeft, CreditCard, MapPin, User, Mail, Phone } from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import Loader from '../components/Loader';

const Checkout = () => {
  const navigate = useNavigate();
  const { items, cartTotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    shippingAddress: {
      name: '',
      address: '',
      city: '',
      postalCode: '',
      country: 'India'
    }
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart');
    }
  }, [items.length, navigate]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Shipping address validation
    if (!formData.shippingAddress.name) {
      newErrors['shippingAddress.name'] = 'Full name is required';
    }

    if (!formData.shippingAddress.address) {
      newErrors['shippingAddress.address'] = 'Address is required';
    }

    if (!formData.shippingAddress.city) {
      newErrors['shippingAddress.city'] = 'City is required';
    }

    if (!formData.shippingAddress.postalCode) {
      newErrors['shippingAddress.postalCode'] = 'Postal code is required';
    } else if (!/^\d{6}$/.test(formData.shippingAddress.postalCode)) {
      newErrors['shippingAddress.postalCode'] = 'Please enter a valid 6-digit postal code';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fill in all required fields correctly');
      return;
    }

    try {
      setLoading(true);

      // Create checkout session with Stripe
      const response = await api.post('/create-checkout-session', {
        cartItems: items,
        email: formData.email
      });

      if (response.data.success && response.data.url) {
        // Redirect to Stripe checkout
        window.location.href = response.data.url;
      } else {
        throw new Error('Failed to create checkout session');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Failed to process checkout. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return null; // Will redirect to cart
  }

  const totalWithTax = cartTotal + (cartTotal * 0.18);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate('/cart')}
            className="flex items-center text-blue-600 hover:text-blue-700 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <CreditCard className="h-6 w-6 mr-2" />
              Checkout
            </h1>

            <form onSubmit={handleCheckout} className="space-y-6">
              {/* Contact Information */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Mail className="h-5 w-5 mr-2" />
                  Contact Information
                </h2>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="your@email.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>
              </div>

              {/* Shipping Address */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Shipping Address
                </h2>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label htmlFor="shippingAddress.name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="shippingAddress.name"
                      name="shippingAddress.name"
                      value={formData.shippingAddress.name}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors['shippingAddress.name'] ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="John Doe"
                    />
                    {errors['shippingAddress.name'] && (
                      <p className="mt-1 text-sm text-red-600">{errors['shippingAddress.name']}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="shippingAddress.address" className="block text-sm font-medium text-gray-700 mb-2">
                      Address *
                    </label>
                    <textarea
                      id="shippingAddress.address"
                      name="shippingAddress.address"
                      value={formData.shippingAddress.address}
                      onChange={handleInputChange}
                      rows={3}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors['shippingAddress.address'] ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Street address, apartment, suite, etc."
                    />
                    {errors['shippingAddress.address'] && (
                      <p className="mt-1 text-sm text-red-600">{errors['shippingAddress.address']}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="shippingAddress.city" className="block text-sm font-medium text-gray-700 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        id="shippingAddress.city"
                        name="shippingAddress.city"
                        value={formData.shippingAddress.city}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors['shippingAddress.city'] ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Mumbai"
                      />
                      {errors['shippingAddress.city'] && (
                        <p className="mt-1 text-sm text-red-600">{errors['shippingAddress.city']}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="shippingAddress.postalCode" className="block text-sm font-medium text-gray-700 mb-2">
                        Postal Code *
                      </label>
                      <input
                        type="text"
                        id="shippingAddress.postalCode"
                        name="shippingAddress.postalCode"
                        value={formData.shippingAddress.postalCode}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors['shippingAddress.postalCode'] ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="400001"
                        maxLength="6"
                      />
                      {errors['shippingAddress.postalCode'] && (
                        <p className="mt-1 text-sm text-red-600">{errors['shippingAddress.postalCode']}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="shippingAddress.country" className="block text-sm font-medium text-gray-700 mb-2">
                      Country
                    </label>
                    <select
                      id="shippingAddress.country"
                      name="shippingAddress.country"
                      value={formData.shippingAddress.country}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="India">India</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Payment Information
                </h2>
                <p className="text-sm text-gray-600">
                  You will be redirected to Stripe for secure payment processing. 
                  We accept all major credit cards and UPI payments.
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              >
                {loading ? (
                  <Loader size="small" text="" />
                ) : (
                  <>
                    <CreditCard className="h-5 w-5 mr-2" />
                    Proceed to Payment - {formatPrice(totalWithTax)}
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Order Summary
            </h2>

            {/* Items */}
            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div key={item.id} className="flex items-center space-x-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-12 w-12 object-cover rounded"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/48x48?text=No+Image';
                    }}
                  />
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="space-y-2 border-t pt-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">{formatPrice(cartTotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium text-green-600">FREE</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax (18%)</span>
                <span className="font-medium">{formatPrice(cartTotal * 0.18)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t pt-2">
                <span>Total</span>
                <span>{formatPrice(totalWithTax)}</span>
              </div>
            </div>

            {/* Security Notice */}
            <div className="mt-6 p-4 bg-green-50 rounded-lg">
              <div className="flex items-center">
                <div className="text-green-600 mr-2">🔒</div>
                <div>
                  <h3 className="text-sm font-medium text-green-800">Secure Payment</h3>
                  <p className="text-sm text-green-700">
                    Your payment information is encrypted and secure.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
