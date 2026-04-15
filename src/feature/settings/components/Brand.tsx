import React from 'react';

const Brand: React.FC = () => {
    return (
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col gap-8 max-w-4xl">
            <div className="flex flex-col gap-1">
                <h2 className="text-xl font-black text-gray-800 tracking-tight">Cài đặt thương hiệu</h2>
                <p className="text-xs font-bold text-gray-400">Tùy chỉnh màu sắc và giao diện</p>
            </div>

            <div className="flex flex-col gap-8">
                {/* Primary Color */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 group">
                    <div className="flex flex-col gap-1 max-w-md">
                        <label className="text-sm font-black text-gray-700">Màu chính (Primary)</label>
                        <input 
                            type="text" 
                            defaultValue="#06b6d4"
                            className="w-full bg-gray-50 border border-transparent focus:border-blue-100 focus:bg-white px-5 py-3 rounded-xl text-sm font-black text-gray-600 outline-none transition-all"
                        />
                        <p className="text-[10px] font-bold text-gray-400 mt-1 italic uppercase tracking-wider">Cyan - Màu chính của S-Events</p>
                    </div>
                    <div className="w-16 h-16 rounded-2xl bg-[#06b6d4] shadow-lg shadow-cyan-500/20 border-4 border-white active:scale-95 cursor-pointer transition-transform" />
                </div>

                {/* Accent Color */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 group">
                    <div className="flex flex-col gap-1 max-w-md">
                        <label className="text-sm font-black text-gray-700">Màu nhấn (Accent)</label>
                        <input 
                            type="text" 
                            defaultValue="#db0025"
                            className="w-full bg-gray-50 border border-transparent focus:border-blue-100 focus:bg-white px-5 py-3 rounded-xl text-sm font-black text-gray-600 outline-none transition-all"
                        />
                        <p className="text-[10px] font-bold text-gray-400 mt-1 italic uppercase tracking-wider">Đỏ - Màu nhấn cho việc làm và CTA</p>
                    </div>
                    <div className="w-16 h-16 rounded-2xl bg-[#db0025] shadow-lg shadow-rose-500/20 border-4 border-white active:scale-95 cursor-pointer transition-transform" />
                </div>

                {/* Background Color */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 group">
                    <div className="flex flex-col gap-1 max-w-md">
                        <label className="text-sm font-black text-gray-700">Màu nền</label>
                        <input 
                            type="text" 
                            defaultValue="#F8F8FC"
                            className="w-full bg-gray-50 border border-transparent focus:border-blue-100 focus:bg-white px-5 py-3 rounded-xl text-sm font-black text-gray-600 outline-none transition-all"
                        />
                        <p className="text-[10px] font-bold text-gray-400 mt-1 italic uppercase tracking-wider">Slate - Màu nền sáng</p>
                    </div>
                    <div className="w-16 h-16 rounded-2xl bg-[#F8F8FC] shadow-inner border-4 border-white active:scale-95 cursor-pointer transition-transform" />
                </div>
            </div>

            <div className="pt-4 border-t border-gray-50">
                <button className="bg-[#0092B8] text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-900/10 hover:shadow-blue-900/20 hover:-translate-y-0.5 transition-all active:translate-y-0">
                    Lưu thay đổi
                </button>
            </div>
        </div>
    );
};

export default Brand;
