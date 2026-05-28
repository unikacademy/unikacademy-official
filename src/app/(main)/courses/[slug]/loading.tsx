export default function CourseLoading() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] animate-pulse">
      <div className="bg-[#0e2b49] pb-20 pt-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-4 w-48 bg-white/10 rounded mb-8" />
          <div className="flex gap-2 mb-5">
            <div className="h-6 w-24 bg-white/10 rounded-full" />
            <div className="h-6 w-20 bg-white/10 rounded-full" />
          </div>
          <div className="h-12 w-3/4 bg-white/10 rounded-xl mb-3" />
          <div className="h-5 w-1/2 bg-white/10 rounded mb-8" />
          <div className="flex items-center gap-3 mb-8">
            <div className="w-9 h-9 rounded-full bg-white/10" />
            <div className="h-4 w-56 bg-white/10 rounded" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white/8 border border-white/10 rounded-xl px-4 py-3 h-16" />
            ))}
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-20">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-[#E2E8F0] p-8 h-48" />
            ))}
          </div>
          <div className="w-full lg:w-[300px] xl:w-[320px]">
            <div className="bg-white rounded-2xl border border-[#E2E8F0] h-80" />
          </div>
        </div>
      </div>
    </div>
  );
}
