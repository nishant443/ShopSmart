import { Link } from 'react-router-dom';
import { XCircle, ArrowLeft, RefreshCw, Home } from 'lucide-react';

const Failure = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Failure Header */}
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-red-100 mb-6">
            <XCircle className="h-12 w-12 text-red-600" />
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Payment Failed
          </h1>
          
          <p className="text-xl text-gray-600 mb-8">
            We're sorry, but your payment could not be processed at this time.
          </p>
        </div>

        {/* Error Details */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            What happened?
          </h2>
          
          <div className="space-y-4 text-gray-600">
            <p>
              Your payment was not completed. This could be due to several reasons:
            </p>
            
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Insufficient funds in your account</li>
              <li>Card details were entered incorrectly</li>
              <li>Your bank declined the transaction</li>
              <li>Network connectivity issues</li>
              <li>Session timeout</li>
            </ul>
          </div>
        </div>

        {/* What to do next */}
        <div className="bg-blue-50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-blue-900 mb-4">
            What can you do?
          </h2>
          
          <div className="space-y-3 text-blue-800">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                1
              </div>
              <p>Check your payment method and try again</p>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                2
              </div>
              <p>Contact your bank if you believe this is an error</p>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                3
              </div>
              <p>Try using a different payment method</p>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                4
              </div>
              <p>Contact our support team if the problem persists</p>
            </div>
          </div>
        </div>

        {/* Support Information */}
        <div className="bg-gray-100 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Need Help?
          </h3>
          <div className="space-y-2 text-gray-600">
            <p>
              If you continue to experience issues, please contact our support team:
            </p>
            <div className="space-y-1">
              <p><strong>Email:</strong> support@shopsmart.com</p>
              <p><strong>Phone:</strong> +1 (555) 123-4567</p>
              <p><strong>Hours:</strong> Monday - Friday, 9 AM - 6 PM</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/cart"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="h-5 w-5 mr-2" />
            Try Again
          </Link>
          
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Home className="h-5 w-5 mr-2" />
            Back to Home
          </Link>
        </div>

        {/* Additional Help */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">
            Your cart items have been saved. You can try the payment again or contact support for assistance.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Failure;
