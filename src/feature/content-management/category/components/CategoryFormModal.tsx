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
    const [type, setType] = useState(category?.type || "");

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

            <div className="relative bg-white rounded-xl shadow-xl w-full max-w-sm flex flex-col overflow-hidden">
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
                    {/* Tên danh mục */}
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-gray-600 uppercase tracking-wide">
                            Tên danh mục <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="VD: Địa điểm, Quy mô, Lĩnh vực..."
                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#0092B8] focus:ring-2 focus:ring-[#0092B8]/20 transition-all"
                        />
                    </div>

                    {/* Type danh mục */}
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-gray-600 uppercase tracking-wide">
                            TYPE <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={type}
                            onChange={(e) => setType(e.target.value.toUpperCase())}
                            placeholder="VD: LOCATION, DOMAIN..."
                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#0092B8] focus:ring-2 focus:ring-[#0092B8]/20 transition-all uppercase"
                        />
                        <p className="text-[10px] text-gray-400 font-medium italic">Chú thích: Nhập tên của danh mục bằng tiếng Anh, viết liền không dấu.</p>
                    </div>

                    {mode === "edit" && (
                        <div className="flex items-start gap-2.5 px-4 py-3 bg-amber-50 rounded-xl border border-amber-100">
                            <Tag size={14} className="text-amber-500 mt-0.5 shrink-0" />
                            <p className="text-xs text-amber-700 font-medium leading-relaxed">
                                Để quản lý <strong>Options</strong> của danh mục, hãy bấm nút <strong>"Xem Options"</strong> ở bảng danh sách.
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
                        disabled={!name.trim() || !type.trim()}
                        className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#0092B8] hover:bg-[#007a99] transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {mode === "create" ? "Tạo danh mục" : "Lưu thay đổi"}
                    </button>
                </div>
            </div>
        </div>
    );
}
