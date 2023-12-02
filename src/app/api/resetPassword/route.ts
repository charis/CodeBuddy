// Library imports
import { NextRequest, NextResponse } from 'next/server';
// Custom imports
import { validateVerificationToken } from "@/util/ServerActions";

export async function POST(request: NextRequest): Promise<NextResponse> {
    try {
        const { token } = await request.json();
        console.log(token);

        const validToken = await validateVerificationToken(token);

        if (!validToken) {
            return NextResponse.json(
                {error: 'Invalid token'},
                {status: 400 }
            );
        }

        // The user is verified
        return NextResponse.json({
            message: 'Email verified successfully',
            success: true
        }); 
        
    }
    catch (error: any) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        ); 
    }
}