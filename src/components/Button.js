const Button = ({type = 'submit', className = '', loading = false, children, ...props}) => (
  <button
    type={type}
    disabled={loading || props.disabled}
    className={`
      ${className}
      inline-flex items-center justify-center
      disabled:opacity-50 transition ease-in-out duration-150
    `}
    {...props}
    >
    {children}
    {loading && (
      <span className="flex space-x-1 mr-2">
        <span className="w-1 h-1 bg-white rounded-full animate-bounce [animation-delay:-0.3s]" />
        <span className="w-1 h-1 bg-white rounded-full animate-bounce [animation-delay:-0.15s]" />
        <span className="w-1 h-1 bg-white rounded-full animate-bounce" />
      </span>
    )}
  </button>
)

export default Button
