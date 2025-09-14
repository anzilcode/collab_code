const ResizeHandle = ({ direction, onMouseDown, isDarkMode }) => {
  return (
    <div 
      className={`w-1 cursor-col-resize ${isDarkMode ? 'bg-gray-700 hover:bg-blue-500' : 'bg-gray-300 hover:bg-blue-500'} transition-colors`}
      onMouseDown={() => onMouseDown(direction)}
    />
  );
};

export default ResizeHandle