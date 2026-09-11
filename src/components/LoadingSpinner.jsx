const LoadingSpinnerCircle = () => {
  return (
    <div
      className="w-8 h-8 bg-current rounded-full animate-spinner-grow text-slate-200 opacity-0 scale-0"
      role="status"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};
const LoadingSpinner = () => {
  return (
    <div className="flex justify-center mt-4 gap-2 delay-500 animate-delayed-entrance">
      <LoadingSpinnerCircle />
      <LoadingSpinnerCircle />
      <LoadingSpinnerCircle />
    </div>
  );
};

export default LoadingSpinner;
