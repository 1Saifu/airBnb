"use client"; 

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import '../../app/globals.css'
import LocalStorageKit from "@/utils/localStorageKit";
import Logout from '../auth/logout';

const Navbar: React.FC = () => {
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const storedToken = LocalStorageKit.get('@library/token');
        setToken(storedToken);
    }, []);

    return (
        <nav className="navbar">
            <Link href="/">AIRBNB.com</Link>
            <div>
                <Link href="/">Home</Link>
                <Link href="/properties">Properties</Link>
                <Link href="/bookings">bookings</Link>
                {!token ? (
                    <>
                        <Link href="/login">Login</Link>
                        <Link href="/register">Register</Link>
                    </>
                ) : (
                    <>
                        <Logout />
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar;