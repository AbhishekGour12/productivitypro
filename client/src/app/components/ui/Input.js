const Input = ({ type = 'text', placeholder, value, onChange, name, icon: Icon, className = '', error, ...props }) => {
    return (
        <div className="relative">
            {Icon && (
                <div className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${error ? 'text-red-500' : 'text-gray-400'}`}>
                    <Icon className="text-lg" />
                </div>
            )}
            <input
                type={type}
                name={name}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className={`
                    w-full p-3 border rounded-lg 
                    focus:ring-2 focus:border-transparent 
                    outline-none transition-all duration-200
                    placeholder-gray-400
                    ${Icon ? 'pl-10' : 'pl-3'}
                    ${error 
                        ? 'border-red-500 focus:ring-red-200' 
                        : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'
                    }
                    ${className}
                `}
                {...props}
            />
        </div>
    );
};

export default Input;