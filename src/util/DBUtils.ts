"use server";
// Library imports
import prisma from '@/app/lib/prisma';
import * as bcrypt from 'bcrypt'; // Install: 'npm i bcrypt' followed by 'npm i --save-dev @types/bcrypt'
// Custom imports
import { DBUser, DBProblem, DBAttemptedProblem } from "@/types";
import { AttemptedProblem } from "@prisma/client"; // The Problem model is in file schema.prisma
  
// -------------------------------------------------------- //
//      S  E  A  R  C  H     F  U  N  C  T  I  O  N  S      //
// -------------------------------------------------------- //
/**
 * Gets the registered users.
 * 
 * @param includeAttemptedProblems {@code true} to include the attempted problems
 *                                 or {@code false} to exclude them
 * @returns the registered users
 */
export async function getUsers(includeAttemptedProblems: boolean): Promise<DBUser[]> {
    try {
        const users = await prisma.user.findMany({
            include: { attemptedProblems: includeAttemptedProblems }
        });
        const dbUsers: DBUser[] = await Promise.all(
            users.map(async (user) => {
                return {
                    email: user.email,
                    name: user.name,
                    isVerified: user.isVerified,
                    forgotPasswordToken: user.forgotPasswordToken ?? undefined,
                    forgotPasswordTokenExpiry: user.forgotPasswordTokenExpiry ?? undefined,
                    verifyToken: user.verifyToken ?? undefined,
                    verifyTokenExpiry: user.verifyTokenExpiry ?? undefined,
                    attemptedProblems: includeAttemptedProblems? 
                                       await Promise.all(
                                           user.attemptedProblems.map(async (attemptedProblem) => {
                                               return await mapAttemptedProblemToDBAttemtpedProblem(attemptedProblem);
                                            })
                                        ) :[]
                };
            })
        )
        return dbUsers;
    }
    catch (error: any) {
        throw new Error("Error getting the resistered users: " + error.message);
    }
}

/**
 * Look up a user by their email.
 * 
 * @param email The user email
 * @param includeAttemptedProblems {@code true} to include the attempted problems
 *                                 or {@code false} to exclude them
 * 
 * @returns the user with the given email or
 *          {@code null} if no user has the given email
 */
export async function getUser(email: string,
                              includeAttemptedProblems: boolean): Promise<DBUser | null> {
    try {
        const user = await prisma.user.findUnique({
            where: { email: email },
            include: { attemptedProblems: includeAttemptedProblems }
        });
    
        if (!user) {
            // Found no user with the given email
            return null;
        }
    
        const dbUser: DBUser = {
            email: user.email,
            name: user.name,
            isVerified: user.isVerified,
            forgotPasswordToken: user.forgotPasswordToken ?? undefined,
            forgotPasswordTokenExpiry: user.forgotPasswordTokenExpiry ?? undefined,
            verifyToken: user.verifyToken ?? undefined,
            verifyTokenExpiry: user.verifyTokenExpiry ?? undefined,
            attemptedProblems: includeAttemptedProblems? 
                               await Promise.all(
                                   user.attemptedProblems.map(async (attemptedProblem) => {
                                       return await mapAttemptedProblemToDBAttemtpedProblem(attemptedProblem);
                                   })
                               ) :[]
        };
        return dbUser;
    }
    catch (error: any) {
        throw new Error("Error getting user by email (" + email + "): " + error.message);
    }
}

/**
 * Gets the problems that exist in the database in ascending order
 * (by the 'order' property).
 * 
 * @returns the existing problems.
 */
export async function getProblems(): Promise<DBProblem[]> {
    try {
        const problems = await prisma.problem.findMany({
            orderBy: { order: 'asc' }
        });
    
        const dbProblems: DBProblem[] = problems.map((problem) => {
            return {
                problem_id: problem.problem_id,
                title: problem.title,
                category: problem.category,
                difficulty: problem.difficulty,
                order: problem.order,
                videoId: problem.videoId,
                link: problem.link ?? undefined,
            };
        });
        return dbProblems;
    }
    catch (error: any) {
        throw new Error("Error getting the exiting problems: " + error.message);
    }
}

/**
 * Look up a proble by the problem id.
 * 
 * @param problem_id The problem id
 * 
 * @returns the problem with the given problem id or
 *          {@code null} if no problem has the given id
 */
