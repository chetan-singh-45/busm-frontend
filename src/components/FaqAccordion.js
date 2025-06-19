'use client'
import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

const faqData = [
  {
    question: 'What is TrendNotifier?',
    answer:
      'TrendNotifier is an online alert system that notifies users about technical analysis events (like SMA crossovers) on European stock market indices. We help traders and investors stay informed — quickly and reliably — but we are not a trading platform and do not give investment advice.',
  },
  {
    question: 'Is TrendNotifier a trading platform or broker?',
    answer:
      'No. We do not offer trading or brokerage services. Our platform is purely informational. We do not execute trades, and we do not recommend specific investments.',
  },
  {
    question: 'What kind of technical signals can I get alerts for?',
    answer:
      'Currently, we support alerts for:SMA (Simple Moving Average) crossovers (e.g. SMA 200)',
  },
  {
    question: 'Does Trendnotifier Offer a Free Trial or Demo?',
    answer:
      'Yes, Trendnotifier offers a free trial and live demo sessions to help you evaluate its features.',
  },
]

const FaqAccordion = () => {
  const [openIndex, setOpenIndex] = useState(0)

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
  <>
    <section className="bg-white py-8 px-4">
      
      <div className="mt-12 space-y-4 max-w-3xl mx-auto">
        {faqData.map((item, index) => {
          const isOpen = openIndex === index
          return (
            <div
              key={index}
              className={`rounded-2xl transition-all duration-300 overflow-hidden ${
                isOpen ? 'bg-[#f3f4ff] shadow-md' : 'bg-white border border-gray-200'

              }`}
            >
              <button
                className="w-full text-left px-6 py-5 flex justify-between items-center text-lg font-semibold text-[#0a0a35]"
                onClick={() => toggle(index)}
              >
                <span>{item.question}</span>
                {isOpen ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </button>
              {isOpen && (
                <div className="px-6 pb-6 text-sm text-[#5f5f7d] leading-relaxed">
                  {item.answer}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </section>
  </>
  )
}

export default FaqAccordion
