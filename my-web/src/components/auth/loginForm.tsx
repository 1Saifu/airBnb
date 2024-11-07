"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import './style/form.css'
import LocalStorageKit from "@/utils/localStorageKit";

const loginForm: React.FC = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
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
            console.log('Response Data:', data);

                LocalStorageKit.set('@library/token', data.token);
                LocalStorageKit.set('@library/userId', data.userId);
                LocalStorageKit.set('@library/isAdmin', JSON.stringify(data.isAdmin)); 
                LocalStorageKit.set("@library/customerId", data.userId);

                console.log('Token stored:', data.token); 
                console.log('User ID stored:', data.userId);
                console.log('Admin status stored:', data.isAdmin);
                console.log('Customer ID stored:', data.userId);
                router.push('/');
        } else {
            console.error('Login failed');
            setErrorMessage('Login failed. Please check your email and password.'); 
        }
    };

    return(
        <form onSubmit={handleSubmit} className="form1">
        <h2>Login</h2>
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
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