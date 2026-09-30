import type { Toast } from "@/modules/dashboard/types";

export function ToastContainer({ toasts }: { toasts: Toast[] }) {
  return (
    <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`animate-fade-slide-up flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg text-sm font-medium ${
            t.type === "success"
              ? "bg-gray-900 text-white"
              : "bg-red-600 text-white"
          }`}
        >
          {t.type === "success" ? (
            <svg
              className="w-4 h-4 text-green-400 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          ) : (
            <svg
              className="w-4 h-4 text-white flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          )}
          {t.message}
        </div>
      ))}
    </div>
  );
}
