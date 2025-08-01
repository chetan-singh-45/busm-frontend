'use client'
import FaqAccordion from "@/components/FaqAccordion"
import HeadingSection from "@/components/HeadingSection"
import Image from "next/image"
import ComingSoon from '@/components/ComingSoon';

const FAQ = () => {
  return (
  <>
   <ComingSoon />
      {/* <HeadingSection
              title="Frequently Asked Questions (FAQ)"
              description=""
            />
      <FaqAccordion />
       <div className="bg-[#f3f3f3] rounded-[2rem] px-6 py-8 md:px-10 md:py-10 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-10 max-w-4xl mx-auto mt-10"> */}
      {/* Image */}
      {/* <div className="flex-shrink-0">
        <Image
          src='/team.jpg'
          alt="Contact Icon"
          width={160}
          height={160}
          className="w-[120px] md:w-[160px] h-auto"
        />
      </div> */}

      {/* Text */}
      {/* <div className="text-center md:text-left">
        <p className="text-[#0a0a35] text-base md:text-2xl font-medium">
          You can visit our Contact Us page or
          <br />
          email us directly at <br />
          <a
            href="mailto:support@trendnotifier.com"
            className="text-green-500 hover:underline"
          >
            support@trendnotifier.com
          </a>
        </p>
      </div>
    </div> */}
  </>
  )
}

export default FAQ