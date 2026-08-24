import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import {
  FaLeaf,
  FaTruck,
  FaMoneyBillWave,
  FaHeadset,
  FaArrowRight,
  FaStar,
  FaCheckCircle,
  FaShieldAlt,
} from "react-icons/fa";

const LandingPage = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
      <div>
        <Navbar />

        <section className="bg-emerald-700 text-white py-12 px-4 sm:px-6">
          <div className="max-w-5xl mx-auto text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-8">
            <div className="max-w-xl">
              <span className="inline-block bg-emerald-800 text-emerald-100 text-xs font-semibold px-3 py-1 rounded-full mb-3">
                Authentic Indian Ayurvedic Care
              </span>
              <h1 className="text-3xl sm:text-4xl font-bold leading-tight mb-3">
                Welcome to Clariveda Online Store
              </h1>
              <p className="text-emerald-100 text-sm sm:text-base leading-relaxed mb-6">
                Buy genuine herbal and natural skincare products online at affordable rates. Made using traditional Ayurvedic ingredients with no harmful chemicals or artificial colours.
              </p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                <Link
                  to="/dashboard"
                  className="bg-white text-emerald-800 hover:bg-emerald-50 font-bold px-5 py-2.5 rounded-md text-sm shadow transition inline-flex items-center gap-2"
                >
                  <span>Shop All Products</span>
                  <FaArrowRight size={12} />
                </Link>
                {!user && (
                  <Link
                    to="/register"
                    className="bg-emerald-800 hover:bg-emerald-900 text-white font-semibold px-5 py-2.5 rounded-md text-sm border border-emerald-600 transition"
                  >
                    Create Free Account
                  </Link>
                )}
              </div>
            </div>

            <div className="bg-white text-gray-800 p-5 rounded-lg border border-emerald-600 max-w-xs shadow-md">
              <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-100">
                <FaLeaf className="text-emerald-600 text-lg" />
                <span className="font-bold text-sm text-gray-900">Today's Special Offer</span>
              </div>
              <p className="text-xs text-gray-600 mb-3">
                Free home delivery on all orders across India! Cash on Delivery and Online Payment both available.
              </p>
              <Link
                to="/dashboard"
                className="block text-center text-xs font-semibold bg-emerald-600 text-white py-2 rounded hover:bg-emerald-700"
              >
                Browse Catalog
              </Link>
            </div>
          </div>
        </section>

        <section className="bg-white border-b border-gray-200 py-6 px-4 sm:px-6">
          <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-start gap-3 p-3 bg-gray-50 border border-gray-200 rounded-md">
              <FaLeaf className="text-emerald-600 text-xl mt-1 flex-shrink-0" />
              <div>
                <h2 className="text-xs font-bold text-gray-900">100% Herbal</h2>
                <p className="text-[11px] text-gray-500">Pure botanical extracts without parabens</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-gray-50 border border-gray-200 rounded-md">
              <FaTruck className="text-emerald-600 text-xl mt-1 flex-shrink-0" />
              <div>
                <h2 className="text-xs font-bold text-gray-900">All India Delivery</h2>
                <p className="text-[11px] text-gray-500">Quick dispatch to all pincodes</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-gray-50 border border-gray-200 rounded-md">
              <FaMoneyBillWave className="text-emerald-600 text-xl mt-1 flex-shrink-0" />
              <div>
                <h2 className="text-xs font-bold text-gray-900">COD Available</h2>
                <p className="text-[11px] text-gray-500">Pay cash upon parcel delivery</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-gray-50 border border-gray-200 rounded-md">
              <FaHeadset className="text-emerald-600 text-xl mt-1 flex-shrink-0" />
              <div>
                <h2 className="text-xs font-bold text-gray-900">Help & Support</h2>
                <p className="text-[11px] text-gray-500">Call / Email support (9 AM - 6 PM)</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-10 px-4 sm:px-6 max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Our Main Product Categories</h2>
            <p className="text-xs text-gray-500 mt-1">
              Select category to view herbal formulations and daily essentials
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white border border-gray-200 rounded-lg p-4 text-center hover:border-emerald-500 transition shadow-sm">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto mb-3 font-bold text-lg">
                🧴
              </div>
              <h3 className="text-sm font-bold text-gray-900 mb-1">Face Cleansers</h3>
              <p className="text-xs text-gray-500 mb-3">Neem, turmeric, and aloe gentle daily face washes.</p>
              <Link to="/dashboard" className="text-xs font-semibold text-emerald-600 hover:underline">
                View Cleansers →
              </Link>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4 text-center hover:border-emerald-500 transition shadow-sm">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto mb-3 font-bold text-lg">
                ✨
              </div>
              <h3 className="text-sm font-bold text-gray-900 mb-1">Ayurvedic Oils</h3>
              <p className="text-xs text-gray-500 mb-3">Kumkumadi tailam, bhringraj, and almond hair oils.</p>
              <Link to="/dashboard" className="text-xs font-semibold text-emerald-600 hover:underline">
                View Oils →
              </Link>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4 text-center hover:border-emerald-500 transition shadow-sm">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto mb-3 font-bold text-lg">
                🌿
              </div>
              <h3 className="text-sm font-bold text-gray-900 mb-1">Herbal Serums</h3>
              <p className="text-xs text-gray-500 mb-3">Natural face serums for glowing and soft skin.</p>
              <Link to="/dashboard" className="text-xs font-semibold text-emerald-600 hover:underline">
                View Serums →
              </Link>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4 text-center hover:border-emerald-500 transition shadow-sm">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto mb-3 font-bold text-lg">
                🧼
              </div>
              <h3 className="text-sm font-bold text-gray-900 mb-1">Daily Creams</h3>
              <p className="text-xs text-gray-500 mb-3">Saffron and sandalwood day & night skin creams.</p>
              <Link to="/dashboard" className="text-xs font-semibold text-emerald-600 hover:underline">
                View Creams →
              </Link>
            </div>
          </div>

          <div className="text-center mt-8">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-6 py-2.5 rounded-md shadow-sm transition"
            >
              <span>Explore All Products in Store</span>
              <FaArrowRight size={11} />
            </Link>
          </div>
        </section>

        <section className="bg-white border-y border-gray-200 py-10 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">About Clariveda</h2>
              <p className="text-xs text-gray-500 mt-0.5">Simple story behind our initiative</p>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-xs text-gray-700 space-y-3 leading-relaxed">
              <p>
                Clariveda was started with a simple vision — to provide genuine, chemical-free Ayurvedic skincare products at student-friendly and affordable prices.
              </p>
              <p>
                Most modern cosmetics in the market contain heavy preservatives and synthetic perfumes that harm sensitive skin over time. We focus on trusted Indian herbs like Tulsi, Neem, Sandalwood, Saffron, and Manjistha to prepare safe daily personal care items.
              </p>
              <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="flex items-center gap-2 font-medium text-emerald-800">
                  <FaCheckCircle className="text-emerald-600" />
                  <span>No Artificial Preservatives</span>
                </div>
                <div className="flex items-center gap-2 font-medium text-emerald-800">
                  <FaCheckCircle className="text-emerald-600" />
                  <span>Direct Farm Sourced Herbs</span>
                </div>
                <div className="flex items-center gap-2 font-medium text-emerald-800">
                  <FaCheckCircle className="text-emerald-600" />
                  <span>Honest Student Pricing</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-10 px-4 sm:px-6 max-w-5xl mx-auto">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Customer Feedback</h2>
            <p className="text-xs text-gray-500 mt-0.5">What our buyers say about their purchase</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <div className="flex items-center gap-1 text-amber-500 text-xs mb-2">
                <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
              </div>
              <p className="text-xs text-gray-600 mb-3 italic">
                "The neem face wash is very effective. It cleared my acne without drying the skin. Very good packaging and fast delivery."
              </p>
              <div>
                <p className="text-xs font-bold text-gray-900">Rahul Sharma</p>
                <p className="text-[10px] text-gray-400">Pune, Maharashtra</p>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <div className="flex items-center gap-1 text-amber-500 text-xs mb-2">
                <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
              </div>
              <p className="text-xs text-gray-600 mb-3 italic">
                "Ordered kumkumadi oil. Genuine quality and pleasant natural herbal aroma. COD option made ordering very easy."
              </p>
              <div>
                <p className="text-xs font-bold text-gray-900">Priya Patel</p>
                <p className="text-[10px] text-gray-400">Ahmedabad, Gujarat</p>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <div className="flex items-center gap-1 text-amber-500 text-xs mb-2">
                <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
              </div>
              <p className="text-xs text-gray-600 mb-3 italic">
                "Budget friendly prices compared to other big brands. Products arrived in 3 days in safe bubble wrap."
              </p>
              <div>
                <p className="text-xs font-bold text-gray-900">Amit Kumar</p>
                <p className="text-[10px] text-gray-400">New Delhi</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <footer className="bg-white border-t border-gray-200 py-8 px-4 sm:px-6 text-xs text-gray-600">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded bg-emerald-600 flex items-center justify-center text-white text-xs">
                <FaLeaf size={12} />
              </div>
              <span className="font-bold text-gray-900 text-sm">Clariveda Store</span>
            </div>
            <p className="text-gray-500 leading-relaxed">
              Your trusted online destination for pure Ayurvedic personal care and wellness products.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 mb-2">Quick Navigation</h3>
            <ul className="space-y-1">
              <li><Link to="/dashboard" className="text-emerald-600 hover:underline">All Products</Link></li>
              <li><Link to="/myOrders" className="text-emerald-600 hover:underline">Track My Orders</Link></li>
              <li><Link to="/cart" className="text-emerald-600 hover:underline">Shopping Cart</Link></li>
              <li><Link to="/login" className="text-emerald-600 hover:underline">Account Login</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 mb-2">Contact & Support</h3>
            <p className="text-gray-500">Email: support@clariveda.com</p>
            <p className="text-gray-500">Customer Helpline: +91 98765 43210</p>
            <p className="text-gray-500">Operating Hours: Mon - Sat (9:00 AM to 6:00 PM)</p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto pt-4 border-t border-gray-100 text-center text-gray-400 text-[11px]">
          © {new Date().getFullYear()} Clariveda Ayurvedic Store. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
