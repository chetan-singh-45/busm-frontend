export default function TableSkeleton() {
  return (
    <div className="animate-pulse space-y-4 p-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-6 bg-gray-300 rounded w-full"></div>
      ))}
    </div>
  );
}

