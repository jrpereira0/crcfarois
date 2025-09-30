"use client";

import { useEffect } from "react";
import { CheckCircle, AlertCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ToastProps {
  message: {
    type: "success" | "error";
    text: string;
  };
  onClose: () => void;
  autoClose?: boolean;
  duration?: number;
}

export function Toast({
  message,
  onClose,
  autoClose = true,
  duration = 5000,
}: ToastProps) {
  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, onClose]);

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm">
      <div
        className={cn(
          "p-4 rounded-lg shadow-lg border flex items-center gap-3 animate-in slide-in-from-right duration-300",
          message.type === "success"
            ? "bg-green-50 border-green-200 text-green-700"
            : "bg-red-50 border-red-200 text-red-700"
        )}
      >
        {message.type === "success" ? (
          <CheckCircle className="h-5 w-5 flex-shrink-0" />
        ) : (
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
        )}
        <span className="text-sm font-medium flex-1">{message.text}</span>
        <button
          onClick={onClose}
          className="ml-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
