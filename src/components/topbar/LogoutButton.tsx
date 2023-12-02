"use client"
// Library imports
import { signOut } from 'next-auth/react';
import { FiLogOut } from 'react-icons/fi';

type LogoutButtonProps = {};

const LogoutButton:React.FC<LogoutButtonProps> = () => {
    return (
        <button className="bg-dark-fill-3 py-1.5 px-3 cursor-pointer roudned text-white"
                onClick={() => signOut({ callbackUrl: '/'})}
        >
            <FiLogOut />
        </button>
    );
}
export default LogoutButton;