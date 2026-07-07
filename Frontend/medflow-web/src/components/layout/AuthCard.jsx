import { Mail, Lock, Shield, BriefcaseMedical, Eye, EyeOff, Loader2, AlertCircle, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../../services/authAPI";
import { useAuth } from "../../hooks/useAuth";

export default function AuthCard() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (loading) return;

    setLoading(true);
    setError("");

    try {
      // 1. Authenticate and set tokens
      await login({ email, password });

      const res = await getCurrentUser();
      const role = res?.user?.role?.name;

      navigate(`/${role.toLowerCase()}`);
    } catch (err) {
      console.error(err);

      if (err.response?.status === 401) {
        setError("Incorrect email or password.");
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

      <h2 className="text-3xl font-bold text-center">
        Log In to your clinic
      </h2>

      <p className="text-center text-gray-500 mt-2">
        Access the MedFlow clinical network
      </p>

      <div className="mt-8 space-y-5">

        {/* Error Alert */}
        {error && (
          <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
            <AlertCircle size={20} className="mt-0.5 shrink-0" />

            <div className="flex-1">
              <p className="font-semibold">Login Failed</p>
              <p className="text-sm">{error}</p>
            </div>

            <button
              onClick={() => setError("")}
              className="text-red-500 hover:text-red-700"
            >
              <X size={18} />
            </button>
          </div>
        )}

        {/* Email */}
        <div>
          <label className="font-medium block mb-2">
            Work Email
          </label>

          <div className="flex border rounded-md">
            <div className="px-3 flex items-center">
              <Mail size={18} />
            </div>

            <input
              type="email"
              value={email}
              disabled={loading}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 p-3 outline-none disabled:bg-gray-100"
              placeholder="doctor@medflow.com"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="font-medium block mb-2">
            Password
          </label>

          <div className="flex border rounded-md">
            <div className="px-3 flex items-center">
              <Lock size={18} />
            </div>

            <input
              type={showPassword ? "text" : "password"}
              value={password}
              disabled={loading}
              onChange={(e) => setPassword(e.target.value)}
              className="flex-1 p-3 outline-none disabled:bg-gray-100"
              placeholder="••••••••"
            />

            <button
              type="button"
              disabled={loading}
              onClick={() => setShowPassword(!showPassword)}
              className="px-3 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Login Button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-slate-900 text-white py-3 rounded-md font-medium flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
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
          <div className="flex items-center gap-2 border rounded-full px-4 py-2 text-sm text-gray-500">
            <Shield size={16} />
            Protected by MedFlow Secure Auth
          </div>
        </div>
      </div>
    </div>
  );
}