import {authClient} from "../apiControllerClients.ts";
import toast from "react-hot-toast";
import {useAtom} from "jotai";
import {JwtAtom} from "../atoms.ts";
import React, {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom"; 
import { DashboardRoute } from "../routeConstants.ts"; 

export default function SignIn() {
    const [jwt, setJwt] = useAtom(JwtAtom);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [mode, setMode] = useState<'login' | 'register'>('login');
    const navigate = useNavigate(); 

    useEffect(() => {
        const storedJwt = localStorage.getItem('jwt');
        if (jwt || (storedJwt && storedJwt.length > 0)) {
            if (window.location.pathname === "/signin") { 
                 toast.success("Already signed in! Redirecting...");
                 navigate(DashboardRoute);
            }
        }
    }, [jwt, navigate]);

    const handleAuth = async (action: 'login' | 'register') => {
        setLoading(true);
        try {
            const res = action === 'login'
                ? await authClient.login({ email, password })
                : await authClient.register({ email, password });
            
            localStorage.setItem('jwt', res.jwt);
            setJwt(res.jwt);
            toast.success(action === 'login' ? "Login successful!" : "Registration successful!");
            navigate(DashboardRoute); 
        } catch (err: any) {
            toast.error(err?.response?.data?.message || err?.message || "Authentication failed");
        } finally {
            setLoading(false);
        }
    };

    if (jwt && window.location.pathname === "/signin") {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-600 via-green-700 to-green-800 p-4">
                <p className="text-white text-xl">Redirecting to dashboard...</p>
            </div>
        );
    }
    
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-500 via-green-600 to-green-700 p-4">
            <div className="bg-white rounded-xl shadow-2xl p-8 md:p-10 w-full max-w-md">
                <div className="flex flex-col items-center mb-6">
                    <img src="https://cdn-icons-png.flaticon.com/512/2909/2909769.png" alt="Greenhouse Icon" className="w-20 h-20 mb-4 drop-shadow-lg"/>
                    <h1 className="text-3xl font-bold text-green-700">
                        Greenhouse Control
                    </h1>
                    <p className="text-gray-500 mt-1">
                        {mode === 'login' ? "Sign in to monitor your greenhouse" : "Create an account to get started"}
                    </p>
                </div>

                <div className="mb-6 flex border border-gray-300 rounded-lg p-1 bg-gray-100">
                    <button
                        onClick={() => setMode('login')}
                        className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors
                            ${mode === 'login' ? 'bg-green-600 text-white shadow' : 'text-gray-600 hover:bg-gray-200'}`}
                    >
                        Login
                    </button>
                    <button
                        onClick={() => setMode('register')}
                        className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors
                            ${mode === 'register' ? 'bg-green-600 text-white shadow' : 'text-gray-600 hover:bg-gray-200'}`}
                    >
                        Register
                    </button>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); handleAuth(mode); }} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email address
                        </label>
                        <input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            autoComplete="username"
                            required
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-shadow"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            autoComplete={mode === 'login' ? "current-password" : "new-password"}
                            required
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-shadow"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 disabled:opacity-50 flex items-center justify-center"
                    >
                        {loading ? (
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : (mode === 'login' ? 'Sign In' : 'Create Account')}
                    </button>
                </form>
                
                {(jwt && jwt.length > 0 && window.location.pathname === "/signin") && (
                    <div className="mt-6 text-center">
                        <p className="text-gray-600">You are already signed in.</p>
                        <button 
                            className="mt-2 text-sm text-green-600 hover:text-green-700 hover:underline"
                            onClick={() => navigate(DashboardRoute)}
                        >
                            Go to Dashboard
                        </button>
                        <button 
                            className="mt-1 text-sm text-red-600 hover:text-red-700 hover:underline"
                            onClick={() => {
                                localStorage.removeItem('jwt'); 
                                setJwt('');
                                toast.success("You have been signed out.");
                            }}
                        >
                            Sign Out
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}