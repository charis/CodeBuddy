"use server";
// Library imports
import { getServerSession } from 'next-auth/next';
import {ZodFormattedError} from 'zod';
// Custom imports
import * as dbUtils from "@/util/DBUtils";
import { AuthenticateUserSchema, CreateProblemSchema, CreateUserSchema, NewPasswordSchema } from "@/app/lib/zod_schemas";
import { DBUser } from "@/types";


/**
 * Gets the authenticated user.
 * 
 * @param includeAttemptedProblems {@code true} to include the attempted problems
 *                                 or {@code false} to exclude them
 * 
 * @returns the authenticated user or {@code null} if no user is logged in
 */
export async function getSessionUser(includeAttemptedProblems : boolean): Promise<DBUser | null> {
    try {
        const session = await getServerSession();
        const user = session?.user
    
        if (!user) {
            return null;
        }

        return await dbUtils.getUser(user.email!, includeAttemptedProblems);
    }
    catch (error) {
        console.log("Error getting the server session: " + error);

        return null;
    }
}

/**
 * Extracts the information from the passed form data to create a
 * new user in the database.
 * 
 * @param userInfo The form data that contains the information
 *                 about the user
 * 
 * @return a formatted error message if there is a validaton error,
 *         or a string if this is an error message from the database
 *         operation or {@code null} if the task completed successfully.
 */
export async function createUserInDB(userInfo: FormData) :
             Promise<ZodFormattedError<{email: string;
                                        name: string;
                                        password: string }, string> | string | null> {
    const { email, name, password } = Object.fromEntries(userInfo);
    const zodResult = CreateUserSchema.safeParse({email, name, password});
    if (!zodResult.success) {
        return zodResult.error.format();
    }

    const [, error] = await dbUtils.createUser(email as string,
                                               name as string,
                                               password as string);
    return error;
}

/**
 * Adds a problem to the list of attempted problems by the user. If the problem
 * already exists, it updates the problem.
 * 
 * @param user the user who attempted or solved the problem
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
export async function addAttemptedProblem(user: DBUser,
                                          problemID: string,
                                          code: string,
                                          correct: boolean) :
             Promise<[boolean, string | null]> {
    // Check if the user already attempted that problem
    // and if so, update is 'correct' value
    for (const problem of user.attemptedProblems ) {
        if (problem.problem_id === problemID) {
            // Check the current 'correct' value
            if (problem.correct !== correct) {
                // Update the value
                return dbUtils.updateAttemptedProblem(problem.id,
                                                      code,
                                                      correct);
            }
            else {
                // No action required since the attempted problem did not change
                return [true, null]; 
            }
        }
    }
    
    // If we reach this point, it means that the user had not attempted
    // the problem before
    const [dbAttemptedProblem, error] = await dbUtils.createAttemptedProblem(problemID,
                                                                             user.email,
                                                                             code,
                                                                             correct);

    return [dbAttemptedProblem !== null, error];
}

/**
 * Extracts the information from the passed form data to create a
 * new problem in the database.
 * 
 * @param problemInfo The form data that contains the information
 *                    about the problem
 * 
 * @return a formatted error message if there is a validaton error,
 *         or a string if this is an error message from the database
 *         operation or {@code null} if the task completed successfully.
 */
export async function createProblemInDB(problemInfo: FormData) :
             Promise<ZodFormattedError<{ problem_id: string;
                                         title: string;
                                         category: string;
                                         difficulty: string;
                                         order: number; }, string> | string | null> {
    const { problem_id, title, category,
            difficulty, order, videoId, link } = Object.fromEntries(problemInfo);
    const zodResult = CreateProblemSchema.safeParse({problem_id,
                                                     title,
                                                     category,
                                                     difficulty,
                                                     order});
    if (!zodResult.success) {
        return zodResult.error.format();
    }

    const [, error] = await dbUtils.createProblem(problem_id as string,
                                                  title as string,
                                                  category as string,
                                                  difficulty as string,
                                                  Number(order),
                                                  videoId as string,
                                                  link as string);
    return error;
}

/**
 * Extracts the information from the passed form data to assert
 * the user credentials.
 * 
 * @param credentials The form data that contains the user credentials
 * 
 * @returns a ZodFormattedError in case of invalid input or
 *          {@code null} if the input is valid.
 */
export async function assertCredentials(credentials: FormData) :
             Promise<ZodFormattedError<{email: string; 
                                        password: string }, string> | null> {
    const { email, password } = Object.fromEntries(credentials);
    const zodResult = AuthenticateUserSchema.safeParse({email, password});
    if (!zodResult.success) {
        return zodResult.error.format();
    }

    return null;
}