export async function getProblem(problem_id: string): Promise<DBProblem | null> {
    try {
        const problem = await prisma.problem.findUnique({
            where: { problem_id: problem_id }
        });
    
        if (!problem) {
            return null;
        }
    
        const dbProblem: DBProblem = {
            problem_id: problem.problem_id,
            title: problem.title,
            category: problem.category,
            difficulty: problem.difficulty,
            order: problem.order,
            videoId: problem.videoId, // YouTube video URL
            link: problem.link ?? undefined       
        };
        return dbProblem;
    }
    catch (error: any) {
        throw new Error("Error getting the problems with id=" + problem_id + ": " + error.message);
    }
}

/**
 * Look up a proble by the problem order.
 * 
 * @param order The problem order
 * 
 * @returns the problem with the given problem order or
 *          {@code null} if no problem has the given order
 */
export async function getProblemByOrder(order: number): Promise<DBProblem | null> {
    try {
        const problem = await prisma.problem.findUnique({
            where: { order: order }
        });
    
        if (!problem) {
            return null;
        }
    
        const dbProblem: DBProblem = {
            problem_id: problem.problem_id,
            title: problem.title,
            category: problem.category,
            difficulty: problem.difficulty,
            order: problem.order,
            videoId: problem.videoId, // YouTube video URL
            link: problem.link ?? undefined       
        };
        return dbProblem;
    }
    catch (error: any) {
        throw new Error("Error getting the problems with order=" + order + ": " + error.message);
    }
}

/**
 * Look up the attempted problems for a given user.
 * 
 * @param email The user email
 * 
 * @returns the attempted problems by the user or
 *          {@code null} if the user does not exist.
 */
export async function getAttemptedProblems(email: string):
             Promise<DBAttemptedProblem[] | null> {
    try {
        const user = await prisma.user.findUnique({
            where: { email: email },
            include: { attemptedProblems: true }
        });
    
        if (!user) {
            // Found no user with the given email
            return null;
        }
    
        const dbAttempedProblems: DBAttemptedProblem[] = await Promise.all(
            user.attemptedProblems.map(async (attemptedProblem) => {
                return await mapAttemptedProblemToDBAttemtpedProblem(attemptedProblem);
            })
        );
        return dbAttempedProblems;
    }
    catch (error: any) {
        throw new Error("Error getting the attempted problems for user '" + email + "': " + error.message);
    }
}

// -------------------------------------------------------- //
//      C  R  E  A  T  E     F  U  N  C  T  I  O  N  S      //
// -------------------------------------------------------- //
/**
 * Creates a new user.
 * 
 * @param email The user email
 * @param name The user display name
 * @param password The user password to encrypt and store
 * 
 * @returns an array where:
 *          1) In case of success, the first element is
 *             the DBUser that was created and the second
 *             is {@code null}
 *          2) In case of error, the first element is
 *             {@code null} and the second is the error
 *             message
 */
export async function createUser(email: string,
                                 name: string,
                                 password: string):
             Promise<[DBUser | null, string | null]> {
    try {
        const user = await prisma.user.create({
            data: {
                email: email,
                name: name,
                isVerified: false,
                forgotPasswordToken: null,
                forgotPasswordTokenExpiry: null,
                verifyToken: null,
                verifyTokenExpiry: null,
                password: await bcrypt.hash(password, 10), // salt rounds = 10
            }
        });

        const dbUser: DBUser = {
            email: user.email,
            name: user.name,
            isVerified: false,
            forgotPasswordToken: undefined,
            forgotPasswordTokenExpiry: undefined,
            verifyToken: undefined,
            verifyTokenExpiry: undefined,
            attemptedProblems: [], // The new user has not attempted any problems
        };
        return [dbUser, null];
    }
    catch (error) {
        const user = await prisma.user.findUnique({
            where: { email: email },
        });
    
        if (user) {
            return [null, "User '" + email + "' already exists"];
        }
        else {
            return [null, "An unknown error occurred"];
        }
    }
}

/**
 * Creates a new problem.
 * 
 * @param problem_id The problem id
 * @param title The problem title
 * @param category The problem category
 * @param difficulty The problem difficulty
 * @param order The problem order among other problems
 * @param videoId The problem video ID or (optional)
 * @param link The problem link (optional)
 * 
 * 
 * @returns an array where:
 *          1) In case of success, the first element is
 *             the DBProblem that was created and the
 *             second is {@code null}
 *          2) In case of error, the first element is
 *             {@code null} and the second is the error
 *             message
 */
