// Useful link:
// https://flowbite.com/docs/components/skeleton/

/**
 * @returns a skeleton row to display while the page is loading
 */
const SkeletonRow = () => {
  return (
    <div className="flex items-center space-x-10 mt-6 px-6">
      <div className="w-6 h-6 shrink-0 rounded-full bg-gray-400"></div>
      <div className="h-6 sm:w-42 w-32 rounded-full bg-gray-400"></div>
      <div className="h-6 sm:w-42 w-32 rounded-full bg-gray-400"></div>
      <div className="h-6 sm:w-42 w-32 rounded-full bg-gray-400"></div>
      <div className="h-6 sm:w-42 w-32 rounded-full bg-gray-400"></div>
      <span className="sr-only">Loading...</span>
    </div>
  );
}

/**
 * @returns the UI to display while the page is loading.
 */
const loading = () => {
    return (
      <main className="bg-dark-layer-2 min-h-screen">
        <div className="relative overflow-x-auto mx-auto px-6 pb-10">
          <div className="max-w-[1200px] mx-auto sm:w-7/12 w-full animate-pulse mt-20">
            <div className="flex justify-center">
              <div className="h-8 rounded-full bg-gray-400 mb-6 px-6 w-80"/>
            </div>
            {Array.from({ length: 10 }).map((_, index) => (
              // Show 10 rows (one for each problem that is loading)
              <SkeletonRow key={index} />
            ))}
          </div>
        </div>
      </main>
    );
}
export default loading;

