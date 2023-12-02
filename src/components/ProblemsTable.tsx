"use client"
// Library imports
import Link from 'next/link';
import { useState } from 'react';
import { BsCheckCircle } from 'react-icons/bs';
import { AiFillYoutube } from 'react-icons/ai';
import { IoClose } from 'react-icons/io5';
import YouTube from 'react-youtube';
// Custom imports
import EscapeHandler from "@/app/hooks/useEscape";
import { DBProblem } from "@/types";

type ProblemsTableProps = {
    problems : DBProblem[];
    correctProblemIDs: Set<string>;
};

const ProblemsTable:React.FC<ProblemsTableProps> = ({problems, correctProblemIDs}) => { 
    const [youTubePlayer, setYouTubePlayer] = useState({
        isOpen: false,
        videoId: ''
    });

    /**
     * Closes the YouTube Video Modal
     */
    const closeModal = () => {
        setYouTubePlayer({ isOpen: false, videoId: ''});
    }

    /**
     * Closes the YouTube Video Modal when the user presses the ESC key
     */
    EscapeHandler(closeModal);

    return (
      <>
        <tbody className='text-white'>
          {problems.map((problem, index) => {
            /** The color of the difficulty based on its value */
            const difficultyColor = problem.difficulty === 'Easy'   ? "text-dark-green-s" :
                                    problem.difficulty === 'Medium' ? "text-dark-yellow"  : "text-dark-pink";
            
            return (
              // For odd index use 'bg-dark-layer-1', otherwise make the background transparent
              <tr className={`${index % 2 == 1 ? 'bg-dark-layer-1' : ''}`}
                  key={problem.problem_id}
              >
                <th className="px-2 py-4 font-medium whitespace-nowrap text-dark-green-s">
                  { correctProblemIDs.has(problem.problem_id) && 
                    <BsCheckCircle fontSize={'18'} width={'18'} />
                  }
                </th>
                <td className="px-6 py-4">
                  <Link className="hover:text-blue-600 cursor-pointer"
                          href={problem.link ? problem.link : `/problems/${problem.problem_id}`}
                          target= {problem.link ? "_blank" : ""} // Open a new tab on the browser if externa link
                  >
                    {problem.order + '. ' + problem.title}
                  </Link>
                </td>
                <td className={`px-6 py-4 ${difficultyColor}`}>
                  {problem.difficulty}
                </td>
                <td className="px-6 py-4">
                  {problem.category}
                </td>
                <td className="px-6 py-4">
                  {problem.videoId ? (
                    <AiFillYoutube fontSize={'28'}
                                   className="cursor-pointer hover:text-red-600"
                                   onClick = {() => setYouTubePlayer({ isOpen: true, videoId: problem.videoId!})}
                    />
                  ) : (
                    <p className="text-gray-400">Coming soon</p>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>

        {/* Show the YouTube only if youYubePlayer.isOpen is 'true' */}            
        {youTubePlayer.isOpen && (
          <tfoot className="fixed top-0 left-0 h-screen w-screen flex items-center justify-center">
            <tr className="bg-black z-10 opacity-70 top-0 left-0 w-screen h-screen absolute"
                onClick={closeModal}
            >
            </tr>
            <tr className="w-full z-50 h-full px-6 max-w-4xl flex items-center justify-center relative">
              <td className="w-full relative">
                <IoClose fontSize={'35'}
                         className="cursor-pointer absolute -top-16 right-0"
                         onClick={closeModal}
                />
                <YouTube videoId={youTubePlayer.videoId}
                         loading="lazy"
                         iframeClassName="w-full min-h-[500px]"
                />
              </td>
            </tr>
          </tfoot>
        )}
        </>       
    );
}
export default ProblemsTable;