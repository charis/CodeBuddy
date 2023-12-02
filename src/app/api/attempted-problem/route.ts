// Library imports
import prisma from '@/app/lib/prisma'

type RequestBody = {
    problem_id: string; // The id of the problem that is attempted
    email: string;      // The email of the user who attempted the problem
    code: string;       // The user code
    correct: boolean;   // True if the user code passed all tests
}

/**
 * Called to create a user
 * 
 * @param request The request with the user details
 *                (name, email, and password)
 */
export async function POST(request: Request) {
    const body:RequestBody = await request.json();
    
    try {
        // Make sure that the problem exists
        const problem = await prisma.problem.findUnique({
            where: { problem_id: body.problem_id }
        });

        if (!problem) {
            return new Response('Problem not found: ' + body.problem_id, {
                                status: 404, // Not found
                                headers: {'Content-Type': 'plain/text' } 
            });            
        }
    
        // Make sure that the user exists
        const user = await prisma.user.findUnique({
            where: { email: body.email },
            include: { attemptedProblems: true }
        });
        if (!user) {
            return new Response('User not found: ' + body.email, {
                                status: 404, // Not found
                                headers: {'Content-Type': 'plain/text' } 
            });              
        }

        // Check if the user has previously attempted the problem
        for (const attmptedProblem of user.attemptedProblems) {
            if (attmptedProblem.pid === problem.id) {
                // The user has attempted the problem before; update it
                await prisma.attemptedProblem.update({
                    where: { id: attmptedProblem.id },
                    data: {
                        code: body.code,
                        correct: body.correct
                    },
                });

                return new Response('OK', {
                                    status: 200, // Success
                                    headers: {'Content-Type': 'plain/text' } 
                });
            }
        }

        // If we reach this point, it means that the user has not attempted
        // the problem. Create a new DB entry.
        await prisma.attemptedProblem.create({
            data: {
                pid: problem.id,
                code: body.code,
                correct: body.correct,
                uid: user.id
            }
        });

        return new Response('OK', {
                            status: 200, // Success
                            headers: {'Content-Type': 'plain/text' } 
        });
    }
    catch (error) {
        return new Response('Internal error', {
                            status: 500, // Internal Server Error
                            headers: {'Content-Type': 'plain/text' } 
        });
    }
}
