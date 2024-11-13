import React, { useState } from 'react';
import Navbar from './Navbar';
import auctionData from '../data/AuctionData';

const HomePage = ({ userRole, handleLogout }) => {
  const [selectedAuction, setSelectedAuction] = useState(null);

  const handleSelectAuction = (item) => {
    setSelectedAuction(item);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Navbar */}
      <Navbar userRole={userRole} handleLogout={handleLogout} />

      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-10 tracking-tight">
          Featured Auctions
        </h2>

        {!selectedAuction ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {auctionData.slice(0, 6).map((item) => (
              <AuctionCard
                key={item.id}
                item={item}
                onSelect={() => handleSelectAuction(item)}
              />
            ))}
          </div>
        ) : (
          <AuctionDetail auction={selectedAuction} onBack={() => setSelectedAuction(null)} />
        )}
      </div>
    </div>
  );
};

const AuctionCard = ({ item, onSelect }) => (
  <div
    className="bg-white border border-gray-200 shadow-md rounded-lg overflow-hidden group cursor-pointer transition hover:shadow-lg"
    onClick={onSelect}
  >
    <img
      src={item.images[0]}
      alt={item.title}
      className="w-full h-56 object-cover"
    />
    <div className="p-5">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
      <p className="text-sm text-gray-700">{item.shortDescription}</p>
      <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition">
        View Auction
      </button>
    </div>
  </div>
);

const AuctionDetail = ({ auction, onBack }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === auction.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? auction.images.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden max-w-3xl mx-auto mt-8 p-8 border border-gray-200">
      <button onClick={onBack} className="text-blue-600 text-sm font-medium mb-4 hover:underline">
        &lt; Back to Auctions
      </button>
      <div className="relative mb-6">
        {/* Carousel for selected auction */}
        <div className="flex overflow-hidden relative">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
          >
            {auction.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={auction.title}
                className="w-full h-80 object-cover rounded-md"
              />
            ))}
          </div>
        </div>
        
        {/* Carousel navigation buttons */}
        <button
          onClick={handlePrevImage}
          className="absolute top-1/2 left-3 transform -translate-y-1/2 bg-gray-800 text-white p-3 rounded-full hover:bg-gray-700 transition"
        >
          &lt;
        </button>
        <button
          onClick={handleNextImage}
          className="absolute top-1/2 right-3 transform -translate-y-1/2 bg-gray-800 text-white p-3 rounded-full hover:bg-gray-700 transition"
        >
          &gt;
        </button>

        {/* Image indicators */}
        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {auction.images.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full ${
                currentImageIndex === index ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            ></div>
          ))}
        </div>
      </div>
      
      <div className="text-gray-900">
        <h3 className="text-2xl font-bold mb-2">{auction.title}</h3>
        <p className="text-gray-700 mb-6">{auction.shortDescription}</p>
        <div className="flex justify-between items-center mt-4 border-t border-gray-200 pt-4">
          <p className="text-lg font-semibold">Current Bid: ${auction.currentBid}</p>
          <p className="text-gray-500 text-sm">Auction ends: {auction.endDate}</p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
