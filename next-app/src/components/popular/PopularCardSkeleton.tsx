export default function PopularCardSkeleton() {
  return (
    <div className="flex flex-col justify-between w-full h-[125px] px-1 md:px-2 animate-pulse">
      <div className="rounded-xl p-5 bg-white  ">
        <div className="space-y-3">
          <div className="flex gap-2 -ml-1">
            <div className="w-12 h-4 bg-gray-200 rounded-full" />
            <div className="w-12 h-4 bg-gray-200 rounded-full" />
          </div>
          <div className="bg-gray-200 w-36 h-4 rounded-full" />
        </div>
        <div className="flex justify-end mt-7 gap-2 text-sm">
          <div className="bg-gray-100 w-6 h-4 rounded-full" />
          <div className="bg-gray-100 w-6 h-4 rounded-full" />
        </div>
      </div>
    </div>
  );
}
