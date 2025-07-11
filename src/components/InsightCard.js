const InsightCard = ({ title, icon, value, subtitle, content }) => (
  <div className="bg-white text-white p-6 rounded-xl shadow-md hover:shadow-lg transition-transform duration-300 transform hover:scale-105 flex flex-col">
    <div className="flex justify-between items-center">
      <span className="text-sm font-medium text-gray-500">{title}</span>
      <div className="p-2">{icon}</div>
    </div>
    {value !== undefined && (
      <>
        <p className="text-2xl font-bold text-[#11193C] mt-3">{value}</p>
        {subtitle && <span className="text-xs text-gray-400 mt-1">{subtitle}</span>}
      </>
    )}
    {content}
  </div>
)

export default InsightCard