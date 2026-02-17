export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center p-12">
      <div className="relative">
        <div className="w-10 h-10 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600" />
      </div>
      <span className="ml-3 text-sm text-gray-500">Caricamento...</span>
    </div>
  );
}
