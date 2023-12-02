"use client";
// Library imports
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BsList } from 'react-icons/bs';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
// Custom imports
import LogoutButton from "@/components/topbar/LogoutButton";
import Timer from "@/components/topbar/Timer";
import { DBUser } from "@/types";

type TopbarProps = {
    user: DBUser | null;
    // The following two arguments must be omitted unless we are in a problem page
    // (i.e., problems/[problemID]/page.tsx)
    prevProblemID?: string | null; // The problem id of the previous problem or null if this is the first
    nextProblemID?: string | null; // The problem id of the next problem or null if this is the last
};

/**
 * - If the user is is {@code null} it means that the user is not logged in.
 * - If the user is omitted (i.e., {@code undefined}) it means that the user is
 *   logged in and the user info is beeing retrieved.
 * - If currUser has any other value it means that the user is logged in and the
 *   user info is already retrieved.
 */
const Topbar:React.FC<TopbarProps> = ({user, prevProblemID, nextProblemID}) => {
    const isProblemPage = prevProblemID || nextProblemID;
    const router = useRouter();

    /**
     * Navigates to the page of the given problem ID.
     * 
     * @param problemID The ID of the problem to navigate to
     */
    function navigateToProblem(problemID: string) {
        router.push('/problems/' + problemID);
    }

    return (
      <nav className="relative flex h-[50px] w-full shrink-0 items-center px-5 bg-dark-layer-1 text-dark-gray-7">
        <div className={`flex w-full items-center justify-between ${isProblemPage ? '' : 'max-w-[1200px] mx-auto'}`}>
          <Link href="/" className="h-[42px] flex-1">
            <Image src="/images/logo-large.png" alt="CodeBuddy" height={170} width={170} />
          </Link>
          
          {isProblemPage && ( // Only for problem pages (i.e., problems/[problemID]/page.tsx
            <div className="flex items-center gap-4 flex-1 justify-center">
              {prevProblemID &&
                <div className="flex items-center justify-center rounded bg-dark-fill-3 hover:bg-dark-fill-2 h-8 w-8 cursor-pointer"
                     onClick={() => navigateToProblem(prevProblemID)}
                >
                  <FaChevronLeft />
                </div>
              }
              {!prevProblemID && // Add this so that the BsList stays at the same position if there is no previous problem
                <div className="flex items-center justify-center rounded bg-dark-layer-1 h-8 w-8 " />
              }
              <Link href="/" className="flex items-center gap-2 font-medium max-w-[170px] text-dark-gray-8 cursor-pointer">
                <div>
                  <BsList />
                </div>
                <p>Problem List</p>
              </Link>
              {nextProblemID &&
                <div className="flex items-center justify-center rounded bg-dark-fill-3 hover:bg-dark-fill-2 h-8 w-8 cursor-pointer"
                     onClick={() => navigateToProblem(nextProblemID)}
                     //onClick={() => router.push('/problems/' + nextProblemID)}
                >
                  <FaChevronRight />
                </div>
              }
              {!nextProblemID && // Add this so that the BsList stays at the same position if there is no next problem
                <div className="flex items-center justify-center rounded bg-dark-layer-1 h-8 w-8 " />
              }
            </div>
          )}
          
          <div className="flex items-center space-x-4 flex-1 justify-end">
            {
              !user && ( // The user is not logged in
              <div>
                <Link href="/auth">
                  <button className="bg-dark-fill-3 py-1 px-2 cursor-pointer rounded">
                    Sign In
                  </button>
                </Link>
              </div>
              )
            } 
            
            { // --- P R O F I L E   I M A G E --- //
              user && ( // The user is logged in
                <div className="cursor-pointer group relative">
                  <Image src="/images/user.png"
                         width={100}
                         height={100}
                         alt="Profile image"
                         className="h-8 w-8 roudned full"
                  />
                  { /* on hover change the scale from 0% (invisible) to 100% */}
                  <div className="absolute top-10 left-2/4 -translate-x-2/4  mx-auto bg-dark-layer-1 text-white
                                  p-2 rounded shadow-lg z-40 group-hover:scale-100 scale-0
                                  transition-all duration-300 ease-in-out"
                  >
                    <p className="text-sm text-center">{user.name}</p>
                  </div>
                </div>
              )
            }

            { // --- T I M E R --- //
              user && isProblemPage && <Timer />
            }

            { // --- L O G O U T   B U T T O N --- //
              user && <LogoutButton />
            }
          </div>
        </div>
      </nav>
    );
};
export default Topbar;