export async function createProblem(problem_id: string,
                                    title: string,
                                    category: string,
                                    difficulty: string,
                                    order: number,
                                    videoId?: string,
                                    link?: string):
             Promise<[DBProblem | null, string | null]> {
    try {
        const problem = await prisma.problem.create({
            data: {
                problem_id: problem_id,
                title: title,
                category: category,
                difficulty: difficulty,
                order: order,
                videoId: videoId,
                link: link,
            }
        });

        const dbProblem: DBProblem = {
            problem_id: problem.problem_id,
            title: problem.title,
            category: problem.category,
            difficulty: problem.difficulty,
            order: problem.order,
            videoId: problem.videoId,
            link: problem.link ?? undefined,
        };
        return [dbProblem, null];
    }
    catch (error) {
        const problem = await prisma.problem.findUnique({
            where: { problem_id: problem_id }
        });
    
        if (problem) {
            return [null, "Problem '" + problem_id + "' already exists"];
        }
        else {
            return [null, "An unknown error occurred"];
        }
    }
}

/**
 * Creates a new attempted problem.
 * 
 * @param problem_id The problem id
 * @param email The email of the user who attempted the problem
 * @param code The user code
 * @param correct {@code true} if the user solved the problem correctly
 *                or {@code false} otherwise
 * 
 * @returns an array where:
 *          1) In case of success, the first element is
 *             the DBAttemptedProblem that was created and the
 *             second is {@code null}
 *          2) In case of error, the first element is
 *             {@code null} and the second is the error
 *             message
 */
export async function createAttemptedProblem(problem_id: string,
                                             email: string,
                                             code: string,
                                             correct: boolean):
             Promise<[DBAttemptedProblem | null, string | null]> {
    try {
        // Make sure that the problem exists
        const problem = await prisma.problem.findUnique({
            where: { problem_id: problem_id }
        });
        if (!problem) {
            return [null, "Unknown problem id:" + problem_id];
        }
        
        // Make sure that the user exists
        const user = await prisma.user.findUnique({
            where: { email: email },
            include: { attemptedProblems: true }
        });
        if (!user) {
            return [null, "Unknown user email:" + email];
        }
    
        // Make sure that the user has not previously attempted the problem
        for (const attmptedProblem of user.attemptedProblems) {
            if (attmptedProblem.pid === problem.id) {
                return [null, "User '" + email + "' has already attempted the problem"];
            }
        }
    
        const attemptedProblem = await prisma.attemptedProblem.create({
            data: {
                pid: problem.id,
                code: code,
                correct: correct,
                uid: user.id
            }
        });

        const dbAttemptedProblem: DBAttemptedProblem = {
            id: attemptedProblem.id,
            problem_id: problem.problem_id,
            title: problem.title,
            category: problem.category,
            difficulty: problem.difficulty,
            order: problem.order,
            videoId: problem.videoId,
            link: problem.link ?? undefined,
            code: attemptedProblem.code,
            correct: attemptedProblem.correct, // Replace this with the actual logic to fetch 'correct' from the database if needed
        };
        return [dbAttemptedProblem, null];
    }
    catch (error) {
        return [null, "An unknown error occurred"];
    }
}

// -------------------------------------------------------- //
//      U  P  D  A  T  E     F  U  N  C  T  I  O  N  S      //
// -------------------------------------------------------- //
/**
 * Updates a user.
 * 
 * @param currEmail The current email
 * @param newName The new display name (optional)
 * @param newEmail The new email (optional)
 * @param newPassword The new password (optional)
 * @param isVerified {@code true} if the user is verified or
 *                   {@code false} otherwise (optional)
 * @param forgotPasswordToken The token that is used to reset the
 *                            password if the user forgot their password or
 *                            {@code null} to clear the existing value
 * @param forgotPasswordTokenExpiry The expiration date for the forgot passowrd token
 *                                  or {@code null} to clear the existing value
 * @param verifyToken The token to verify the user or
 *                    {@code null} to clear the existing value
 * @param verifyTokenExpiry The expiration date for the verify user token or
 *                          {@code null} to clear the existing value
 * 
 * @returns an array where the first element is {@code true}
 *          in case the operation was successful or
 *          {@code false} otherwise and the second element
 *          is {@code null} in case the operation was successful
 *          and a string with error message in case it was
 *          unsuccessful.
 */
