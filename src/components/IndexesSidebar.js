'use client'

export default function IndexesSidebar({ selectedRegion, onSelectRegion }) {
  const regions = ['Europe', 'North America', 'Asia', 'Other']

  return (
    <aside className="w-full sm:w-64 px-4 sm:px-0">
      <div className="sticky top-6">
        <h2 className="font-semibold text-lg mb-4">Continent & Country</h2>
        <p className="text-sm font-medium mb-3 text-gray-500">Select Region</p>
        <div className="space-y-2">
          {regions.map((region) => (
            <div key={region} className="flex items-center gap-2">
              <input
                type="checkbox"
                id={region}
                checked={selectedRegion === region}
                onChange={() =>
                  onSelectRegion(selectedRegion === region ? null : region)
                }
                className="h-4 w-4 border-gray-300 rounded text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor={region} className="text-sm text-gray-700 cursor-pointer">
                {region}
              </label>
            </div>
          ))}
        </div>
      </div>
    </aside>
  )
}
