import { Clock, TrendingUp, Wallet } from 'lucide-react' // or replace with your own icons

export default function FeatureSection() {
  return (
    <section className="py-16 bg-white text-center px-4">
      <div className="max-w-5xl mx-auto">
        {/* Heading */}
        <h2 className="text-2xl sm:text-4xl font-bold text-[#0a0a35] mb-4">
          Powerful Features to Grow Your Business
        </h2>
        <p className="text-sm sm:text-base text-gray-500 mb-12 max-w-3xl mx-auto">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </p>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-center">
          {/* Feature 1 */}
          <div className="border border-blue-100 rounded-xl p-6 text-left shadow-sm">
            <div className="bg-blue-600 text-white w-10 h-10 flex items-center justify-center rounded-tl-xl mb-4">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-lg text-[#0a0a35] mb-2">
              Boosts Productivity
            </h3>
            <p className="text-sm text-gray-500">
              Lorem ipsum dolor sit amet consectetur adipiscing elit dolore sedar eiusmod tempor incididunt labore et dolor.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="border border-blue-100 rounded-xl p-6 text-left shadow-sm">
            <div className="bg-blue-600 text-white w-10 h-10 flex items-center justify-center rounded-tl-xl mb-4">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-lg text-[#0a0a35] mb-2">
              Increase Lead Conversion
            </h3>
            <p className="text-sm text-gray-500">
              Lorem ipsum dolor sit amet consectetur adipiscing elit dolore sedar eiusmod tempor incididunt labore et dolor.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="border border-blue-100 rounded-xl p-6 text-left shadow-sm">
            <div className="bg-blue-600 text-white w-10 h-10 flex items-center justify-center rounded-tl-xl mb-4">
              <Wallet className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-lg text-[#0a0a35] mb-2">
              Reduce Marketing Costs
            </h3>
            <p className="text-sm text-gray-500">
              Lorem ipsum dolor sit amet consectetur adipiscing elit dolore sedar eiusmod tempor incididunt labore et dolor.
            </p>
          </div>
        </div>

        {/* CTA Button */}
        <div className="mt-12">
          <button className="bg-green-500 hover:bg-green-600 text-white font-medium text-sm px-6 py-2 rounded-full shadow transition">
            Explore More Features
          </button>
        </div>
      </div>
    </section>
  )
}
