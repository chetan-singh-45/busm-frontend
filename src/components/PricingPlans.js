'use client'
import React from 'react'

const plans = [
  {
    name: 'Starting Plan',
    price: '$29',
    features: [
      '1 User Account',
      'Basic CRM integration',
      'Analytics & Performance Tracking',
      'Live Chat & Chatbot support',
      'A/B Testing & Campaign',
    ],
  },
  {
    name: 'Professional Plan',
    price: '$79',
    features: [
      '1 User Account',
      'Basic CRM integration',
      'Analytics & Performance Tracking',
      'Live Chat & Chatbot support',
      'A/B Testing & Campaign',
    ],
    mostPopular: true,
  },
  {
    name: 'Enterprise Plan',
    price: '$159',
    features: [
      '1 User Account',
      'Basic CRM integration',
      'Analytics & Performance Tracking',
      'Live Chat & Chatbot support',
      'A/B Testing & Campaign',
    ],
  },
]

const PricingPlans = () => {
  return (
    <section className="bg-[#f6f7ff] py-8 w-full">
      <div className="text-center mb-12 px-4">
        <h2 className="text-4xl font-bold text-[#0a0a35]">
          Choose The Perfect Plan for Your Business
        </h2>
        <p className="text-gray-500 mt-2">
          Find the right plan that fits your marketing and sales needs. Whether you're just starting or scaling your business, Saazy has a solution for you.
        </p>
      </div>

      <div className="flex flex-col md:flex-row justify-center items-center gap-6 px-4">
        {plans.map((plan, index) => (
          <div
            key={index}
            className={`
              relative bg-white rounded-2xl border border-gray-200 p-8 w-full max-w-sm text-center
                transition-all duration-300 transform hover:scale-105
                hover:border-blue-500 hover:shadow-[0_8px_30px_rgba(0,119,255,0.12)]
            `}
          >
            {plan.mostPopular && (
              <div className="absolute top-0 right-0 mt-2 mr-2 bg-blue-100 text-blue-600 text-xs font-semibold px-2 py-1 rounded-md">
                Most Popular
              </div>
            )}
            <h3 className="text-xl font-semibold text-[#0a0a35]">{plan.name}</h3>
            <p className="text-gray-500 mt-2 mb-6">
              Perfect for startups looking to automate their workflow at an affordable cost.
            </p>
            <div className="text-3xl font-bold text-[#0a0a35] mb-2">
              {plan.price}<span className="text-base font-normal">/Month</span>
            </div>
            <button className="bg-green-600 text-white rounded-full px-6 py-2 mt-4 hover:bg-green-700 transition">
              Get Started
            </button>

            <ul className="mt-6 text-sm text-left space-y-3 text-[#0a0a35]">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-start space-x-2">
                  <span className="text-blue-600">✔</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}

export default PricingPlans