/**
 * Extracts the information from the passed form data to assert
 * the new password and the password confirmation.
 * 
 * @param newPassword The new passowrd
 * @param passwordConfirm The passowrd confirmation
 * 
 * @returns a ZodFormattedError in case of invalid passwords or
 *          {@code null} if the passwords match and are valid.
 */
export async function assertNewPasswordForm(passwords: FormData) :
             Promise<ZodFormattedError<{newPassword: string;
                                        passwordConfirm: string}, string> | null> {
    const { newPassword, passwordConfirm } = Object.fromEntries(passwords);
    const zodResult = NewPasswordSchema.safeParse({newPassword, passwordConfirm});
    if (!zodResult.success) {
        return zodResult.error.format();
    }

    return null;
}

/**
 * Extracts the information from the passed form data to validate
 * the user credentials (i.e., authenticate the user).
 * 
 * @param credentials The form data that contains the user credentials
 * 
 * @returns an array where the first element is the ZodFormattedError
 *          in case of invalid input or {@code null} if the input is valid
 *          and the second element the authenicated user or {@code null} if
 *          the credentials are invalid.
 */
export async function validateCredentials(credentials: FormData) :
             Promise<[ZodFormattedError<{email: string; password: string }, string> | null, 
                      DBUser | null]> {
    const { email, password } = Object.fromEntries(credentials);
    const zodResult = AuthenticateUserSchema.safeParse({email, password});
    if (!zodResult.success) {
        return [zodResult.error.format(), null];
    }
    
    const dbUser = await dbUtils.authenticateUser(email as string,
                                                  password as string);
    return [null, dbUser];
}

/**
 * Adds a verification token for the specified user.
 * 
 * @param email The email for the user to add the verification token
 * @param token The verification token
 * @param expiry The time when the token will expire
 * 
 * @return {@code null} if the task completed successfully or an error message
 *         if there was an error.
 */
export async function addVerificationToken(email: string,
                                           token: string,
                                           expiry: Date) : Promise<string | null> {
    const [, error] = await dbUtils.updateUser(email,      // currEmail
                                               undefined,  // newEmail
                                               undefined,  // newName
                                               undefined,  // newPassword
                                               undefined,  // isVerified
                                               undefined,  // forgotPasswordToken
                                               undefined,  // forgotPasswordTokenExpiry
                                               token,      // verifyToken
                                               expiry      // verifyToken
    );
    
    return error;
}

/**
 * Adds a forgot password token for the specified user.
 * 
 * @param email The email for the user to add the forgot password token
 * @param token The password reset token
 * @param expiry The time when the token will expire
 * 
 * @return {@code null} if the task completed successfully or an error message
 *         if there was an error.
 */
export async function addForgotPasswordToken(email: string,
                                             token: string,
                                             expiry: Date) : Promise<string | null> {
    const [, error] = await dbUtils.updateUser(email,      // currEmail
                                               undefined,  // newEmail
                                               undefined,  // newName
                                               undefined,  // newPassword
                                               undefined,  // isVerified
                                               token,      // forgotPasswordToken
                                               expiry,     // forgotPasswordTokenExpiry
                                               undefined,  // verifyToken
                                               undefined   // verifyToken
    );
    
    return error;
}

/**
 * Validates the given token.
 * A token is valid if it exists in the database and has not expired.
 * 
 * @param token The token to validate
 * 
 * @return {@code true} if the token is found and has not expired or
 *         {@code false} otherwise
 */
export async function validateVerificationToken(token: string): Promise<boolean> {
    try {
        const [success, error] = await dbUtils.verifyUser(token);
        if (error) {
            console.log(error);
        }
        return success;
    }
    catch (error) {
        console.log(error);
        return false;
    }
}

/**
 * Validates the given token and if the token is valid it sets the
 * new password.
 * A token is valid if it exists in the database and has not expired.
 * 
 * @param token The token to validate
 * @param newPassword The new password
 * 
 * @return {@code true} if the token is found and has not expired or
 *         {@code false} otherwise
 */
export async function resetPassword(token: string,
                                    newPassword: string ): Promise<boolean> {
    try {
        const [success, error] = await dbUtils.resetPassword(token, newPassword);
        if (error) {
            console.log(error);
        }
        return success;
    }
    catch (error) {
        console.log(error);
        return false;
    }
}

/**
 * @return the Rapid API key or {@code null} if not found
 */
export async function getRadidApiKey(): Promise<string | null> {
    return process.env.REACT_APP_RAPID_API_KEY ?? null;
}