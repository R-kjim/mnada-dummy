import React from 'react';

const AuctionList = () => {
  // Sample data for items
  const auctions = [
    { id: 1, item: 'Laptop', startingPrice: '$500' },
    { id: 2, item: 'Phone', startingPrice: '$300' },
    { id: 3, item: 'Car', startingPrice: '$5000' },
  ];

  return (
    <>
      {auctions.map(auction => (
        <div key={auction.id} className="bg-white p-4 shadow rounded">
          <h3 className="text-lg font-semibold">{auction.item}</h3>
          <p className="text-gray-600">Starting Price: {auction.startingPrice}</p>
        </div>
      ))}
    </>
  );
};

export default AuctionList;
