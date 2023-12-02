"use client";

type errorProps = {
    error: Error; // Type 'Error' represents the built-in Error class in TypeScript
};

const error:React.FC<errorProps> = ({error}) => {
    return (
        <main className="bg-dark-layer-2 min-h-screen">
          <div className="max-w-[1200px] mx-auto sm:w-3/12 w-full animate-pulse sm:pt-20">
            <div className="flex p-4 mb-4 text-white bg-gradient-to-br from-red-400 to-red-600 rounded-lg"
                 role="alert"
            >
              <svg className="inline flex-shrink-0 mr-3 w-5 h-5"
                   fill="currentColor"
                   viewBox="0 0 20 20"
                   xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clip-rule="evenodd"/>
              </svg>
              <div>
                <span className="font-large">{error.message}</span>
              </div>
            </div>
          </div>
        </main>
    );
}
export default error;