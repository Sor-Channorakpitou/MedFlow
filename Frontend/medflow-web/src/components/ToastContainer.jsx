import { CheckCircle2, XCircle, X } from "lucide-react";

export default function ToastContainer({ toasts, onDismiss }) {
  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 items-end">
      {toasts.map((toast) => {
        const isError = toast.type === "error";
        const Icon = isError ? XCircle : CheckCircle2;

        return (
          <div
            key={toast.id}
            role="alert"
            className={`flex items-center gap-3 max-w-sm rounded-lg px-4 py-3 shadow-lg text-sm font-medium text-white
              animate-[slideIn_0.25s_ease-out]
              ${isError ? "bg-rose-600" : "bg-emerald-600"}`}
          >
            <Icon size={18} className="shrink-0" />
            <span className="flex-1">{toast.message}</span>
            <button
              onClick={() => onDismiss(toast.id)}
              className="shrink-0 opacity-70 hover:opacity-100 transition-opacity"
              aria-label="Dismiss"
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
}