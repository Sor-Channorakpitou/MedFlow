import { Mail, Lock, Shield, BriefcaseMedical, Eye, EyeOff, Loader2, AlertCircle, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function AuthCard() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    // Prevent default HTML form submission reload
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setError("");

    try {
      const user = await login({ email, password });
      const roleName = user?.role?.name ?? user?.role;
      if (!roleName) throw new Error("Unknown role");

      navigate(`/${roleName.toLowerCase()}`);
    } catch (err) {
      console.error(err);

      if (err.response?.status === 401) {
        setError("Incorrect email or password.");
      } else if (err.response?.status === 500) {
        setError("Server error. Please try again or contact support.");
      } else {
        setError("Unable to sign in. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white w-full max-w-md border rounded-lg shadow-sm p-8">
      <div className="flex justify-center mb-4">
        <div className="bg-slate-900 p-3 rounded-xl">
          <BriefcaseMedical className="text-white" />
        </div>
      </div>

      <h2 className="text-3xl font-bold text-center text-slate-900">
        Log In to your clinic
      </h2>

      <p className="text-center text-gray-500 mt-2">
        Access the MedFlow clinical network
      </p>

      {/* Changed container to a semantic form element */}
      <form onSubmit={handleLogin} className="mt-8 space-y-5">

        {/* Error Alert */}
        {error && (
          <div role="alert" className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
            <AlertCircle size={20} className="mt-0.5 shrink-0" />

            <div className="flex-1">
              <p className="font-semibold">Login Failed</p>
              <p className="text-sm">{error}</p>
            </div>

            <button
              type="button"
              onClick={() => setError("")}
              className="text-red-500 hover:text-red-700 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        )}

        {/* Email */}
        <div>
          <label htmlFor="email" className="font-medium block mb-2 text-sm text-gray-700">
            Work Email
          </label>

          <div className="flex border rounded-md items-center bg-white focus-within:ring-2 focus-within:ring-slate-900 focus-within:border-slate-900 transition-shadow">
            <div className="pl-3 pr-2 flex items-center text-gray-400">
              <Mail size={18} />
            </div>

            <input
              id="email"
              type="email"
              value={email}
              disabled={loading}
              required
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 p-3 outline-none text-sm bg-transparent disabled:bg-gray-100 rounded-r-md"
              placeholder="doctor@medflow.com"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="font-medium block mb-2 text-sm text-gray-700">
            Password
          </label>

          <div className="flex border rounded-md items-center bg-white focus-within:ring-2 focus-within:ring-slate-900 focus-within:border-slate-900 transition-shadow">
            <div className="pl-3 pr-2 flex items-center text-gray-400">
              <Lock size={18} />
            </div>

            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              disabled={loading}
              required
              onChange={(e) => setPassword(e.target.value)}
              className="flex-1 p-3 outline-none text-sm bg-transparent disabled:bg-gray-100"
              placeholder="••••••••"
            />

            <button
              type="button"
              disabled={loading}
              onClick={() => setShowPassword(!showPassword)}
              className="px-3 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
              tabIndex="-1" // Skips tab indexes so users focus straight into the Log In button
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Submit Button changed to type="submit" */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-slate-900 text-white py-3 rounded-md font-medium flex items-center justify-center gap-2 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Signing in...
            </>
          ) : (
            <>Log In</>
          )}
        </button>

        <div className="flex justify-center">
          <div className="flex items-center gap-2 border rounded-full px-4 py-2 text-xs text-gray-500 bg-gray-50">
            <Shield size={14} />
            Protected by MedFlow Secure Auth
          </div>
        </div>
      </form>
    </div>
  );
}