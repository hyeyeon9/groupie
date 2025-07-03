export default function StudyCardSkeleton() {
  return (
    <div className="group bg-white rounded shadow-sm border border-gray-200 p-6  min-h-[245px]">
      <div className="space-y-4">
        <div className="flex items-start gap-5">
          <div className="w-20 h-5 bg-gray-200 rounded"></div>
          <div className="w-16 h-5 bg-gray-200 rounded"></div>
        </div>

        <div className="space-y-2">
          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-100 rounded w-full"></div>
        </div>

        <div className="flex items-center gap-3 text-xs text-gray-500">
          <div className="h-4 w-20 bg-gray-200 rounded"></div>
          <div className="h-4 w-8 bg-gray-100 rounded"></div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-200"></div>
            <div className="h-4 w-16 bg-gray-100 rounded"></div>
          </div>
          <div className="h-4 w-10 bg-gray-100 rounded"></div>
        </div>
      </div>
    </div>
  );
}