export async function updateUser(currEmail: string,
                                 newEmail?: string,
                                 newName?: string,
                                 newPassword?: string,
                                 isVerified?: boolean,
                                 forgotPasswordToken?: string | null,
                                 forgotPasswordTokenExpiry?: Date | null,
                                 verifyToken?: string | null,
                                 verifyTokenExpiry?: Date | null):
                      Promise<[boolean, string | null]> {
    if (!newName && !newEmail &&  !newPassword && isVerified === undefined &&
        !forgotPasswordToken && !forgotPasswordTokenExpiry && !verifyToken && !verifyTokenExpiry) {
        return [false, "You must provide a field to update"];
    }

    try{
        await prisma.user.update({
            where: {
                email: currEmail
            },
            data: {
                name: newName,
                email: newEmail,
                password: newPassword? await bcrypt.hash(newPassword, 10) : undefined,
                isVerified: isVerified,
                forgotPasswordToken: forgotPasswordToken,
                forgotPasswordTokenExpiry: forgotPasswordTokenExpiry,
                verifyToken: verifyToken,
                verifyTokenExpiry: verifyTokenExpiry
            },
        });
        return [true, null];
    }
    catch (error) {
        const user = await prisma.user.findUnique({
            where: { email: currEmail },
        });
    
        if (!user) {
            return [false, "Found no user with the given email: " + currEmail];
        }
        else {
            return [false, "An unknown error occurred"];
        }
    }
}

/**
 * Updates a problem.
 * 
 * @param problem_id The problem id
 * @param newProblem_id The new problem id (optional)
 * @param newTitle The new problem title (optional)
 * @param newCategory The new problem category (optional)
 * @param newDifficulty The new problem difficulty (optional)
 * @param newOrder The new problem order among other problems (optional)
 * @param newVideoId The new problem video ID or (optional)
 * @param newLink The new problem link (optional)
 * 
 * @returns an array where the first element is {@code true}
 *          in case the operation was successful or
 *          {@code false} otherwise and the second element
 *          is {@code null} in case the operation was successful
 *          and a string with error message in case it was
 *          unsuccessful.
 */
export async function updateProblem(problem_id: string,
                                    newProblem_id?: string,
                                    newTitle?: string,
                                    newCategory?: string,
                                    newDifficulty?: string,
                                    newOrder?: number,
                                    newVideoId?: string,
                                    newLink?: string):
                      Promise<[boolean, string | null]> {
    if (!newProblem_id && !newTitle && !newCategory && 
        !newDifficulty && !newOrder && !newVideoId && !newLink) {
        return [false, "You must specify the problem field that you want to update"];
    }

    try{
        await prisma.problem.update({
            where: {
                problem_id: problem_id
            },
            data: {
                problem_id: newProblem_id,
                title: newTitle,
                category: newCategory,
                difficulty: newDifficulty,
                order: newOrder,
                videoId: newVideoId,
                link: newLink
            },
        });
        return [true, null];
    }
    catch (error) {
        const problem = await prisma.problem.findUnique({
            where: { problem_id: problem_id }
        });
    
        if (!problem) {
            return [false, "Found no problem with the given id: " + problem_id];
        }
        else {
            return [false, "An unknown error occurred"];
        }
    }
}

/**
 * Updates an attempted problem.
 * 
 * @param id The attempted problem id
 * @param code The user code
 * @param correct {@code true} if the user solved the problem correctly
 *                or {@code false} otherwise
 * 
 * @returns an array where the first element is {@code true}
 *          in case the operation was successful or
 *          {@code false} otherwise and the second element
 *          is {@code null} in case the operation was successful
 *          and a string with error message in case it was
 *          unsuccessful.
 */
export async function updateAttemptedProblem(id: number,
                                             code: string,
                                             correct: boolean):
             Promise<[boolean, string | null]> {
    try{
        await prisma.attemptedProblem.update({
            where: { id: id },
            data: {
                code: code,
                correct: correct
            },
        });
        return [true, null];
    }
    catch (error) {
        const attemptedProblem = await prisma.attemptedProblem.findUnique({
            where: { id: id }
        });

        if (!attemptedProblem) {
            return [false, "Found no attempted problem with the given id: " + id];
        }
        else {     
            return [false, "An unknown error occurred"];
        }
    }
}

