import React, { useState } from 'react';
import axios from 'axios';
import { ShoppingCart, CheckCircle, XCircle, BookOpen, DollarSign } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Product = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentResult, setPaymentResult] = useState(null);

  const PRODUCT = {
    name: 'Advanced Web Tech E-book',
    price: 49.99,
    description: 'Comprehensive guide covering modern web technologies including React, Node.js, MongoDB, and full-stack development.',
    features: [
      '500+ pages of in-depth content',
      'Real-world project examples',
      'Best practices and design patterns',
      'Lifetime updates and support'
    ]
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    setPaymentResult(null);

    try {
      const response = await axios.post(`${API}/checkout`, {
        amount: PRODUCT.price
      });

      setPaymentResult(response.data);
    } catch (error) {
      console.error('Payment error:', error);
      setPaymentResult({
        status: 'ERROR',
        message: 'An error occurred during payment processing. Please try again.'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Product Card */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden transition-colors duration-300">
        {/* Product Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
              <BookOpen className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">{PRODUCT.name}</h1>
              <p className="text-indigo-100 mt-1">Master modern web development</p>
            </div>
          </div>
        </div>

        {/* Product Content */}
        <div className="p-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Product Details */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                What's Included:
              </h2>
              <ul className="space-y-3">
                {PRODUCT.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {PRODUCT.description}
                </p>
              </div>
            </div>

            {/* Payment Section */}
            <div>
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-xl p-6 border-2 border-gray-200 dark:border-gray-600">
                <div className="text-center mb-6">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Price</p>
                  <div className="flex items-center justify-center gap-2">
                    <DollarSign className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                    <span className="text-5xl font-bold text-gray-900 dark:text-white">
                      {PRODUCT.price.toFixed(2)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold py-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Processing Payment...
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5" />
                      Pay Now
                    </>
                  )}
                </button>

                <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-4">
                  Secure payment simulation • Instant access
                </p>
              </div>

              {/* Payment Result */}
              {paymentResult && (
                <div className={`mt-6 p-4 rounded-lg border-2 ${
                  paymentResult.status === 'SUCCESS'
                    ? 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800'
                    : 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800'
                }`}>
                  <div className="flex items-start gap-3">
                    {paymentResult.status === 'SUCCESS' ? (
                      <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <h3 className={`font-semibold mb-1 ${
                        paymentResult.status === 'SUCCESS'
                          ? 'text-green-800 dark:text-green-300'
                          : 'text-red-800 dark:text-red-300'
                      }`}>
                        {paymentResult.status === 'SUCCESS' ? 'Payment Successful!' : 'Payment Failed'}
                      </h3>
                      <p className={`text-sm ${
                        paymentResult.status === 'SUCCESS'
                          ? 'text-green-700 dark:text-green-400'
                          : 'text-red-700 dark:text-red-400'
                      }`}>
                        {paymentResult.message}
                      </p>
                      {paymentResult.order_id && (
                        <p className="text-xs text-green-600 dark:text-green-400 mt-2 font-mono">
                          Order ID: {paymentResult.order_id}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Additional Info */}
      <div className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
        <p>💳 This is a simulated payment system for demonstration purposes</p>
        <p className="mt-1">Minimum amount: $49.99 for successful transaction</p>
      </div>
    </div>
  );
};

export default Product;
