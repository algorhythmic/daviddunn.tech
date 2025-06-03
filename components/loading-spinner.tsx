export function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-neo-yellow-light dark:bg-slate-900 flex items-center justify-center">
      <div className="text-center">
        <div className="bg-white dark:bg-slate-800 border-8 border-black dark:border-neo-blue-500 p-12 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] dark:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] pulse-neo">
          <div className="w-16 h-16 border-8 border-black dark:border-neo-blue-500 border-t-neo-blue-500 dark:border-t-white rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-3xl font-black text-black dark:text-white mb-4 dark:neo-text-glow">LOADING...</h2>
          <p className="font-bold text-black dark:text-white">Preparing your data experience</p>
        </div>
      </div>
    </div>
  )
}
