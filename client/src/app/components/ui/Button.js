const Button = ({
    children,
    onClick,
    className = '',
    type = 'button',
    isLoading = false,
    disabled = false,
    variant = 'primary'
}) => {
    const baseStyles = 'inline-flex items-center justify-center font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none';

    const variants = {
        primary: 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white focus:ring-blue-200',
        secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-200',
        danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-200',
        success: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-200',
        warning: 'bg-yellow-600 hover:bg-yellow-700 text-white focus:ring-yellow-200'
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || isLoading}
            className={`
                ${baseStyles}
                ${variants[variant]}
                ${className}
            `}
        >
            {isLoading ? (
                <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading...
                </>
            ) : (
                children
            )}
        </button>
    );
};

export default Button;