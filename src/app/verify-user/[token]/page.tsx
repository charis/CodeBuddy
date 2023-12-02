"use client";
// Library imports
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
// Custom imports
import { validateVerificationToken } from "@/util/ServerActions";

type VerifyUserProps = {
    params: {
        token: string
    }
};

const VerifyUser:React.FC<VerifyUserProps> = ({params}) => {
    /**
     * {@code true} if verification token is valid and has not
     * expired, {@code false} if the verification token is
     * invalid or has expired and {@code null} initially/before
     * validation.
     */
    const [verified, setVerified] = useState<boolean | null>(null);

    /**
     * Validates the user token.
     * 
     * @param token The token to validate
     */
    async function validateToken(token: string) {
        const validToken = await validateVerificationToken(token);
        setVerified(validToken);
    }

    useEffect(() => { // Called when the page loads since we are passing the params
        validateToken(params.token);
    }, [params]);

    return (
        <main className="bg-gradient-to-b from-gray-600 to-black min-h-screen">
          <nav className="relative flex h-[50px] w-full shrink-0 items-center px-5 bg-dark-layer-1 text-dark-gray-7">
            <div className="flex w-full items-center justify-between mx-auto">
              <Link href="/">
                <Image src="/images/logo-large.png" alt="CodeBuddy" height={170} width={170} />
              </Link>
            </div>
          </nav>
          {verified &&
             <div className="flex flex-col items-center justify-center min-h-screen py-2">
               <Image src="/images/email-verified.png"
                      alt="Verified Email image"
                      height={200}
                      width={200}
               />
               <h1 className="mt-2 p-2 text-2xl text-white center">Email Verified</h1>
               <h2 className="text-lg text-white">Your email address was successfully verified</h2>
               <Link className="mt-4 px-4 py-2 text-lg rounded-lg bg-green-600 hover:bg-green-500 text-white" href='/auth'>CONTINUE</Link>
             </div>
           }
           {verified === false &&
             <div className="flex flex-col items-center justify-center min-h-screen py-2">
               <Image src="/images/error.png"
                      alt="Error image"
                      height={200}
                      width={200}
               />
               <h1 className="mt-2 p-2 text-xl rounded-lg bg-red-600 text-white">Your token has expired or is invalid</h1>
               <div className="flex flex-row items-center justify-center py-4">
                 <div className="mx-2 px-4 py-2 text-lg rounded-lg bg-gray-600 hover:bg-gray-500 text-white cursor-pointer" onClick={() => window.location.reload()}>Retry</div>
                 <Link className="mx-2 px-4 py-2 text-lg rounded-lg bg-gray-600 hover:bg-gray-500 text-white" href='/auth'>Abort</Link>
               </div>
             </div>
           }
        </main>        
    );
}

export default VerifyUser;