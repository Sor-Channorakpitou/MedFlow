import AuthCard from "../components/AuthCard"; 
import logo from "../assets/medflow-logo.jpg";

export default function LoginPage() { 


  return (
    <div className="min-h-screen flex">
      {/* Left Side */}
      <div className="w-1/2 bg-gradient-to-br from-gray-400 via-teal-600 to-cyan-400 relative overflow-hidden">
        <div className="absolute top-6  p-2  ">
          <img
            src= {logo}
            alt="MedFlow"
            className="w-64"
          />
        </div>

        {/* Floating dots */}
        <div className="absolute top-64 left-32 w-4 h-4 bg-teal-900 rounded-full" />
        <div className="absolute top-96 left-72 w-3 h-3 bg-cyan-200 rounded-full" />
        <div className="absolute bottom-40 left-48 w-4 h-4 bg-cyan-200 rounded-full" />
        <div className="absolute bottom-32 right-48 w-5 h-5 bg-teal-900 rounded-full" />

        <div className="absolute bottom-20 left-8 text-white max-w-lg">
          <h1 className="text-4xl font-bold mb-4">
            Secure Clinical Orchestration
          </h1>

          <p className="text-lg text-teal-100">
            Centralized multi-tenant routing for healthcare
            providers. Ensuring compliance, speed, and reliability
            across synchronized clinical workflows.
          </p>
        </div>
      </div>

      {/* Right Side */}
      <div className="w-1/2 flex items-center justify-center bg-gray-50">
        <AuthCard />
      </div>
    </div>
  );
}