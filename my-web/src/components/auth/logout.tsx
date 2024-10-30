"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import LocalStorageKit from "@/utils/localStorageKit";

const Logout: React.FC = () => {
    const router = useRouter();

    const handleLogout = () => {
        LocalStorageKit.remove('@library/token'); 
        router.push('/'); 
        window.location.reload();
    };

    return (
        <button onClick={handleLogout} className="cursor-pointer text-white hover:text-gray-300">Logout</button>
    );
};

export default Logout;
