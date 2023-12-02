"use client";
// Library imports
import Split from 'react-split';
import Confetti from 'react-confetti';
import { useState } from 'react';
// Custom imports
import Sidebar from "@/components/workspace/Sidebar";
import Playground from "@/components/workspace/Playground";
import useHasMounted from "@/app/hooks/useHasMounted";
import useWindowSize from '@/app/hooks/useWindowSize';
import loading from "@/app/problems/[problemID]/loading";
import { DBAttemptedProblem, DBProblem, DBUser, LocalProblem } from "@/types";

type WorkspaceProps = {
    user: DBUser | null;
    localProblem: LocalProblem;
    dbProblem: DBProblem | null;
    rapidApiKey: string | null;
};

const Workspace:React.FC<WorkspaceProps> = ({user,
                                             localProblem,
                                             dbProblem,
                                             rapidApiKey}) => {
    /** Keep track if the page has mounted */
    const hasMounted = useHasMounted();
    // We need the screen size to throw the confetti
    const windowSize = useWindowSize();
    // Flag to throw the confetti
    const [confetti, setConfetti] = useState<boolean>(false);
    // Used to show immediately the checkmark (w/o refresh) when the user solves the problem
    const [correct, setCorrect] = useState<boolean>(false);
    

    /**
     * The saved attemted problem if the user had attempted to solve it
     * in the past or {@code null} otherwise
     */
    const savedAttemptedProblem: DBAttemptedProblem | null = (function() {
        if (user?.attemptedProblems) {
            for (const problem of user.attemptedProblems) {
                if (problem.problem_id === dbProblem?.problem_id) {
                    return problem;
                }
            }
        }
        return null;
    })();

    // If the page has not been mounted show the skeleton page (same as loading)
    if (!hasMounted) {
        return (
            loading()
        );
    }

    return (
      <Split className="split" minSize={0}>
        {/* Left side of the split: Problem description */}
        <Sidebar localProblem={localProblem}
                 dbProblem={dbProblem}
                 isCorrect={savedAttemptedProblem?.correct || correct}/>
            
        <div className="bg-dark-fill-2">
          {/* Right side of the split: Code editor */}
          <Playground user={user}
                      localProblem={localProblem}
                      savedCode={savedAttemptedProblem?.code ?? null}
                      rapidApiKey={rapidApiKey}
                      setConfetti={setConfetti}
                      setCorrect={setCorrect} />
          {confetti && <Confetti gravity={0.3}
                                 tweenDuration={4000} // New confetti every 4 seconds
                                 width={windowSize.width - 1}
                                 height={windowSize.height - 1}
                       />
          }
        </div>
      </Split>
    );
}
export default Workspace;