/**
 * Searches for a user with the given token and if there is a match
 * and the token has not expired, it marks the user (with that token)
 * as verified and clears the user's tokens.
 * 
 * @param token The token to validate
 * 
 * @returns an array where the first element is {@code true}
 *          in case the operation was successful or
 *          {@code false} otherwise and the second element
 *          is {@code null} in case the operation was successful
 *          and a string with error message in case it was
 *          unsuccessful.
 */
export async function verifyUser(token: string):
       Promise<[boolean, string | null]> {
    try {
        const userEmail = await searchForValidToken(token, true);
        if (!userEmail) {
            return [false, 'Invalid or expired token'];
        }

        await updateUser(userEmail, // currEmail
                         undefined, // newEmail
                         undefined, // newName
                         undefined, // newPassword
                         true,      // isVerified
                         null,      // forgotPasswordToken
                         null,      // forgotPasswordTokenExpiry
                         null,      // verifyToken
                         null       // verifyTokenExpiry
        );

        return [true, null];
    }
    catch (error: any) {
        return [false, error.message];
    }
}

/**
 * Searches for a user with the given token and if there is a match
 * and the token has not expired, it sets the user password to the
 * new value and clears the user's reset passowrd tokens.
 * 
 * @param token The token to validate
 * @param newPassword The new password
 * 
 * @returns an array where the first element is {@code true}
 *          in case the operation was successful or
 *          {@code false} otherwise and the second element
 *          is {@code null} in case the operation was successful
 *          and a string with error message in case it was
 *          unsuccessful.
 */
export async function resetPassword(token: string,
                                    newPassword: string):
       Promise<[boolean, string | null]> {
    try {
        const userEmail = await searchForValidToken(token, false);
        if (!userEmail) {
            return [false, 'Invalid or expired token'];
        }

        await updateUser(userEmail,   // currEmail
                         undefined,   // newEmail
                         undefined,   // newName
                         newPassword, // newPassword
                         undefined,   // isVerified
                         null,        // forgotPasswordToken
                         null,        // forgotPasswordTokenExpiry
                         null,        // verifyToken
                         null         // verifyTokenExpiry
        );

        return [true, null];
    }
    catch (error: any) {
        return [false, error.message];
    }
}

// -------------------------------------------------------- //
//      D  E  L  E  T  E     F  U  N  C  T  I  O  N  S      //
// -------------------------------------------------------- //
/**
 * Deletes a user.
 * 
 * @param email The user email
 * 
 * @returns an array where the first element is {@code true}
 *          in case the operation was successful or
 *          {@code false} otherwise and the second element
 *          is {@code null} in case the operation was successful
 *          and a string with error message in case it was
 *          unsuccessful.
 */
export async function deleteUser(email: string):
             Promise<[boolean, string | null]> {
    try {
        const user = await prisma.user.findUnique({
            where: { email: email },
        });
        
        if (!user) {
            return [false, "Found no user with the given email: " + email];
        }
        
        const deleteAttemptedProblems = prisma.attemptedProblem.deleteMany({
            where: { uid: user.id }
        });
                  
        const deleteUser = prisma.user.delete({
            where: { id: user.id },
        });
        
        await prisma.$transaction([deleteAttemptedProblems, deleteUser]);
        return [true, null];
    }
    catch (error) {
        return [false, "An unknown error occurred"];
    }
}

/**
 * Deletes a problem.
 * 
 * @param problem_id The problem id
 * 
 * @returns an array where the first element is {@code true}
 *          in case the operation was successful or
 *          {@code false} otherwise and the second element
 *          is {@code null} in case the operation was successful
 *          and a string with error message in case it was
 *          unsuccessful.
 */
export async function deleteProblem(problem_id: string):
             Promise<[boolean, string | null]> {
    try {
        const problem = await prisma.problem.findUnique({
            where: { problem_id: problem_id },
        });
        
        if (! problem) {
            return [false, "Found no problem with the given id: " + problem_id];
        }
        
        const deleteAttemptedProblems = prisma.attemptedProblem.deleteMany({
            where: { pid: problem.id }
        });
        
        const deleteProblem = prisma.problem.delete({
            where: { id: problem.id },
        });
         
        await prisma.$transaction([deleteAttemptedProblems, deleteProblem]);
        return [true, null];
    }
    catch (error) {
        return [false, "An unknown error occurred"];
    }
}

/**
 * Deletes am attempted problem.
 * 
 * @param id The attempted problem id
 * 
 * @returns an array where the first element is {@code true}
 *          in case the operation was successful or
 *          {@code false} otherwise and the second element
 *          is {@code null} in case the operation was successful
 *          and a string with error message in case it was
 *          unsuccessful.
 */
