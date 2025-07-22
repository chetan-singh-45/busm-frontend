export default function CardSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="animate-pulse bg-white rounded-2xl shadow-md p-4 space-y-4">
          <div className="h-4 w-1/3 bg-gray-300 rounded" />
          <div className="h-6 w-2/3 bg-gray-200 rounded" />
          <div className="h-4 w-1/4 bg-gray-300 rounded" />
        </div>
      ))}
    </div>
  );
}
