import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Signup() {
    const { signUp } = useAuth()
    const navigate = useNavigate()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)
        try {
            await signUp(email, password)
            setSuccess(true)
            setTimeout(() => navigate("/login"), 3000)
        } catch (err) {
            setError(err.message)
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen px-4">
            <form onSubmit={handleSubmit} className="form-container">
                <div className="text-center mb-2">
                    <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
                    <p className="text-gray-600 mt-2">Start your journey to U.S. citizenship</p>
                </div>

                <div className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="input-field"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input-field pr-20"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-s text-indigo-600 hover:text-indigo-900 font-medium hover:scale-110 inline-block transition-transform duration-200"
                            >
                                {showPassword ? "Hide" : "Show"}
                            </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            Must be at least 6 characters
                        </p>
                    </div>
                </div>

                {error && <p className="error-text">{error}</p>}
                
                {success && (
                    <p className="success-text">
                        ✓ Check your email for a confirmation link! Redirecting to login...
                    </p>
                )}

                <button 
                    type="submit" 
                    className="button-primary mt-2"
                    disabled={success}
                >
                    {success ? "Account Created!" : "Sign Up"}
                </button>

                <p className="text-center text-sm text-gray-600 mt-4">
                    Already have an account?{" "}
                    <button
                        type="button"
                        onClick={() => navigate("/login")}
                        className="text-indigo-600 hover:text-indigo-700 font-semibold hover:scale-110 inline-block transition-transform duration-200"
                    >
                        Sign in
                    </button>
                </p>
            </form>
        </div>
    )
}