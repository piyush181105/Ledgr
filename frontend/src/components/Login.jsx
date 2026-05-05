import React, { useState } from 'react'
import { loginStyles } from '../assets/dummyStyles'
import { Mail, User, Lock, Eye, EyeOff } from 'lucide-react'
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

const Login = ({ onLogin }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    //to fetch profile
    const fetchProfile = async (token) => {
        if (!token) return null;
        const res = await axios.get(`${API_URL}/api/user/me`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return res.data;
    };

    const persistAuth = (profile, tokenValue) => {
        // If tokenValue is accidentally a boolean, this will catch it
        if (!tokenValue || tokenValue === true || tokenValue === "true") {
            console.error("BLOCKING: Attempted to save a boolean as a token.");
            return;
        }

        const storage = rememberMe ? localStorage : sessionStorage;

        try {
            storage.setItem("token", tokenValue); // Saves the actual string
            if (profile) storage.setItem("user", JSON.stringify(profile));
        } catch (err) {
            console.error("Storage Error:", err);
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("DEBUG: Email state is:", email); // See if it's actually blank
        console.log("DEBUG: Password state is:", password);
        setIsLoading(true);
        try {
            const res = await axios.post(`${API_URL}/api/user/login`, { email, password });

            // 1. Get the real token and user from the response
            const { token, user } = res.data;

            // 2. Pass ONLY these to persistAuth
            persistAuth(user || { email }, token);

            navigate("/");
        } catch (err) {
            setError("Login failed");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={loginStyles.pageContainer}>
            {/* LEFT SIDE: Sidebar */}
            <div className={loginStyles.sidebar}>
                <div>
                    <h2 className="text-2xl font-bold mb-12">Finwise AI</h2>
                    <h1 className={loginStyles.sidebarTitle}>Take control of your money, faster.</h1>
                    <p className={loginStyles.sidebarSubtitle}>AI-insights. Seamless tracking.</p>
                </div>
                {/* You can put an image of your dashboard here */}
            </div>

            {/* RIGHT SIDE: Login Form */}
            <div className={loginStyles.formWrapper}>
                <div className={loginStyles.cardContainer}>
                    <h1 className={loginStyles.headerTitle}>Welcome back</h1>
                    <p className={loginStyles.headerSubtitle}>Sign in to your account to continue</p>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-6">
                            <label className={loginStyles.label}>Email</label>
                            <input
                                type="email"
                                id="email"
                                value={email} // This must match your useState
                                onChange={(e) => setEmail(e.target.value)} // This must match your useState setter
                                className={loginStyles.input}
                                placeholder="name@company.com"
                                required
                            />
                        </div>

                        <div className="mb-6">
                            <label className={loginStyles.label}>Password</label>
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={loginStyles.passwordInput}
                                placeholder="Enter your password"
                                required
                            />
                        </div>

                        <button type="submit" className={loginStyles.button}>Sign in</button>
                    </form>

                    <div className="mt-6 text-center text-gray-500 text-sm">
                        or continue with
                    </div>

                    <button className="w-full mt-4 py-3 border border-gray-300 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50">
                        <img src="/google-icon.png" className="w-5 h-5" alt="Google" />
                        Continue with Google
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Login;
