import Image from 'next/image'

export default function TrustedCompanies() {
  return (
    <section className="py-8 bg-white text-center">
      <h3 className="text-lg sm:text-xl font-medium text-[#0a0a35] mb-8">
        Trusted by the world’s best companies
      </h3>

      <div className="flex justify-center items-center flex-wrap gap-8 sm:gap-12 px-4 max-w-5xl mx-auto">
        {/* Company logos with names */}
        {['FocalPoint','Greenish','ProNature','Automation','Sitemark','Luminous',].map((company, index) => (
          <div
            key={index}
            className={`flex items-center gap-2 font-bold text-xl transition-colors duration-200 ${
              company ?   'text-gray-400 hover:text-black' : 'text-black'
            }`}
          >
            <Image src="/favicon.ico" alt={company} width={24} height={24} />
            <span>{company}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
