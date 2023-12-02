// Useful link:
// https://flowbite.com/docs/components/skeleton/

/**
 * @returns a skeleton form to display while the page is loading
 */
export const SkeletonProblem = () => {
  return (
    <div role="status" className="space-y-6 animate-pulse w-full mt-6">
      <div className="flex items-center w-full space-x-4">
        <div className="h-8 bg-gray-200 rounded-full dark:bg-gray-700 w-32"/>
        <div className="h-8 bg-gray-200 rounded-full dark:bg-gray-700 w-80"/>
        <div className="h-8 bg-gray-300 rounded-full dark:bg-gray-600 w-64"/>
        <div className="h-8 bg-gray-300 rounded-full dark:bg-gray-600 w-full"/>
      </div>
      <div className="flex items-center w-full space-x-4">
      <div className="h-8 bg-gray-300 rounded-full dark:bg-gray-600 w-96"/>
      <div className="h-8 bg-gray-300 rounded-full dark:bg-gray-600 w-48"/>
        <div className="h-8 bg-gray-200 rounded-full dark:bg-gray-700 w-full"/>
        <div className="h-8 bg-gray-300 rounded-full dark:bg-gray-600 w-full"/>
      </div>
      <div className="flex items-center w-full space-x-4">
        <div className="h-8 bg-gray-300 rounded-full dark:bg-gray-600 w-full"/>
        <div className="h-8 bg-gray-200 rounded-full dark:bg-gray-700 w-80"/>
        <div className="h-8 bg-gray-300 rounded-full dark:bg-gray-600 w-full"/>
      </div>
      <div className="flex items-center w-full space-x-4">
      <div className="h-8 bg-gray-300 rounded-full dark:bg-gray-600 w-80"/>
        <div className="h-8 bg-gray-200 rounded-full dark:bg-gray-700 w-full"/>
        <div className="h-8 bg-gray-300 rounded-full dark:bg-gray-600 w-32"/>
        <div className="h-8 bg-gray-300 rounded-full dark:bg-gray-600 w-96"/>
      </div>
      <div className="flex items-center w-full space-x-4">
        <div className="h-8 bg-gray-300 rounded-full dark:bg-gray-600 w-32"/>
        <div className="h-8 bg-gray-300 rounded-full dark:bg-gray-600 w-24"/>
        <div className="h-8 bg-gray-200 rounded-full dark:bg-gray-700 w-full"/>
      </div>
      <div className="flex items-center w-full space-x-4">
        <div className="h-8 bg-gray-300 rounded-full dark:bg-gray-600 w-full"/>
        <div className="h-8 bg-gray-200 rounded-full dark:bg-gray-700 w-80"/>
        <div className="h-8 bg-gray-300 rounded-full dark:bg-gray-600 w-full"/>
      </div>
      <div className="flex items-center w-full space-x-4">
        <div className="h-8 bg-gray-300 rounded-full dark:bg-gray-600 w-32"/>
        <div className="h-8 bg-gray-200 rounded-full dark:bg-gray-700 w-full"/>
        <div className="h-8 bg-gray-300 rounded-full dark:bg-gray-600 w-64"/>
      </div>
      <div className="flex items-center w-full space-x-4">
        <div className="h-8 bg-gray-200 rounded-full dark:bg-gray-700 w-full"/>
        <div className="h-8 bg-gray-300 rounded-full dark:bg-gray-600 w-48"/>
        <div className="h-8 bg-gray-200 rounded-full dark:bg-gray-700 w-full"/>
        <div className="h-8 bg-gray-300 rounded-full dark:bg-gray-600 w-32"/>
      </div>
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
        <div className="max-w-[1200px] mx-auto sm:w-7/12 w-full animate-pulse sm:pt-24">
          <SkeletonProblem />
        </div>
      </main>
    );
}
export default loading;