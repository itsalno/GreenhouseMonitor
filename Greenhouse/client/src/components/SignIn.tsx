import {authClient} from "../apiControllerClients.ts";
import toast from "react-hot-toast";
import {useAtom} from "jotai";
import {JwtAtom} from "../atoms.ts";
import React, {useState} from "react";

export default function SignIn() {
    const [jwt, setJwt] = useAtom(JwtAtom);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    // mode state is now only for styling
    const [mode, setMode] = useState<'login' | 'register'>('login');

    const handleAuth = async (action: 'login' | 'register') => {
        setLoading(true);
        try {
            const res = action === 'login'
                ? await authClient.login({ email, password })
                : await authClient.register({ email, password });
            toast.success("Welcome!");
            localStorage.setItem('jwt', res.jwt);
            setJwt(res.jwt);
        } catch (err: any) {
            toast.error(err?.message || "Authentication failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            {(jwt == null || jwt.length < 1) ? (
                <div className="w-full max-w-xs flex flex-col gap-4">
                    <input
                        className="input input-bordered w-full"
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        autoComplete="username"
                    />
                    <input
                        className="input input-bordered w-full"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        autoComplete="current-password"
                    />
                    <div className="flex gap-2">
                        <button
                            className={`btn btn-primary flex-1${mode === 'login' ? '' : ' btn-outline'}`}
                            disabled={loading}
                            onClick={() => { setMode('login'); handleAuth('login'); }}
                        >
                            Login
                        </button>
                        <button
                            className={`btn btn-secondary flex-1${mode === 'register' ? '' : ' btn-outline'}`}
                            disabled={loading}
                            onClick={() => { setMode('register'); handleAuth('register'); }}
                        >
                            Register
                        </button>
                    </div>
                </div>
            ) : (
                <>
                    <h1 className="textarea-xl">You are already signed in.</h1>
                    <button className="btn btn-secondary" onClick={() => {
                        localStorage.setItem('jwt', '');
                        setJwt('');
                        toast("You have been signed out")
                    }}>Click here to sign out</button>
                </>
            )}
        </div>
    );
}