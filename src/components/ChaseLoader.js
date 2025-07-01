const ChaseLoader = ({ message = "Loading..." }) => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white">
      <div className="relative w-10 h-10" style={{ animation: 'spin 2s linear infinite' }}>
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute top-0 left-0 w-full h-full"
            style={{
              transform: `rotate(${i * 60}deg)`,
            }}
          >
            <div
              className="w-[25%] h-[25%] rounded-full bg-[#22c55e] mx-auto"
              style={{
                animation: `sk-chase-dot-before 2s infinite ease-in-out both`,
                animationDelay: `-${1.1 - i * 0.1}s`,
              }}
            />
          </div>
        ))}
      </div>
      <p className="mt-4 text-sm text-[#22c55e]">{message}</p>
    </div>
  );
};

export default ChaseLoader;
