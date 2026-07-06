import { Building2, Mail, Lock, Shield, BriefcaseMedical } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { getCurrentUser } from "../../services/authAPI";
import { useAuth } from "../../hooks/useAuth";

export default function AuthCard() {  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => { 
    setLoading(true);
    setError("");
    
    try {
      // 1. Authenticate and set tokens
      await login({ email, password });
    
      // 2. Fetch the logged-in user profile
      const res = await getCurrentUser();
      console.log("User retrieved successfully:", res);
      
      const role = res?.user?.role?.name;

      if (role) {
        // 3. Clear any remaining login errors before moving
        setError("");
        // 4. Clean navigate to the dashboard
        navigate(`/${role.toLowerCase()}`, { replace: true });
      } else {
        setError("User role not found.");
      }

    } catch (err) { 
      console.error("Login failed:", err);
      setError(err.message || "Invalid credentials");
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
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 p-3 outline-none"
              placeholder="doctor@medflow.com"
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <label className="font-medium">
              Password
            </label>
            
          </div>

          <div className="flex border rounded-md">
            <div className="px-3 flex items-center">
              <Lock size={18} />
            </div>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="flex-1 p-3 outline-none"
              placeholder="••••••••"
            />
          </div>
        </div>

        <button className="w-full bg-slate-900 text-white py-3 rounded-md font-medium" onClick={handleLogin}>
          Log In →
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