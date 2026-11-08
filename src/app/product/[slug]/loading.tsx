export default function ProductLoading() {
  return (
    <div className="bg-white">
      {/* Breadcrumb Skeleton */}
      <div className="border-b border-cream-200 bg-cream-50/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center gap-2">
          <div className="w-12 h-3.5 bg-cream-200 rounded motion-safe:animate-pulse" />
          <div className="w-2 h-3.5 bg-cream-200 rounded" />
          <div className="w-24 h-3.5 bg-cream-200 rounded motion-safe:animate-pulse" />
          <div className="w-2 h-3.5 bg-cream-200 rounded" />
          <div className="w-36 h-3.5 bg-cream-200 rounded motion-safe:animate-pulse" />
        </div>
      </div>

      {/* Two Column Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* Gallery Skeleton */}
          <div className="lg:col-span-7 flex flex-col-reverse lg:flex-row gap-4">
            <div className="flex lg:flex-col gap-3 shrink-0">
              <div className="w-20 h-26 sm:w-24 sm:h-32 bg-cream-100 border border-cream-200 rounded-sm motion-safe:animate-pulse" />
              <div className="w-20 h-26 sm:w-24 sm:h-32 bg-cream-100 border border-cream-200 rounded-sm motion-safe:animate-pulse" />
            </div>
            <div className="flex-1 aspect-3/4 bg-cream-100 border border-cream-200 rounded-sm motion-safe:animate-pulse" />
          </div>

          {/* Panel Skeleton */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-2">
              <div className="w-28 h-3.5 bg-cream-200 rounded motion-safe:animate-pulse" />
              <div className="w-3/4 h-8 bg-cream-200 rounded motion-safe:animate-pulse" />
              <div className="w-full h-4 bg-cream-100 rounded motion-safe:animate-pulse" />
            </div>

            <div className="py-4 border-y border-cream-200">
              <div className="w-32 h-8 bg-cream-200 rounded motion-safe:animate-pulse" />
            </div>

            <div className="space-y-2">
              <div className="w-20 h-3 bg-cream-200 rounded motion-safe:animate-pulse" />
              <div className="flex gap-2">
                <div className="w-8 h-8 rounded-full bg-cream-200 motion-safe:animate-pulse" />
                <div className="w-8 h-8 rounded-full bg-cream-200 motion-safe:animate-pulse" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="w-16 h-3 bg-cream-200 rounded motion-safe:animate-pulse" />
              <div className="grid grid-cols-5 gap-2">
                <div className="h-10 bg-cream-100 border border-cream-200 rounded-sm motion-safe:animate-pulse" />
                <div className="h-10 bg-cream-100 border border-cream-200 rounded-sm motion-safe:animate-pulse" />
                <div className="h-10 bg-cream-100 border border-cream-200 rounded-sm motion-safe:animate-pulse" />
                <div className="h-10 bg-cream-100 border border-cream-200 rounded-sm motion-safe:animate-pulse" />
                <div className="h-10 bg-cream-100 border border-cream-200 rounded-sm motion-safe:animate-pulse" />
              </div>
            </div>

            <div className="h-12 bg-cream-200 rounded-sm motion-safe:animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
