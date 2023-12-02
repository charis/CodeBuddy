"use client";
// Library imports
import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { ZodFormattedError } from 'zod';
// Custom imports
import { assertCredentials } from "@/util/ServerActions";
import { ErrorMessage } from "@/util/UIUtil";

type LoginProps = {
    showModal: (type: 'login' | 'signup' | 'forgotPassword') => void
};

const Login:React.FC<LoginProps> = ({showModal}) => {
    /** Keeps track of input validation errors */
    const [validationError, setValidationError] = useState<ZodFormattedError<{ email: string;
                                                                               password: string;
                                                                              }, string
                                                                            > | null>(null);
    /** Keeps track of any user authentication errors */
    const [authError, setAuthError] = useState<string | null>(null);
    /**
     * {@code true} if we are waiting for a server response or
     * {@code false} otherwise
     */
    const [waiting, setWaiting] = useState<boolean>(false);

    /**
     * Authenticates the user against our database.
     */
    async function submitForm(data: FormData) {
        const validationError = await assertCredentials(data);

        if (validationError) {
            // Validation error
            setValidationError(validationError);
        }
        else { 
            // Wipe out any previous validation error
            setValidationError(null);
            // Do not accept another login request till we hear from the server
            setWaiting(true);
            const { email, password } = Object.fromEntries(data);

            try {
                const user = await signIn('credentials', {
                                              username: email,
                                              password: password,
                                              redirect: true,
                                              callbackUrl: '/'
                                          });
            }
            catch (error: any) {
                setAuthError(error.message);
            }
            finally {
                setWaiting(false);
            }
        }
    }

    return (
      <form className="space-y-6 px-6 pb-4"
            action={submitForm}
      >
        <h3 className="text-xl font-medium text-white">Sign in to CodeBuddy</h3>
        <div  // -----   E M A I L   T E X T   F I E L D   ----- //
        >
          <label htmlFor="email" className="text-sm font-medium block mb-2 text-gray-300">
            Email
          </label>
          <input type="email"
                 name="email"
                 className="border-2 outline-none sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5
                            bg-white-600 border-gray-500 placeholder-gray-400 text-black"
                 placeholder="Enter your e-mail here"
          />
          {validationError?.email &&
            <ErrorMessage message={validationError.email._errors.join(',')} />
          }
        </div>
        <div  // -----   P A S S W O R D   T E X T   F I E L D   ----- //
        >
          <label htmlFor="password" className="text-sm font-medium block mb-2 text-gray-300">
            Password
          </label>
          <input type="password"
                 name="password"
                 className="border-2 outline-none sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5
                            bg-white-600 border-gray-500 placeholder-gray-400 text-black"
                 placeholder="Enter your password here"
          />
          {validationError?.password &&
            <ErrorMessage message={validationError.password._errors.join(',')} />
          }
        </div>
        <button // -----   L O G I N   B U T T O N   ----- //
                type="submit"
                className="w-full text-white focus:ring-blue-300 font-medium rounded-lg
                           text-sm px-5 py-2.5 text-center bg-cardinal-red hover:bg-cardinal-red-s"
        >
          {waiting ? 'Logging in...' : 'Login'}
        </button>
        <button className="flex w-full justify-end" onClick={() => showModal('forgotPassword')}>
          <a href="#" className="text-sm block text-cardinal-red hover:underline w-full text-right">
            Forgot Password?
          </a>
        </button>
        <div className="text-sm font-medium text-gray-300">
          Don&apos;t have an account?&nbsp;
          <a href="#" className="text-blue-700 hover:underline" onClick={() => showModal('signup')}>
            Sign up
          </a>
        </div>
        {authError && <ErrorMessage message={authError} /> }
      </form>
    );
};
export default Login;