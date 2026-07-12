import AuthCard from "../components/layout/AuthCard"; 
import logo from "../assets/medflow-logo.jpg";

export default function LoginPage() { 
  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Left Side: Hidden on mobile/tablet (below 1024px), shown on lg+ */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-gray-400 via-teal-600 to-cyan-400 relative overflow-hidden">
        <div className="absolute top-6 p-2">
          <img src={logo} alt="MedFlow" className="w-96 " />
        </div>

        {/* Ambient Structural Graphics */}
        <div className="absolute top-64 left-32 w-4 h-4 bg-teal-900/40 rounded-full blur-xs" />
        <div className="absolute top-96 left-72 w-3 h-3 bg-cyan-200/50 rounded-full blur-xs" />
        <div className="absolute bottom-40 left-48 w-4 h-4 bg-cyan-200/30 rounded-full blur-xs" />
        <div className="absolute bottom-32 right-48 w-5 h-5 bg-teal-900/40 rounded-full blur-xs" />

        <div className="absolute bottom-20 left-8 text-white max-w-lg px-8">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Secure Clinical Orchestration
          </h1>
          <p className="text-lg text-teal-100/90 leading-relaxed">
            Centralized multi-tenant routing for healthcare providers. Ensuring compliance, speed, and reliability across synchronized clinical workflows.
          </p>
        </div>
      </div>

      {/* Right Side: Full width on mobile, 1/2 width on lg+ */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4">
        <AuthCard />
      </div>
    </div>
  );
}