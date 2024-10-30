"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import './style/form.css'
import LocalStorageKit from "@/utils/localStorageKit";

const loginForm: React.FC = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
            const data = await response.json();
                LocalStorageKit.set('@library/token', data.token);
                router.push('/');
        } else {
            console.error('Login failed');
        }
    };

    return(
        <form onSubmit={handleSubmit} className="form1">
        <h2>Login</h2>
        <div>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Email Address"
            />
        </div>
        <div>
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Password"
            />
        </div>
        <button type="submit">Login</button>
        <p>Don't have an account? <Link href="/register" className="custom-link">Register here</Link></p>
    </form>
    )
}

export default loginForm;