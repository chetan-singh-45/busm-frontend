import React from "react";

const BrandSection = () => {
  return (
    <section className="bg-white py-16 px-4 text-center">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
        Boosting Your Brand to New Heights Online.
      </h2>
      <p className="text-gray-500 max-w-2xl mx-auto mb-12">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
      </p>

      <div className="flex flex-col md:flex-row justify-center gap-8">
        {/* Campaign Performance Card */}
        <div className="bg-gray-50 rounded-2xl shadow-md p-6 w-full max-w-md">
          <div className="flex justify-between items-center mb-4 text-sm text-gray-500">
            <span className="font-semibold text-gray-700">Campaign Performance</span>
          </div>
          {/* Chart Image */}
          <img
            src="/team.jpg"
            alt="Campaign Performance Chart"
            className="rounded-lg w-full"
          />
        </div>

        {/* Sales Overview Card */}
        <div className="bg-gray-50 rounded-2xl shadow-md p-6 w-full max-w-md">
          <div className="flex justify-between items-center mb-4 text-sm text-gray-500">
            <span className="font-semibold text-gray-700">Sales Overview</span>
          </div>
          <div className="flex justify-between text-left text-sm text-gray-700 mb-4">
          <img
            src="/team.jpg"
            alt="Sales Overview Chart"
            className="rounded-lg w-full"
          />
          </div>
        </div>
        
      </div>
    </section>
  );
};

export default BrandSection;
