const ApplicationLogo = props => (
    <svg
        viewBox="0 0 64 64"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
        className="w-10 h-10"
    >
        <rect width="100%" height="100%" rx="10" fill="#0f172a" />
        {/* Candlestick Bars */}
        <rect x="14" y="26" width="4" height="20" fill="#22c55e" />
        <rect x="24" y="18" width="4" height="28" fill="#22c55e" />
        <rect x="34" y="32" width="4" height="14" fill="#ef4444" />
        <rect x="44" y="22" width="4" height="24" fill="#22c55e" />

        {/* Upward Arrow */}
        <path
            d="M16 48 L32 32 L40 40 L56 20"
            stroke="#3b82f6"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M56 20 L56 30 L46 30"
            stroke="#3b82f6"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
        />
    </svg>
)

export default ApplicationLogo
