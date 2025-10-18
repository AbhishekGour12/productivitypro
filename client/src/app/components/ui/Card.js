const Card = ({ children, className = '', hover = false }) => {
  return (
    <div className={`
            bg-white rounded-2xl shadow-sm border border-gray-200 
            transition-all duration-300
            ${hover ? 'hover:shadow-lg hover:border-gray-300 hover:transform hover:-translate-y-1' : ''}
            ${className}
        `}>
      {children}
    </div>
  );
};

export default Card;