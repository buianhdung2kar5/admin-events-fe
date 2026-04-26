import { useState } from "react";
import { X, Package } from "lucide-react";
import { PackageItem } from "../data/PackageMockData";

interface Props {
    pkg: PackageItem | null;
    onClose: () => void;
    onSave: (data: Partial<PackageItem>) => void;
}

export default function PackageFormModal({ pkg, onClose, onSave }: Props) {
    const [name, setName] = useState(pkg?.name ?? "");
    const [description, setDescription] = useState(pkg?.description ?? "");
    const [price, setPrice] = useState(String(pkg?.price ?? ""));
    const [durationDays, setDurationDays] = useState(String(pkg?.durationDays ?? ""));

    const isEdit = !!pkg;
    const canSubmit = name.trim() && description.trim() && Number(durationDays) > 0 && Number(price) >= 0;

    const handleSubmit = () => {
        if (!canSubmit) return;
        onSave({
            name: name.trim(),
            description: description.trim(),
            price: Number(price),
            durationDays: Number(durationDays),
        });
    };

    const inputCls = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#0092B8] focus:ring-2 focus:ring-[#0092B8]/20 transition-all";
    const labelCls = "text-xs font-semibold text-gray-500 uppercase tracking-wide";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 p-6 flex flex-col gap-5">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-[#0092B8] p-2 rounded-xl">
                            <Package size={20} className="text-white" />
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-gray-800">{isEdit ? "Chỉnh sửa gói dịch vụ" : "Tạo gói dịch vụ mới"}</h2>
                            <p className="text-xs text-gray-400">{isEdit ? pkg.name : "Gói subscription cho ORGANIZATION"}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                        <X size={18} className="text-gray-400" />
                    </button>
                </div>

                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label className={labelCls}>Tên gói *</label>
                        <input type="text" value={name} onChange={e => setName(e.target.value)}
                            placeholder="VD: Premium 90 ngày" className={inputCls} />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className={labelCls}>Mô tả</label>
                        <textarea value={description} onChange={e => setDescription(e.target.value)}
                            placeholder="Mô tả ngắn về gói dịch vụ..." rows={2}
                            className={`${inputCls} resize-none`} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label className={labelCls}>Giá (₫) *</label>
                            <input type="number" min={0} value={price} onChange={e => setPrice(e.target.value)}
                                placeholder="0 = Miễn phí" className={inputCls} />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className={labelCls}>Thời hạn (ngày) *</label>
                            <input type="number" min={1} value={durationDays} onChange={e => setDurationDays(e.target.value)}
                                placeholder="VD: 30" className={inputCls} />
                        </div>
                    </div>
                </div>

                <div className="flex gap-3 pt-1">
                    <button onClick={onClose} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50">Hủy</button>
                    <button onClick={handleSubmit} disabled={!canSubmit}
                        className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#0092B8] hover:bg-[#007a99] disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                        {isEdit ? "Lưu thay đổi" : "Tạo gói"}
                    </button>
                </div>
            </div>
        </div>
    );
}
