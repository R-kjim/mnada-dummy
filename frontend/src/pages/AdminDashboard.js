import React, { useState } from 'react';

const AdminDashboard = () => {
  const [pendingItems, setPendingItems] = useState([]); // List of pending items
  const [approvedItems, setApprovedItems] = useState([]); // List of approved items

  // Approve an item
  const approveItem = (item) => {
    setApprovedItems([...approvedItems, item]);
    setPendingItems(pendingItems.filter((i) => i.id !== item.id)); // Remove item from pending
  };

  // Reject an item
  const rejectItem = (item) => {
    setPendingItems(pendingItems.filter((i) => i.id !== item.id)); // Remove item from pending
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-semibold">Admin Dashboard</h1>
      
      {/* System Overview Section */}
      <div className="mt-6">
        <h2 className="text-2xl font-medium">System Overview</h2>
        <div className="grid grid-cols-3 gap-6 mt-4">
          <div className="bg-blue-100 p-4 rounded">
            <h3 className="font-semibold">Total Users</h3>
            <p>100</p>
          </div>
          <div className="bg-blue-100 p-4 rounded">
            <h3 className="font-semibold">Active Auctions</h3>
            <p>5</p>
          </div>
          <div className="bg-blue-100 p-4 rounded">
            <h3 className="font-semibold">Total Bids</h3>
            <p>350</p>
          </div>
        </div>
      </div>

      {/* Auction Approval Section */}
      <h2 className="text-2xl font-medium mt-6">Pending Auctions</h2>
      <div className="mt-4">
        {pendingItems.length === 0 ? (
          <p>No pending auctions.</p>
        ) : (
          <ul>
            {pendingItems.map((item) => (
              <li key={item.id} className="border p-4 mb-4">
                <h4 className="font-bold">{item.name}</h4>
                <p>{item.description}</p>
                <button onClick={() => approveItem(item)} className="bg-green-600 text-white p-2 rounded mr-2">
                  Approve
                </button>
                <button onClick={() => rejectItem(item)} className="bg-red-600 text-white p-2 rounded">
                  Reject
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Approved Auctions Section */}
      <h2 className="text-2xl font-medium mt-6">Approved Auctions</h2>
      <div className="mt-4">
        {approvedItems.length === 0 ? (
          <p>No approved auctions.</p>
        ) : (
          <ul>
            {approvedItems.map((item) => (
              <li key={item.id} className="border p-4 mb-4">
                <h4 className="font-bold">{item.name}</h4>
                <p>{item.description}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
