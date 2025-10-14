import { Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
  };

  const handleQuantityChange = (newQuantity) => {
    updateQuantity(item.id, newQuantity);
  };

  const handleRemove = () => {
    removeFromCart(item.id);
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 p-4 bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
      {/* Product Image */}
      <div className="flex-shrink-0">
        <img
          src={item.image}
          alt={item.name}
          className="h-24 w-24 object-cover rounded-lg"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/96x96?text=No+Image';
          }}
        />
      </div>

      {/* Product Info */}
      <div className="flex-1 min-w-0 w-full sm:w-auto">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          {item.name}
        </h3>
        <p className="text-sm text-gray-600 line-clamp-2 mb-2">
          {item.description}
        </p>
        <p className="text-lg font-bold text-green-600">
          {formatPrice(item.price)}
        </p>
        {item.stock < 10 && (
          <p className="text-xs text-orange-600 mt-1">
            Only {item.stock} left in stock
          </p>
        )}
      </div>

      {/* Quantity Controls - Mobile & Desktop */}
      <div className="flex items-center justify-between sm:justify-start w-full sm:w-auto space-x-4">
        <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => handleQuantityChange(item.quantity - 1)}
            className="p-2 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={item.quantity <= 1}
            aria-label="Decrease quantity"
          >
            <Minus className="h-4 w-4 text-gray-600" />
          </button>

          <span className="px-4 py-1 text-sm font-semibold min-w-[2.5rem] text-center">
            {item.quantity}
          </span>

          <button
            onClick={() => handleQuantityChange(item.quantity + 1)}
            className="p-2 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={item.quantity >= item.stock}
            aria-label="Increase quantity"
          >
            <Plus className="h-4 w-4 text-gray-600" />
          </button>
        </div>

        {/* Total Price - Desktop */}
        <div className="hidden sm:block text-right">
          <p className="text-lg font-bold text-gray-900">
            {formatPrice(item.price * item.quantity)}
          </p>
          <p className="text-xs text-gray-500">
            {item.quantity} × {formatPrice(item.price)}
          </p>
        </div>

        {/* Remove Button */}
        <button
          onClick={handleRemove}
          className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
          title="Remove item"
          aria-label="Remove item from cart"
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </div>

      {/* Total Price - Mobile */}
      <div className="sm:hidden w-full flex justify-between items-center pt-2 border-t">
        <span className="text-sm text-gray-600">Subtotal:</span>
        <span className="text-lg font-bold text-gray-900">
          {formatPrice(item.price * item.quantity)}
        </span>
      </div>
    </div>
  );
};

export default CartItem;