function LoadingDots() {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex gap-1">
        <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></span>
        <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></span>
        <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></span>
      </div>
      <span className="text-xs text-stone-400">Réflexion...</span>
    </div>
  )
}

export default LoadingDots
