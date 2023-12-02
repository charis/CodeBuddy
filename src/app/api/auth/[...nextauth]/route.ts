// Library imports
import NextAuth from 'next-auth';
// Custom imports
import { options } from "./options";

const handler = NextAuth(options);

export { handler as GET, handler as POST };
