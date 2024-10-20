import React from 'react';

const Alert = ({ type, message }) => {
  const baseStyle = "p-4 rounded-md flex items-center";
  
  const typeStyles = {
    success: "bg-green-100 text-green-700 border-green-500",
    error: "bg-red-100 text-red-700 border-red-500",
    warning: "bg-yellow-100 text-yellow-700 border-yellow-500",
    info: "bg-blue-100 text-blue-700 border-blue-500",
  };

  return (
    <div className={`${baseStyle} ${typeStyles[type]} border-l-4`}>
      <span className="flex-grow">{message}</span>
    </div>
  );
};

export default Alert;