import { Building2, Mail, Lock, Shield, BriefcaseMedical } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AuthCard() {  
    const navigate = useNavigate();

    const handleForgotPassword = () => {
        navigate("/medflowSupport");
    };

    const handleLogin = () => { 
        navigate("/ReceptionistDash");
    }

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
            Clinic Domain
          </label>

          <div className="flex border rounded-md overflow-hidden">
            <div className="px-3 flex items-center bg-gray-50">
              <Building2 size={18} />
            </div>

            <input
              className="flex-1 p-3 outline-none"
              placeholder="cityclinic"
            />

            <span className="px-3 flex items-center text-gray-500">
              .medflow.com
            </span>
          </div>
        </div>

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
              className="flex-1 p-3 outline-none"
              placeholder="doctor@clinic.com"
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <label className="font-medium">
              Password
            </label>

            <button 
                className="text-teal-600 text-sm" 
                onClick={handleForgotPassword}
            >
              Forgot password?
            </button>
            
          </div>

          <div className="flex border rounded-md">
            <div className="px-3 flex items-center">
              <Lock size={18} />
            </div>

            <input
              type="password"
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