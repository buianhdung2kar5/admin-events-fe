import React from 'react';

const General: React.FC = () => {
    return (
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col gap-8 max-w-4xl">
            <div className="flex flex-col gap-1">
                <h2 className="text-xl font-black text-gray-800 tracking-tight">Cài đặt chung</h2>
                <p className="text-xs font-bold text-gray-400">Thông tin cơ bản về hệ thống</p>
            </div>

            <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-black text-gray-700">Tên website</label>
                    <input 
                        type="text" 
                        defaultValue="S-Events"
                        className="w-full bg-gray-50 border border-transparent focus:border-blue-100 focus:bg-white px-5 py-3.5 rounded-2xl text-sm font-bold text-gray-600 outline-none transition-all"
                        placeholder="Nhập tên website..."
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-black text-gray-700">Mô tả</label>
                    <textarea 
                        className="w-full bg-gray-50 border border-transparent focus:border-blue-100 focus:bg-white px-5 py-3.5 rounded-2xl text-sm font-bold text-gray-600 outline-none transition-all min-h-[120px]"
                        placeholder="Mô tả ngắn về hệ thống..."
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-black text-gray-700">Email liên hệ</label>
                        <input 
                            type="email" 
                            defaultValue="contact@s-events.vn"
                            className="w-full bg-gray-50 border border-transparent focus:border-blue-100 focus:bg-white px-5 py-3.5 rounded-2xl text-sm font-bold text-gray-600 outline-none transition-all"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-black text-gray-700">Email hỗ trợ</label>
                        <input 
                            type="email" 
                            defaultValue="support@s-events.vn"
                            className="w-full bg-gray-50 border border-transparent focus:border-blue-100 focus:bg-white px-5 py-3.5 rounded-2xl text-sm font-bold text-gray-600 outline-none transition-all"
                        />
                    </div>
                </div>
            </div>

            <div className="pt-4">
                <button className="bg-[#0092B8] text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-900/10 hover:shadow-blue-900/20 hover:-translate-y-0.5 transition-all active:translate-y-0">
                    Lưu thay đổi
                </button>
            </div>
        </div>
    );
};

export default General;
