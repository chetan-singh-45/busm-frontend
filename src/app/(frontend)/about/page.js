'use client'

import CommanCurvedSection from "@/components/CommanCurvedSection"
import TrustedCompanies from "@/components/TrustedCompanies";

const About = () => {
  return (
    <>
      <CommanCurvedSection
        title="Welcome to TrendNotifier Your Dedicated Partner in Market Awareness."
        subtitle="We are not a trading platform and don't offer investment advice. We are an intelligent, high-speed alert system built to support traders and investors who rely on technical analysis."
      />

      <TrustedCompanies />

      <section className="bg-white py-20 px-4 sm:px-8">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Mission Card */}
          <div className="rounded-xl border border-blue-100 bg-gray-50 p-6 shadow-sm">
            <h3 className="text-2xl font-semibold text-[#0a0a35] mb-4">Our Mission</h3>
            <p className="text-sm font-semibold mb-2 text-[#0a0a35]">
              At TrendNotifier, our mission is simple:
            </p>
            <p className="text-gray-700 mb-4">
              Empower technical traders and market watchers with fast, accurate, and actionable notifications
              based on key technical events across European stock indices.
            </p>
            <p className="text-gray-700">
              We believe in helping traders make better, faster decisions, not by telling them what to trade,
              but by giving them timely information in the format they prefer.
            </p>
          </div>

          {/* Vision Card */}
          <div className="rounded-xl border border-blue-100 bg-gray-50 p-6 shadow-sm">
            <h3 className="text-2xl font-semibold text-[#0a0a35] mb-4">Our Vision</h3>
            <p className="text-gray-700 mb-4">
              Our long-term vision is to become the go-to notification engine for traders across Europe who use technical analysis —
              whether they’re day traders, swing traders, or long-term investors.
            </p>
            <p className="text-gray-700">
              We're committed to keeping things simple, accurate, and fast.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-gray-100 px-4 py-20 sm:px-8 space-y-24">
        {/* Card 1 - Image Left */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-10">
          <img
            src="/team.jpg"
            alt="Who We Are"
            className="rounded-xl shadow-md w-full h-auto object-cover"
          />
          <div>
            <h3 className="text-3xl font-semibold text-[#0a0a35] mb-4">Who We Are</h3>
            <p className="font-semibold text-[#0a0a35] mb-2">
              We are a European-based digital solution built by:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>
                Highly skilled software developers with experience in building real-time data tools,
                scalable APIs, and alert systems.
              </li>
              <li>
                Well-classified trading specialists who understand the real needs and behaviours of
                active traders and investors.
              </li>
            </ul>
            <p className="text-gray-700 mt-4">
              This powerful combination of tech expertise and trading experience allows us to build a
              tool that speaks your language and meets your speed.
            </p>
          </div>
        </div>

        {/* Card 2 - Image Right */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-10">
          <div>
            <h3 className="text-3xl font-semibold text-[#0a0a35] mb-4">What We Do</h3>
            <p className="text-[#6b7280] mb-4">
              TrendNotifier delivers real-time or scheduled notifications based on clear technical
              analysis tools such as SMA crossovers, with more indicators and models as we grow.
            </p>
            <p className="text-[#0a0a35] font-semibold">We support traders by offering:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mt-2">
              <li>Custom alerts with flexible triggers</li>
              <li>Clean dashboards and mobile-ready tools</li>
              <li>Reliable, scalable backend infrastructure</li>
            </ul>
          </div>
          <img
            src="/team.jpg"
            alt="What We Do"
            className="rounded-xl shadow-md w-full h-auto object-cover"
          />
        </div>
      </section>

      <section className="bg-white py-24 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-semibold text-[#0a0a35] mb-16">
            Why Traders Trust Us
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Card 1 */}
            <div className="bg-[#0a0a35] text-white p-6 rounded-3xl shadow-md text-left">
              <div className="mb-4">
                <img src="/favicon.ico" alt="Speed icon" className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Speed</h3>
              <p className="text-sm text-gray-300">
                Fast technical condition monitoring and near-instant notifications
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-[#0a0a35] text-white p-6 rounded-3xl shadow-md text-left">
              <div className="mb-4">
                <img src="/favicon.ico" alt="Clarity icon" className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Clarity</h3>
              <p className="text-sm text-gray-300">
                Clean interface, focused tools, no distractions
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-[#0a0a35] text-white p-6 rounded-3xl shadow-md text-left">
              <div className="mb-4">
                <img src="/favicon.ico" alt="Transparency icon" className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Transparency</h3>
              <p className="text-sm text-gray-300">
                No hidden advice, no product pushing — just information
              </p>
            </div>

            {/* Card 4 */}
            <div className="bg-[#0a0a35] text-white p-6 rounded-3xl shadow-md text-left">
              <div className="mb-4">
                <img src="/favicon.ico" alt="Growth icon" className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Growth</h3>
              <p className="text-sm text-gray-300">
                We’re continuously evolving, building new tools to support technical analysis strategies
              </p>
            </div>
          </div>
        </div>
      </section>

    </>

  )
}

export default About