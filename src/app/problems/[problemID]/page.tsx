// Custom imports
import Topbar from "@/components/topbar/Topbar";
import Workspace from '@/components/workspace/Workspace';
import ProblemLookup from "@/local-data/problems/ProblemLookup";
import { getProblem, getProblemByOrder } from "@/util/DBUtils";
import { getRadidApiKey, getSessionUser } from "@/util/ServerActions";

// Note: 'npm run build' shows an info message:
// 'Error getting the server session: Error: Dynamic server usage: headers'
// which is caused by 'const currUser = await getSessionUser(true);
// Although the functionality is not affected, to avoid this error info,
// we use  the folliwng line:
export const dynamic = 'force-dynamic';

type ProblemPageProps = {  
    params: {
        problemID: string
    }
};

// SSG - Static Site Generator (i.e., the pages are pregenerated on the server)
/**
 * Calculates all the possible page paramaters (i.e., problem IDs)
 * to generate them at build time
 */
export async function generateStaticParams() {
    // Problem names is the key set in the ProblemLookup
    // (i.e., string[] with the problem names)
    const problemNames = Object.keys(ProblemLookup);

    return problemNames.map((problemName) => ({
        problemID: problemName
    }));
}

// export default ProblemPage;
const ProblemPage:React.FC<ProblemPageProps> = async ({params}) => {
    /** Keeps track of the authenticated user */
    const currUser = await getSessionUser(true);

    // Fetch the problem info which consists of two parts:
    // 1) LocalProblem (i.e., coming from @/app/local-data/problems/*.ts) and
    // 2) DBProblem (i.e., coming from data stored in the database
    const dbProblem = await getProblem(params.problemID);
    const localProblem = ProblemLookup[params.problemID];

    // The Rapid API key (needed to submit the code for execution)
    const rapidApiKey = await getRadidApiKey();

    // Find the problem id for the previous and the next page (if any)
    const totalProblems = Object.keys(ProblemLookup).length;
    const currProblemOrder = dbProblem?.order;
    let prevProblemID: string | null = null;
    if (currProblemOrder &&  currProblemOrder > 1) {
        const prevProblem = await getProblemByOrder(currProblemOrder - 1);
        prevProblemID = prevProblem?.problem_id ?? null;
    }
    let nextProblemID = null;
    if (currProblemOrder &&  currProblemOrder < totalProblems) {
        const nextProblem = await getProblemByOrder(currProblemOrder + 1);
        nextProblemID = nextProblem?.problem_id ?? null;
    }
    
    return (
        <div>
            <Topbar user={currUser}
                    prevProblemID={prevProblemID}
                    nextProblemID={nextProblemID}
            />
            <Workspace user={currUser}
                       localProblem={localProblem}
                       dbProblem={dbProblem}
                       rapidApiKey={rapidApiKey}
            />
        </div>

    );
}
export default ProblemPage;