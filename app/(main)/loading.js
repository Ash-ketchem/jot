export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <div className="w-full h-full justify-around items-center flex flex-col ">
      {Array(4)
        .fill(0)
        .map((e) => (
          <div className=" shadow rounded-md p-4 max-w-sm w-full mx-auto">
            <div className="animate-pulse flex space-x-4">
              <div className="rounded-full bg-accent/20 h-10 w-10"></div>
              <div className="flex-1 space-y-6 py-1">
                <div className="h-2 bg-accent/20 rounded"></div>
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="h-2 bg-accent/20 rounded col-span-2"></div>
                    <div className="h-2 bg-accent/20 rounded col-span-1"></div>
                  </div>
                  <div className="h-2 bg-accent/20 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}
