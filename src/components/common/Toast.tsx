import { X } from "lucide-react";

export interface ToastProps {
    toast: { msg: string; ok: boolean } | null;
    onClose: () => void;
}

export default function Toast({ toast, onClose }: ToastProps) {
    if (!toast) return null;
    
    return (
        <div className={`flex items-center justify-between gap-3 px-5 py-3 rounded-2xl text-sm font-medium border animate-[fadeSlideUp_0.2s_ease] ${toast.ok ? "bg-green-50 border-green-200 text-green-700" : "bg-red-50 border-red-200 text-red-600"}`}>
            <span>{toast.msg}</span>
            <button onClick={onClose} className="p-1 rounded-lg hover:bg-black/5 transition-colors">
                <X size={14} />
            </button>
        </div>
    );
}
