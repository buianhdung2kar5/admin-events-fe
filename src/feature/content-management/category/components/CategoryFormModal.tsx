import { useState } from "react";
import { X, AlertCircle, Loader2 } from "lucide-react";

import { CATEGORY_NAME_MAX_LENGTH, type CategoryUpsertRequest, type FlatCategory } from "../data/category.types";
import { parseCategoryForm, type CategoryFormValues } from "../categoryForm.schema";

const INDENT = "    ";

interface Props {
    mode: "create" | "edit";
    initialValues: CategoryFormValues;
    /** Danh mục được phép chọn làm cha (khi sửa đã loại chính nó và con cháu). */
    parentOptions: FlatCategory[];
    isSaving: boolean;
    serverError: string | null;
    onClose: () => void;
    onSubmit: (payload: CategoryUpsertRequest) => void;
}

export default function CategoryFormModal({ mode, initialValues, parentOptions, isSaving, serverError, onClose, onSubmit }: Props) {
    const [values, setValues] = useState<CategoryFormValues>(initialValues);
    const [validationError, setValidationError] = useState<string | null>(null);
    const error = validationError ?? serverError;

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const result = parseCategoryForm(values);
        if (!result.ok) {
            setValidationError(result.error);
            return;
        }
        setValidationError(null);
        onSubmit(result.payload);
    };

    const title = mode === "create" ? "Tạo danh mục mới" : "Chỉnh sửa danh mục";
    const submitLabel = mode === "create" ? "Tạo danh mục" : "Lưu thay đổi";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

            <form
                onSubmit={handleSubmit}
                className="relative bg-white rounded-xl shadow-xl w-full max-w-md flex flex-col overflow-hidden"
                aria-labelledby="category-form-title"
            >
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                    <div className="flex flex-col gap-1">
                        <h2 id="category-form-title" className="text-lg font-bold text-gray-800">{title}</h2>
                        <p className="text-xs text-gray-500">Danh mục sự kiện phân cấp cha – con</p>
                    </div>
                    <button type="button" onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors" aria-label="Đóng">
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                <div className="p-6 flex flex-col gap-5">
                    <div className="flex flex-col gap-2">
                        <label htmlFor="category-name" className="text-xs font-bold text-gray-600 uppercase tracking-wide">
                            Tên danh mục <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="category-name"
                            type="text"
                            autoFocus
                            value={values.name}
                            onChange={(e) => setValues((prev) => ({ ...prev, name: e.target.value }))}
                            maxLength={CATEGORY_NAME_MAX_LENGTH}
                            placeholder="VD: Hội thảo & Workshop"
                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#0092B8] focus:ring-2 focus:ring-[#0092B8]/20 transition-all"
                        />
                        <span className="text-[11px] text-gray-400 self-end">{values.name.length}/{CATEGORY_NAME_MAX_LENGTH}</span>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="category-parent" className="text-xs font-bold text-gray-600 uppercase tracking-wide">
                            Danh mục cha
                        </label>
                        <select
                            id="category-parent"
                            value={values.parentCategoryId}
                            onChange={(e) => setValues((prev) => ({ ...prev, parentCategoryId: e.target.value }))}
                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none bg-white focus:border-[#0092B8] focus:ring-2 focus:ring-[#0092B8]/20 transition-all"
                        >
                            <option value="">— Danh mục gốc —</option>
                            {parentOptions.map((item) => (
                                <option key={item.categoryId} value={item.categoryId} title={item.path}>
                                    {INDENT.repeat(item.depth)}{item.name}
                                </option>
                            ))}
                        </select>
                        {mode === "edit" && (
                            <p className="text-[11px] text-gray-400">
                                Không thể chọn chính danh mục này hoặc danh mục con của nó làm cha.
                            </p>
                        )}
                    </div>

                    {error && (
                        <div role="alert" className="flex items-start gap-2 px-4 py-3 bg-red-50 rounded-xl border border-red-100 text-xs text-red-600 font-medium">
                            <AlertCircle size={14} className="mt-0.5 shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/50">
                    <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-200/50 transition-colors">
                        Hủy
                    </button>
                    <button
                        type="submit"
                        disabled={!values.name.trim() || isSaving}
                        className="px-6 py-2.5 flex items-center gap-2 rounded-xl text-sm font-semibold text-white bg-[#0092B8] hover:bg-[#007a99] transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSaving && <Loader2 size={14} className="animate-spin" />}
                        {submitLabel}
                    </button>
                </div>
            </form>
        </div>
    );
}
