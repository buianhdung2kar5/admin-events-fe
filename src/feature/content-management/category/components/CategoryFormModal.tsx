import { useState } from "react";
import { X, Tag } from "lucide-react";
import { CategoryItem } from "../data/CategoryMockData";

interface Props {
    category: CategoryItem | null;
    mode: "create" | "edit";
    onClose: () => void;
}

export default function CategoryFormModal({ category, mode, onClose }: Props) {
    const [name, setName] = useState(category?.name || "");
    const [description, setDescription] = useState(category?.description || "");
    const [slug, setSlug] = useState(category?.slug || "");

    const generateSlug = (value: string) => {
        return value
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/đ/g, "d")
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9-]/g, "");
    };

    const handleNameChange = (value: string) => {
        setName(value);
        if (mode === "create") {
            setSlug(generateSlug(value));
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

            <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md flex flex-col overflow-hidden animate-[zoomIn_0.2s_ease]">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                    <div className="flex flex-col gap-1">
                        <h2 className="text-lg font-bold text-gray-800">
                            {mode === "create" ? "Tạo danh mục mới" : "Chỉnh sửa danh mục"}
                        </h2>
                        <p className="text-xs text-gray-500">Cấu hình thông tin danh mục sự kiện</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                {/* Form */}
                <div className="p-6 flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-gray-600 uppercase tracking-wide">
                            Tên danh mục <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => handleNameChange(e.target.value)}
                            placeholder="VD: Công nghệ, Thể thao..."
                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#0092B8] focus:ring-2 focus:ring-[#0092B8]/20 transition-all"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-gray-600 uppercase tracking-wide">
                            Slug (URL)
                        </label>
                        <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden focus-within:border-[#0092B8] focus-within:ring-2 focus-within:ring-[#0092B8]/20 transition-all">
                            <span className="px-3 py-2.5 bg-gray-50 text-gray-400 text-sm font-mono border-r border-gray-200">/categories/</span>
                            <input
                                type="text"
                                value={slug}
                                onChange={(e) => setSlug(e.target.value)}
                                placeholder="cong-nghe"
                                className="flex-1 px-4 py-2.5 text-sm font-mono outline-none bg-white text-gray-700"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-gray-600 uppercase tracking-wide">
                            Mô tả
                        </label>
                        <textarea
                            rows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Mô tả ngắn gọn về danh mục này..."
                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#0092B8] focus:ring-2 focus:ring-[#0092B8]/20 transition-all resize-none"
                        />
                    </div>

                    {mode === "edit" && (
                        <div className="mt-1 flex items-start gap-2.5 px-4 py-3 bg-amber-50 rounded-xl border border-amber-100">
                            <Tag size={14} className="text-amber-500 mt-0.5 shrink-0" />
                            <p className="text-xs text-amber-700 font-medium leading-relaxed">
                                Để quản lý các <strong>Options</strong> của danh mục, hãy bấm nút <strong>"Xem Options"</strong> ở bảng danh sách.
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/50">
                    <button onClick={onClose} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-200/50 transition-colors">
                        Hủy
                    </button>
                    <button
                        onClick={onClose}
                        disabled={!name.trim()}
                        className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#0092B8] hover:bg-[#007a99] transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {mode === "create" ? "Tạo danh mục" : "Lưu thay đổi"}
                    </button>
                </div>
            </div>
        </div>
    );
}
