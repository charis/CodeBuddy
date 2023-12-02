"use client";
// Library impots
import { useState } from 'react';
import { ZodFormattedError } from 'zod';
// Custom imports
import { createUserInDB } from "@/util/ServerActions";
import { ErrorMessage, showError, showSuccess } from "@/util/UIUtil";
import { sendEmail } from "@/util/EmailUtil";
import { EmailType } from "@/types";


type SignupProps = {
    showModal: (type: 'login' | 'signup' | 'forgotPassword') => void
};

const Signup:React.FC<SignupProps> = ({showModal}) => {
    /** Keeps track of input validation errors */
    const [validationError, setValidationError] = useState<ZodFormattedError<{ email: string;
                                                                               name: string;
                                                                               password: string;
                                                                              }, string
                                                                            > | null>(null);
    /** Keeps track of any DB user creation errors */
    const [dbResult, setDBResult] = useState<string | null>(null);
    /**
     * {@code true} if we are waiting for a server response or
     * {@code false} otherwise
     */
    const [waiting, setWaiting] = useState<boolean>(false);


    /**
     * Registers the user to our database.
     */
    async function submitForm(data: FormData) {
        // Do not accept another login request till we hear from the server
        setWaiting(true);

        const error = await createUserInDB(data);
        if (error && typeof error !== "string") {
            // Validation error
            setValidationError(error);
            setDBResult(null);
        }
        else { 
            // Wipe out any previous validation error
            setValidationError(null);
            if (error) { // DB error
                setDBResult(error);
            }
            else { // No DB error
                // Send the user a verificatiom email(i.e., with token to verify the account)
                const { email } = Object.fromEntries(data);
                try {
                    await sendEmail(email as string, EmailType.ACCOUNT_VERIFICATION);
                    showSuccess('User registered successfully. Please, check your email to verify your account.');
                    showModal('login');
                }
                catch (error: any) {
                    showError('Sending verification email failed: ' + error.message);
                }
            }
        }

        setWaiting(false);
    }

    return (
      <form className="space-y-6 px-6 pb-4"
            action={submitForm}
      >
        <h3 className="text-xl font-medium text-white">Register to CodeBuddy</h3>
        <div  // -----   E M A I L   T E X T   F I E L D   ----- //
        >
          <label htmlFor="email"
                 className="text-sm font-medium block mb-2 text-gray-300">
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
        <div  // -----   N A M E   T E X T   F I E L D   ----- //
        >
          <label htmlFor="name"
                 className="text-sm font-medium block mb-2 text-gray-300">
            Display Name
          </label>
          <input type="text"
                 name="name"
                 className="border-2 outline-none sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500
                            block w-full p-2.5 bg-white-600 border-gray-500 placeholder-gray-400 text-black"
                 placeholder="Enter your first and last name here"
          />
          {validationError?.name &&
            <ErrorMessage message={validationError.name._errors.join(',')} />
          }
        </div>
        <div  // -----   P A S S W O R D   T E X T   F I E L D   ----- //
        >
          <label htmlFor="password" 
                 className="text-sm font-medium block mb-2 text-gray-300">
            Password
          </label>
          <input type="password"
                 name="password"
                 className="border-2 outline-none sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500
                            block w-full p-2.5 bg-white-600 border-gray-500 placeholder-gray-400 text-black"
                 placeholder="Enter your password here"
          />
          {validationError?.password &&
            <ErrorMessage message={validationError.password._errors.join(',')} />
          }
        </div>

        <button // -----   S I G N   U P   B U T T O N   ----- //
                type="submit" 
                className="w-full text-white focus:ring-blue-300 font-medium rounded-lg
                           text-sm px-5 py-2.5 text-center bg-cardinal-red hover:bg-cardinal-red-s"
        >
          {waiting ? 'Signing up...' : 'Sign up'}
        </button>
        <div className="text-sm font-medium text-gray-300">
          Already have an account?&nbsp;
          <a href="#" className="text-blue-700 hover:underline" onClick={() => showModal('login')}>
            Log In
          </a>
        </div>
        {dbResult && <ErrorMessage message={dbResult} /> }
      </form>        
    );
}
export default Signup;