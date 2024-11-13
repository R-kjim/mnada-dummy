import React from 'react';

const ClientDashboard = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-semibold">Client Dashboard</h1>
      <div className="mt-6">
        <h2 className="text-2xl font-medium">Active Auctions</h2>
        <div className="mt-4">
          <ul>
            <li>
              <div className="bg-gray-100 p-4 rounded">
                <h3 className="text-lg font-medium">Auction 1</h3>
                <p>Start Date: 2024-11-01</p>
                <button className="bg-green-600 text-white p-2 rounded mt-2">
                  Place Bid
                </button>
              </div>
            </li>
            <li>
              <div className="bg-gray-100 p-4 rounded">
                <h3 className="text-lg font-medium">Auction 2</h3>
                <p>Start Date: 2024-11-05</p>
                <button className="bg-green-600 text-white p-2 rounded mt-2">
                  Place Bid
                </button>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
