// Library imports
import prismaInstance from '@/app/lib/prisma';
import * as bcrypt from 'bcrypt'; // Install: 'npm i bcrypt' followed by 'npm i --save-dev @types/bcrypt'
import { NextRequest, NextResponse } from 'next/server';
import { HOST_URL } from "@/constants";

type RequestBody = {
    username: string;
    password: string;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
    const body:RequestBody = await request.json();
    
    // Look up the user with the provided email as username
    const user = await prismaInstance.user.findFirst({
        where: {
            email: body.username
        }
    });

    // Make sure that the user exists
    if (!user) {
        return NextResponse.json(null);
    }

    // Make sure that the user is verified
    if (!user.isVerified) {
        return NextResponse.json(null);
    }

    // Check the encrypted password if the user exists
    if (await bcrypt.compare(body.password, user.password)) {
        // Extract the user without the password from the user object
        const { password, ...userWithoutPassword } = user;
        
        return NextResponse.json(userWithoutPassword);
    }
    else { // Invalid Password
        return NextResponse.json(null);
    }
};