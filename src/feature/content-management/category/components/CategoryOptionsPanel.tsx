import { useState } from "react";
import { X, Plus, Edit3, Trash2, Tag, Check } from "lucide-react";
import { CategoryItem, CategoryOption } from "../data/CategoryMockData";

interface Props {
    category: CategoryItem;
    onClose: () => void;
    onUpdate: (updated: CategoryItem) => void;
}

export default function CategoryOptionsPanel({ category, onClose, onUpdate }: Props) {
    const [options, setOptions] = useState<CategoryOption[]>(category.options);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingValue, setEditingValue] = useState("");
    const [newOptionName, setNewOptionName] = useState("");
    const [isAddingNew, setIsAddingNew] = useState(false);

    const handleAddOption = () => {
        if (!newOptionName.trim()) return;
        const newOption: CategoryOption = {
            id: `o${category.id}-${Date.now()}`,
            categoryId: category.id,
            name: newOptionName.trim()
        };
        const updated = [...options, newOption];
        setOptions(updated);
        onUpdate({ ...category, options: updated });
        setNewOptionName("");
        setIsAddingNew(false);
    };

    const handleStartEdit = (option: CategoryOption) => {
        setEditingId(option.id);
        setEditingValue(option.name);
    };

    const handleSaveEdit = () => {
        if (!editingValue.trim() || !editingId) return;
        const updated = options.map(o => o.id === editingId ? { ...o, name: editingValue.trim() } : o);
        setOptions(updated);
        onUpdate({ ...category, options: updated });
        setEditingId(null);
    };

    const handleDeleteOption = (id: string) => {
        const updated = options.filter(o => o.id !== id);
        setOptions(updated);
        onUpdate({ ...category, options: updated });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

            <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg flex flex-col overflow-hidden animate-[zoomIn_0.2s_ease]">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                            <Tag size={16} className="text-[#0092B8]" />
                            <h2 className="text-lg font-bold text-gray-800">Quản lý Options</h2>
                        </div>
                        <p className="text-xs text-gray-500">
                            Danh mục: <span className="font-semibold text-gray-700">{category.name}</span>
                            <span className="ml-2 px-2 py-0.5 bg-blue-50 text-[#0092B8] rounded-lg text-[10px] font-bold">{options.length} options</span>
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                {/* Options List */}
                <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-2 max-h-[450px] custom-scrollbar">
                    {options.length === 0 && !isAddingNew ? (
                        <div className="py-12 flex flex-col items-center gap-3 text-gray-400">
                            <Tag size={32} className="opacity-30" />
                            <p className="text-sm font-medium">Chưa có option nào</p>
                            <button onClick={() => setIsAddingNew(true)} className="text-xs text-[#0092B8] font-semibold hover:underline">
                                + Thêm option đầu tiên
                            </button>
                        </div>
                    ) : (
                        <>
                            {options.map((option) => (
                                <div key={option.id} className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl border border-gray-100 group hover:border-gray-200 transition-all">
                                    <div className="w-2 h-2 rounded-full bg-[#0092B8]/40 shrink-0" />
                                    {editingId === option.id ? (
                                        <>
                                            <input
                                                type="text"
                                                value={editingValue}
                                                onChange={(e) => setEditingValue(e.target.value)}
                                                onKeyDown={(e) => e.key === "Enter" && handleSaveEdit()}
                                                autoFocus
                                                className="flex-1 bg-white border border-[#0092B8] rounded-lg px-3 py-1.5 text-sm outline-none"
                                            />
                                            <button onClick={handleSaveEdit} className="p-1.5 text-green-500 hover:bg-green-50 rounded-lg transition-colors shrink-0">
                                                <Check size={16} />
                                            </button>
                                            <button onClick={() => setEditingId(null)} className="p-1.5 text-gray-400 hover:bg-gray-200 rounded-lg transition-colors shrink-0">
                                                <X size={16} />
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <span className="flex-1 text-sm font-semibold text-gray-700">{option.name}</span>
                                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => handleStartEdit(option)} className="p-1.5 text-gray-400 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition-colors">
                                                    <Edit3 size={14} />
                                                </button>
                                                <button onClick={() => handleDeleteOption(option.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))}
                        </>
                    )}

                    {/* New Option Input */}
                    {isAddingNew && (
                        <div className="flex items-center gap-3 px-4 py-3 bg-blue-50/50 rounded-xl border border-[#0092B8]/30">
                            <div className="w-2 h-2 rounded-full bg-[#0092B8] shrink-0" />
                            <input
                                type="text"
                                value={newOptionName}
                                onChange={(e) => setNewOptionName(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleAddOption()}
                                autoFocus
                                placeholder="Nhập tên option mới..."
                                className="flex-1 bg-white border border-[#0092B8]/30 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-[#0092B8]"
                            />
                            <button onClick={handleAddOption} className="p-1.5 text-green-500 hover:bg-green-50 rounded-lg transition-colors shrink-0">
                                <Check size={16} />
                            </button>
                            <button onClick={() => { setIsAddingNew(false); setNewOptionName(""); }} className="p-1.5 text-gray-400 hover:bg-gray-200 rounded-lg transition-colors shrink-0">
                                <X size={16} />
                            </button>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50/50">
                    <button
                        onClick={() => { setIsAddingNew(true); setEditingId(null); }}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-[#0092B8] bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors border border-blue-100"
                    >
                        <Plus size={16} /> Thêm option
                    </button>
                    <button onClick={onClose} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-200/50 transition-colors">
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
}
