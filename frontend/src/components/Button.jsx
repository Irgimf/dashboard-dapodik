export default function Button({
  children,
  onClick,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  icon = null,
  className = "",
}) {
  const base = `
    inline-flex items-center justify-center gap-2 font-medium
    rounded-xl transition-all duration-200 active:scale-95
    disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100
    select-none
  `;

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2.5 text-sm",
    lg: "px-5 py-3 text-base",
  };

  const variants = {
    primary: `
      bg-gradient-to-br from-blue-600 to-indigo-600
      hover:from-blue-500 hover:to-indigo-500
      text-white shadow-md shadow-blue-200
      hover:shadow-lg hover:shadow-blue-300
      hover:-translate-y-0.5
    `,
    success: `
      bg-gradient-to-br from-emerald-500 to-green-600
      hover:from-emerald-400 hover:to-green-500
      text-white shadow-md shadow-green-200
      hover:shadow-lg hover:shadow-green-300
      hover:-translate-y-0.5
    `,
    danger: `
      bg-gradient-to-br from-red-500 to-rose-600
      hover:from-red-400 hover:to-rose-500
      text-white shadow-md shadow-red-200
      hover:shadow-lg hover:shadow-red-300
      hover:-translate-y-0.5
    `,
    warning: `
      bg-gradient-to-br from-amber-400 to-orange-500
      hover:from-amber-300 hover:to-orange-400
      text-white shadow-md shadow-amber-200
      hover:shadow-lg hover:shadow-amber-300
      hover:-translate-y-0.5
    `,
    ghost: `
      bg-white hover:bg-gray-50
      text-gray-700 border border-gray-200
      hover:border-gray-300 shadow-sm
      hover:shadow-md hover:-translate-y-0.5
    `,
    info: `
      bg-gradient-to-br from-cyan-500 to-blue-500
      hover:from-cyan-400 hover:to-blue-400
      text-white shadow-md shadow-cyan-200
      hover:shadow-lg hover:shadow-cyan-300
      hover:-translate-y-0.5
    `,
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
    >
      {loading ? (
        <>
          <svg
            className="w-4 h-4 animate-spin shrink-0"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8z"
            />
          </svg>
          <span>Memproses...</span>
        </>
      ) : (
        <>
          {icon && <span className="shrink-0">{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
}
