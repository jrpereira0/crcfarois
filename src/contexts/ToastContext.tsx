"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react";
import {
  CheckCircle,
  AlertCircle,
  Info,
  X,
  ShoppingCart,
  Plus,
} from "lucide-react";
import Image from "next/image";

interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info" | "cart";
  duration?: number;
  product?: {
    title: string;
    image?: string;
    quantity: number;
  };
}

interface ToastContextType {
  toasts: Toast[];
  showToast: (
    message: string,
    type?: "success" | "error" | "info" | "cart",
    duration?: number,
    product?: Toast["product"]
  ) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    (
      message: string,
      type: "success" | "error" | "info" | "cart" = "success",
      duration: number = 3000,
      product?: Toast["product"]
    ) => {
      const id = Math.random().toString(36).substr(2, 9);
      const newToast: Toast = { id, message, type, duration, product };

      setToasts((prev) => [...prev, newToast]);

      // Haptic feedback para mobile em toasts de carrinho
      if (type === "cart" && "vibrate" in navigator) {
        navigator.vibrate([50, 30, 50]); // Padrão: vibrar-pausa-vibrar
      }

      // Auto remove after duration
      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
}

function ToastContainer({
  toasts,
  removeToast,
}: {
  toasts: Toast[];
  removeToast: (id: string) => void;
}) {
  if (toasts.length === 0) return null;

  return (
    <>
      {/* Desktop Toast Container */}
      <div className="hidden md:block fixed bottom-4 right-4 z-50 space-y-2 max-w-sm">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </div>

      {/* Mobile Toast Container */}
      <div className="md:hidden fixed top-20 left-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <ToastItem
            key={toast.id}
            toast={toast}
            onRemove={removeToast}
            isMobile
          />
        ))}
      </div>
    </>
  );
}

function ToastItem({
  toast,
  onRemove,
  isMobile = false,
}: {
  toast: Toast;
  onRemove: (id: string) => void;
  isMobile?: boolean;
}) {
  const getIcon = () => {
    switch (toast.type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      case "info":
        return <Info className="h-5 w-5 text-blue-600" />;
      case "cart":
        return <ShoppingCart className="h-5 w-5 text-primary" />;
    }
  };

  const getStyles = () => {
    switch (toast.type) {
      case "success":
        return "bg-green-50 border-green-200 text-green-800";
      case "error":
        return "bg-red-50 border-red-200 text-red-800";
      case "info":
        return "bg-blue-50 border-blue-200 text-blue-800";
      case "cart":
        return "bg-primary/5 border-primary/20 text-primary";
    }
  };

  // Toast especial para carrinho
  if (toast.type === "cart" && toast.product) {
    return (
      <div
        className={`flex items-start gap-3 p-4 rounded-xl border-2 shadow-xl bg-white border-primary/20 ${
          isMobile
            ? "w-full toast-enter-mobile"
            : "min-w-[350px] max-w-[400px] toast-enter-desktop"
        }`}
      >
        {/* Produto Image */}
        <div className="relative w-12 h-12 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
          {toast.product.image ? (
            <Image
              src={toast.product.image}
              alt={toast.product.title}
              fill
              className="object-contain p-1"
              sizes="48px"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ShoppingCart className="h-6 w-6 text-gray-300" />
            </div>
          )}
        </div>

        {/* Conteúdo */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span className="text-sm font-semibold text-gray-900">
              Adicionado ao carrinho!
            </span>
          </div>
          <h4 className="text-sm font-medium text-gray-900 truncate mb-1">
            {toast.product.title}
          </h4>
          <div className="text-xs text-gray-500">
            {toast.product.quantity}{" "}
            {toast.product.quantity === 1 ? "unidade" : "unidades"}
          </div>
        </div>

        {/* Ações */}
        <div className="flex flex-col gap-2">
          <button
            onClick={() => (window.location.href = "/b2b/carrinho")}
            className="text-xs bg-primary text-white px-3 py-1.5 rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            Ver Carrinho
          </button>
          <button
            onClick={() => onRemove(toast.id)}
            className="text-gray-400 hover:text-gray-600 transition-colors self-center"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  // Toast normal
  return (
    <div
      className={`flex items-center gap-3 p-4 rounded-lg border shadow-lg ${
        isMobile
          ? "w-full toast-enter-mobile"
          : "min-w-[300px] toast-enter-desktop"
      } ${getStyles()}`}
    >
      {getIcon()}
      <span className="flex-1 text-sm font-medium">{toast.message}</span>
      <button
        onClick={() => onRemove(toast.id)}
        className="text-gray-400 hover:text-gray-600 transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast deve ser usado dentro de um ToastProvider");
  }
  return context;
}