export async function deleteAttemptedProblem(id: number):
             Promise<[boolean, string | null]> {
    try {
        await prisma.attemptedProblem.delete({
            where: { id: id },
        });
        return [true, null];
    }
    catch (error) {
        return [false, "An unknown error occurred"];
    }
}

// -------------------------------------------------------- //
//      H  E  L  P  E  R     F  U  N  C  T  I  O  N  S      //
// -------------------------------------------------------- //
/**
 * Helper function to convert the Prisma-generated AttemptedProblem to DBAttemptedProblem
 * 
 * @param attemptedProblem the Prisma-generated AttemptedProblem
 * 
 * @returns the corresponding DBAttemptedProblem
 * @throws an error in case of internal error (i.e., there is an attempted problem
 *         that is not associated with a problem)
 */
async function mapAttemptedProblemToDBAttemtpedProblem(attemptedProblem: AttemptedProblem): Promise<DBAttemptedProblem> {
    // Fetch the 'problem' data based on 'pid'
    const problem = await prisma.problem.findUnique({
        where: { id: attemptedProblem.pid },
    });

    if (!problem) { 
        // Should never have an attempted problem that is not associated with a problem
        throw new Error("Internal error: attempted problem not associated with a problem");
    }

    // Combine the fetched 'problem' data with the properties of 'attemptedProblem2'
    return {
        id: attemptedProblem.id,
        problem_id: problem.problem_id,
        title: problem.title,
        category: problem.category,
        difficulty: problem.difficulty,
        order: problem.order,
        videoId: problem.videoId,
        link: problem.link ?? undefined,
        code: attemptedProblem.code,
        correct: attemptedProblem.correct, // Replace this with the actual logic to fetch 'correct' from the database if needed
    };
}

/**
 * Authenticates the user.
 * 
 * @param email The user email
 * @param password The user password
 * 
 * @returns the authenticated user or
 *          {@code null} if the credentials are invalid
 */
export async function authenticateUser(email: string, password: string): Promise<DBUser | null> {
    try {
        // Look up the user with the provided email as username
        const user = await prisma.user.findFirst({
            where: { email: email },
            include: { attemptedProblems: true }
        });
    
        // Check the encrypted password if the user exists
        if (user) {
            if (await bcrypt.compare(password, user.password)) {
                const dbUser: DBUser = {
                    email: user.email,
                    name: user.name,
                    isVerified: user.isVerified,
                    forgotPasswordToken: user.forgotPasswordToken ?? undefined,
                    forgotPasswordTokenExpiry: user.forgotPasswordTokenExpiry ?? undefined,
                    verifyToken: user.verifyToken ?? undefined,
                    verifyTokenExpiry: user.verifyTokenExpiry ?? undefined,
    
                    attemptedProblems: await Promise.all(
                                           user.attemptedProblems.map(async (attemptedProblem) => {
                                               return await mapAttemptedProblemToDBAttemtpedProblem(attemptedProblem);
                                           })
                                       )
                };
                return dbUser;
            }
        }
        return null;
    }
    catch (error: any) {
        throw new Error("Error authenticating users '" + email + "': " + error.message);
    }
}

/**
 * Looks up the given token in the users in the database and returns
 * {@code true} if the token is found and has not expired.
 * 
 * @param token The token to search for
 * @param verifyUser {@code true} if this is a verification token or
 *                   {@code false} if this is a forgot password token
 * 
 * @return the email of the user with the valid token or
 *         {@code null} if there is no user with the specified token as valid token
 */
async function searchForValidToken(token: string,
                                   verifyUser: boolean):
      Promise<string | null> {
    try {
        var user;
        if (verifyUser) { // Verify user
            user = await prisma.user.findFirst({
                where: {
                    verifyToken: token,
                    verifyTokenExpiry: {
                        gte: new Date() 
                    }
                }
            });
        }
        else { // Forgot password
            user = await prisma.user.findFirst({
                where: {
                    forgotPasswordToken: token,
                    forgotPasswordTokenExpiry: {
                        gte: new Date() 
                    }
                }
            });
        }
        
        if (!user) {
            return null;
        }
        return user.email;
    }
    catch (error: any) {
        throw new Error("Error searching for token=" + token + ": " + error.message);
    }    
}





