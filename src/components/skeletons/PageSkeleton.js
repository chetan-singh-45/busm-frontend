export default function PageSkeleton() {
  return (
    <div className="animate-pulse p-6 max-w-7xl mx-auto space-y-4">
      <div className="h-6 bg-gray-200 rounded w-1/3"></div>
      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-28 bg-gray-200 rounded-lg"></div>
        ))}
      </div>
    </div>
  );
}