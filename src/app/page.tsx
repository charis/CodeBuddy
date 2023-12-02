// Library imports
import Image from 'next/image';
// Custom imports
import Topbar from "@/components/topbar/Topbar";
import ProblemsTable from "@/components/ProblemsTable";
import { getSessionUser } from "@/util/ServerActions"
import { getProblems } from "@/util/DBUtils";

export default async function Home() {
  // Retrieve the user who is currently logged in
  const currUser = await getSessionUser(true);
  // Retrieve the problems
  const dbProblems = await getProblems();

  // Find the IDs of the problems that the student has solved correctly
  let correctProblemIDs: Set<string> = new Set<string>();
  if (currUser) {
      for (const attemptedProblem of currUser.attemptedProblems) {
          if (attemptedProblem.correct) {
              correctProblemIDs.add(attemptedProblem.problem_id);
          }
      }
  }


  return (
    <main className="bg-dark-layer-2 min-h-screen">
      <Topbar user={currUser} />
      { currUser? (
        <>
          <h1 className="text-2xl text-center text-gray-300 dark:text-gray-400 font-medium uppercase mt-10 mb-5">
            PROGRAMMING CHALLENGES
          </h1>
          <div className="relative overflow-x-auto mx-auto px-6 pb-10">
            <table className="text-sm text-left text-gray-500 dark:text-gray-400 sm:w-7/12 w-full max-w-[1200px] mx-auto">
              <thead className="text-xs text-gray-300 uppercase dark:text-gray-400 border-b ">
                <tr>
                  <th scope='col' className='px-1 py-3 w-0 font-medium'>
                    Status
                  </th>
                  <th scope='col' className='px-6 py-3 w-0 font-medium'>
                    Title
                  </th>
                  <th scope='col' className='px-6 py-3 w-0 font-medium'>
                    Difficulty
                  </th>
                  <th scope='col' className='px-6 py-3 w-0 font-medium'>
                    Category
                  </th>
                  <th scope='col' className='px-6 py-3 w-0 font-medium'>
                    Tutorial
                  </th>
                </tr>
              </thead>
              <ProblemsTable problems={dbProblems} correctProblemIDs={correctProblemIDs} />
            </table>
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center h-[calc(100vh-5rem)] pointer-events-none select-none">
          <Image src="/images/banner.png"
                 alt="Banner image"
                 height={700}
                 width={700}
          />
        </div>
      )}
    </main>
  )
}