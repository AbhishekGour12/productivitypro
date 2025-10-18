const Select = ({ name, value, onChange, children, className = '', ...props }) => {
    return (
        <select
            name={name}
            value={value}
            onChange={onChange}
            className={`
                w-full p-3 border border-gray-300 rounded-lg 
                focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                outline-none transition-colors duration-200
                bg-white
                ${className}
            `}
            {...props}
        >
            {children}
        </select>
    );
};

export default Select;