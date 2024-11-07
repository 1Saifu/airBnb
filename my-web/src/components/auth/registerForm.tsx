"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import LocalStorageKit from "@/utils/localStorageKit";
import './style/form.css'

const registerForm: React.FC = () => {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter(); 

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
            });
    
            const data = await response.json();
    
            if (response.ok) {
                console.log("New registered user:", data);

                LocalStorageKit.set('@library/token', data.token);
                LocalStorageKit.set('@library/userId', data.userId);
                LocalStorageKit.set("@library/customerId", data.userId);
                LocalStorageKit.set('@library/isAdmin', JSON.stringify(data.isAdmin)); 


                console.log('Token stored:', data.token); 
                console.log('User ID stored:', data.userId);
                console.log('Customer ID stored:', data.userId);

                router.push('/');
            } else {
                console.error(data.message);
            }
        } catch (error) {
            console.error("Registration failed:", error);
        }
    };

    return(
        <form onSubmit={handleSubmit} className="form2">
        <h2>Register</h2>
        <div>
            <label>Name:</label>
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
            />
        </div>
        <div>
            <label>Email:</label>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
        </div>
        <div>
            <label>Password:</label>
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
        </div>
        <button type="submit">Register</button>
        <p>Already have an account? <Link href="/login" className="custom-link">Login here</Link></p>
    </form>
    )
}

export default registerForm;