import { Link } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import CartItem from '../components/CartItem';

const Cart = () => {
  const { items, cartTotal, clearCart } = useCart();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
  };

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      clearCart();
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex items-center mb-8">
            <Link
              to="/"
              className="flex items-center text-blue-600 hover:text-blue-700 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Continue Shopping
            </Link>
          </div>

          {/* Empty Cart */}
          <div className="text-center py-16">
            <div className="text-gray-400 mb-6">
              <ShoppingCart className="h-24 w-24 mx-auto" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Your cart is empty
            </h1>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Looks like you haven't added any items to your cart yet. 
              Start shopping to fill it up!
            </p>
            <Link
              to="/"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Link
              to="/"
              className="flex items-center text-blue-600 hover:text-blue-700 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Continue Shopping
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900">
              Shopping Cart ({items.length} {items.length === 1 ? 'item' : 'items'})
            </h1>
            
            {items.length > 0 && (
              <button
                onClick={handleClearCart}
                className="flex items-center px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear Cart
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Order Summary
              </h2>

              {/* Order Details */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Items ({items.length})</span>
                  <span className="font-medium">
                    {formatPrice(items.reduce((total, item) => total + (item.price * item.quantity), 0))}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium text-green-600">FREE</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">
                    {formatPrice(cartTotal * 0.18)} {/* 18% GST */}
                  </span>
                </div>
                
                <hr className="border-gray-200" />
                
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>
                    {formatPrice(cartTotal + (cartTotal * 0.18))}
                  </span>
                </div>
              </div>

              {/* Checkout Button */}
              <Link
                to="/checkout"
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors text-center block"
              >
                Proceed to Checkout
              </Link>

              {/* Security Notice */}
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-500">
                  🔒 Secure checkout with SSL encryption
                </p>
              </div>

              {/* Continue Shopping */}
              <Link
                to="/"
                className="w-full mt-4 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors text-center block"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
