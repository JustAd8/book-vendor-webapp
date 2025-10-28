import React, { useState } from 'react';
import axios from 'axios';
import { ShoppingCart, CheckCircle, XCircle, BookOpen, DollarSign, Star, Sparkles } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Product = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentResult, setPaymentResult] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const PRODUCTS = [
    {
      id: 1,
      name: 'Advanced Web Tech E-book',
      price: 49.99,
      originalPrice: 69.99,
      rating: 4.9,
      reviews: 2847,
      description: 'Master modern web development with comprehensive coverage of React, Node.js, and MongoDB.',
      features: [
        '500+ pages of in-depth content',
        'Real-world project examples',
        'Best practices and design patterns',
        'Lifetime updates and support'
      ],
      badge: 'Bestseller',
      gradient: 'from-indigo-500 to-purple-600'
    },
    {
      id: 2,
      name: 'React Mastery Guide',
      price: 39.99,
      originalPrice: 54.99,
      rating: 4.8,
      reviews: 1923,
      description: 'Deep dive into React with hooks, context, performance optimization, and advanced patterns.',
      features: [
        'Advanced React patterns',
        'Hooks and custom hooks',
        'Performance optimization',
        'Real-world applications'
      ],
      badge: 'Popular',
      gradient: 'from-blue-500 to-cyan-600'
    },
    {
      id: 3,
      name: 'Node.js Complete Course',
      price: 44.99,
      originalPrice: 59.99,
      rating: 4.7,
      reviews: 1654,
      description: 'Build scalable backend applications with Node.js, Express, and modern JavaScript.',
      features: [
        'RESTful API development',
        'Database integration',
        'Authentication & security',
        'Deployment strategies'
      ],
      badge: 'Trending',
      gradient: 'from-green-500 to-emerald-600'
    },
    {
      id: 4,
      name: 'MongoDB Essentials',
      price: 34.99,
      originalPrice: 49.99,
      rating: 4.6,
      reviews: 1432,
      description: 'Learn NoSQL database design, queries, aggregation, and optimization with MongoDB.',
      features: [
        'Schema design patterns',
        'Advanced queries',
        'Aggregation framework',
        'Performance tuning'
      ],
      badge: 'New',
      gradient: 'from-emerald-500 to-teal-600'
    },
    {
      id: 5,
      name: 'Full-Stack Development',
      price: 59.99,
      originalPrice: 89.99,
      rating: 5.0,
      reviews: 3124,
      description: 'Complete guide from frontend to backend, covering the entire MERN stack ecosystem.',
      features: [
        'End-to-end development',
        'MERN stack mastery',
        '10+ production projects',
        'DevOps and deployment'
      ],
      badge: 'Premium',
      gradient: 'from-purple-500 to-pink-600'
    },
    {
      id: 6,
      name: 'JavaScript Deep Dive',
      price: 42.99,
      originalPrice: 57.99,
      rating: 4.8,
      reviews: 2156,
      description: 'Comprehensive exploration of JavaScript fundamentals, ES6+, async programming, and more.',
      features: [
        'ES6+ features mastery',
        'Async programming',
        'Functional programming',
        'Design patterns'
      ],
      badge: 'Featured',
      gradient: 'from-yellow-500 to-orange-600'
    }
  ];

  const handlePayment = async (product) => {
    setIsProcessing(true);
    setPaymentResult(null);
    setSelectedProduct(product);

    try {
      const response = await axios.post(`${API}/checkout`, {
        amount: product.price
      });

      setPaymentResult({ ...response.data, productName: product.name });
    } catch (error) {
      console.error('Payment error:', error);
      setPaymentResult({
        status: 'ERROR',
        message: 'An error occurred during payment processing. Please try again.',
        productName: product.name
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const getBadgeColor = (badge) => {
    const colors = {
      'Bestseller': 'bg-yellow-500',
      'Popular': 'bg-blue-500',
      'Trending': 'bg-green-500',
      'New': 'bg-teal-500',
      'Premium': 'bg-purple-500',
      'Featured': 'bg-orange-500'
    };
    return colors[badge] || 'bg-gray-500';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-indigo-100 dark:bg-indigo-900/30 px-4 py-2 rounded-full mb-4">
          <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">
            Premium Tech Book Collection
          </span>
        </div>
        <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
          Level Up Your <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Tech Skills</span>
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Curated collection of the best programming books to accelerate your learning journey
        </p>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {PRODUCTS.map((product) => (
          <div
            key={product.id}
            className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-indigo-500 transform hover:-translate-y-2"
          >
            {/* Product Header with Gradient */}
            <div className={`bg-gradient-to-r ${product.gradient} p-6 relative`}>
              <div className={`absolute top-4 right-4 ${getBadgeColor(product.badge)} text-white text-xs font-bold px-3 py-1 rounded-full`}>
                {product.badge}
              </div>
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl inline-block mb-3">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{product.name}</h3>
              
              {/* Rating */}
              <div className="flex items-center gap-2 text-white/90">
                <div className="flex items-center">
                  <Star className="w-4 h-4 fill-yellow-300 text-yellow-300" />
                  <span className="ml-1 font-semibold">{product.rating}</span>
                </div>
                <span className="text-white/70 text-sm">({product.reviews} reviews)</span>
              </div>
            </div>

            {/* Product Content */}
            <div className="p-6">
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                {product.description}
              </p>

              {/* Features */}
              <ul className="space-y-2 mb-6">
                {product.features.slice(0, 3).map((feature, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Price Section */}
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-gray-900 dark:text-white">
                      ${product.price}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                      ${product.originalPrice}
                    </span>
                  </div>
                  <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                    Save ${(product.originalPrice - product.price).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Buy Button */}
              <button
                onClick={() => handlePayment(product)}
                disabled={isProcessing && selectedProduct?.id === product.id}
                className={`w-full bg-gradient-to-r ${product.gradient} hover:opacity-90 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform hover:scale-105`}
              >
                {isProcessing && selectedProduct?.id === product.id ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5" />
                    Buy Now
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Payment Result Modal */}
      {paymentResult && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-8 transform animate-in zoom-in duration-300">
            <div className="text-center">
              {paymentResult.status === 'SUCCESS' ? (
                <>
                  <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Payment Successful!
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {paymentResult.message}
                  </p>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Purchase Details:</p>
                    <p className="font-semibold text-gray-900 dark:text-white mb-1">{paymentResult.productName}</p>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">${paymentResult.amount}</p>
                    {paymentResult.order_id && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 font-mono">
                        Order ID: {paymentResult.order_id}
                      </p>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <XCircle className="w-12 h-12 text-red-600 dark:text-red-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Payment Failed
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    {paymentResult.message}
                  </p>
                </>
              )}
              
              <button
                onClick={() => setPaymentResult(null)}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 text-white font-semibold py-3 rounded-lg transition-all duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Info Section */}
      <div className="mt-12 text-center">
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl p-8 border border-indigo-200 dark:border-indigo-800">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            💳 Simulated Payment System
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            This is a demo payment system. Minimum amount of $49.99 required for successful transactions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Product;
