import React from "react";
import Navbar from "../components/Navbar";
import ProductList from "../components/ProductList";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-green-50">
      <Navbar />

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            {/* Decorative Ayurvedic Elements */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-1 bg-amber-600 rounded-full"></div>
              <div className="w-4 h-4 bg-green-600 rounded-full mx-4 mt-2"></div>
              <div className="w-20 h-1 bg-amber-600 rounded-full"></div>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Welcome to{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-700 to-green-700">
                Clariveda
              </span>
            </h1>

            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
              Embrace the ancient wisdom of Ayurveda for modern skincare.
              Discover pure, natural solutions for radiant, healthy skin.
            </p>

            {/* Ayurvedic Quote */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 max-w-lg mx-auto border border-amber-200 shadow-sm">
              <div className="flex items-center justify-center mb-3">
                <svg
                  className="w-6 h-6 text-amber-500 mr-2"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z" />
                </svg>
                <p className="text-sm text-amber-800 italic font-medium">
                  "When diet is wrong, medicine is of no use. When diet is
                  correct, medicine is of no need."
                </p>
              </div>
              <p className="text-xs text-gray-500">- Ayurvedic Proverb</p>
            </div>
          </div>
        </div>

        {/* Background Decorative Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-amber-200 rounded-full opacity-20 blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-24 h-24 bg-green-200 rounded-full opacity-20 blur-xl"></div>
        <div className="absolute top-1/3 right-1/4 w-16 h-16 bg-amber-300 rounded-full opacity-15 blur-lg"></div>
      </div>

      {/* Benefits Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 text-center border border-amber-100 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-6 h-6 text-amber-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">100% Natural</h3>
            <p className="text-sm text-gray-600">
              Pure herbal ingredients sourced from nature
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 text-center border border-green-100 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 11l5-5m0 0l5 5m-5-5v12m0 0a9 9 0 01-9-9 9 9 0 019-9 9 9 0 019 9 9 9 0 01-9 9z"
                />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Ancient Wisdom</h3>
            <p className="text-sm text-gray-600">
              Time-tested Ayurvedic formulations
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 text-center border border-amber-100 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-6 h-6 text-amber-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Skin Loving</h3>
            <p className="text-sm text-gray-600">
              Nourishes and rejuvenates your skin
            </p>
          </div>
        </div>

        {/* Products Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-amber-100 overflow-hidden">
          <div className="bg-gradient-to-r from-amber-500 to-green-600 p-6">
            <h2 className="text-2xl font-bold text-white text-center">
              Our Ayurvedic Collection
            </h2>
            <p className="text-amber-100 text-center mt-2">
              Pure herbal face cleansers for radiant skin
            </p>
          </div>
          <div className="p-6">
            <ProductList />
          </div>
        </div>

        {/* Ayurvedic Principles */}
        <div className="mt-12 text-center">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Based on Ancient Ayurvedic Principles
          </h3>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
            <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full">
              Balance Doshas
            </span>
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">
              Natural Ingredients
            </span>
            <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full">
              Holistic Healing
            </span>
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">
              Chemical Free
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
