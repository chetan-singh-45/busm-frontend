'use client'
import { UserCog, BarChart3 } from 'lucide-react'
import { useState } from 'react'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    optIn: false,
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  return (
    <section className="relative overflow-hidden bg-white text-white py-6">
      <div className="w-full px-2 md:px-4 py-8 mx-auto relative z-10">
        <div className="relative overflow-hidden rounded-t-[3rem] bg-[#0a0a35] pb-15">

          {/* Floating Icons */}
          <UserCog
            size={48}
          className="absolute left-[2%] bottom-[12rem] text-green-400 opacity-80 z-20"
          />
          <BarChart3
            size={48}
            className="absolute top-8 right-8 text-green-400 opacity-80"
          />

          {/* Main Content */}
          <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center px-8 py-16">

            {/* Left Form */}
            <div className="bg-[#f3f4ff] text-[#0a0a35] p-8 rounded-2xl w-full max-w-md mx-auto shadow-xl">
              <h2 className="text-2xl font-bold mb-2">Contact Us</h2>
              <p className="text-sm mb-6">
                Sign up for exclusive deals and offers. We promise you no spam, ever.
              </p>

              <form className="space-y-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  className="w-full px-4 py-3 rounded-md border text-sm bg-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0a0a35]"
                  value={formData.name}
                  onChange={handleChange}
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  className="w-full px-4 py-3 rounded-md border text-sm bg-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0a0a35]"
                  value={formData.email}
                  onChange={handleChange}
                />
                <input
                  type="tel"
                  name="mobile"
                  placeholder="Mobile Address"
                  className="w-full px-4 py-3 rounded-md border text-sm bg-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0a0a35]"
                  value={formData.mobile}
                  onChange={handleChange}
                />

                <label className="flex items-start text-xs text-gray-700">
                  <input
                    type="checkbox"
                    name="optIn"
                    checked={formData.optIn}
                    onChange={handleChange}
                    className="mt-1 mr-2"
                  />
                  Opt in to receive SMS Notifications, Alerts & Occasional Marketing Communication.
                </label>

                <button
                  type="submit"
                  className="bg-green-500 hover:bg-green-600 text-white text-sm font-medium py-3 px-6 rounded-full w-full transition"
                >
                  Subscribe
                </button>
              </form>
            </div>

            {/* Right Text Section */}
            <div className="text-left text-white space-y-6">
              <h3 className="text-3xl font-semibold leading-tight">
                Unlock The Benefits of Smarter Marketing
              </h3>
              <p className="text-sm text-gray-300 max-w-md">
                On the other hand, we denounce with righteous indignation and dislike men
                who are so beguiled and demoralized by the charms of pleasure of the
                moment, so blinded by desire, that they cannot foresee the pain and trouble
                that are bound to ensue
              </p>
            </div>

          </div>

          {/* Curved Bottom SVG */}
          <svg
            className="absolute bottom-0 left-0 w-full h-[150px]"
            viewBox="0 0 1440 120"
            preserveAspectRatio="none"
          >
            <path
              d="M0,50 C480,0 960,0 1440,50 L1440,120 L0,120"
              fill="#ffffff"
            />
          </svg>
        </div>
      </div>
    </section>
  )
}

export default Contact
