import React, { useState } from 'react';

const SecurityPolicy: React.FC = () => {
    const [settings, setSettings] = useState({
        emailVerify: true,
        twoFactor: false,
    });

    const toggle = (key: keyof typeof settings) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const ToggleRow = ({ label, desc, active, onClick }: { label: string, desc: string, active: boolean, onClick: () => void }) => (
        <div className="flex items-center justify-between py-6 group cursor-pointer" onClick={onClick}>
            <div className="flex flex-col gap-1">
                <p className="text-sm font-black text-gray-700">{label}</p>
                <p className="text-[11px] font-bold text-gray-400 group-hover:text-gray-500 transition-colors uppercase tracking-tight">{desc}</p>
            </div>
            <div className={`w-12 h-6 rounded-full p-1 transition-all duration-300 ${active ? 'bg-emerald-500 shadow-[0_0_15px_-5px_rgba(16,185,129,0.5)]' : 'bg-gray-200'}`}>
                <div className={`bg-white w-4 h-4 rounded-full shadow-sm transition-all duration-300 ${active ? 'translate-x-6' : 'translate-x-0'}`} />
            </div>
        </div>
    );

    return (
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col gap-8 max-w-4xl">
            <div className="flex flex-col gap-1">
                <h2 className="text-xl font-black text-gray-800 tracking-tight">Cài đặt bảo mật</h2>
                <p className="text-xs font-bold text-gray-400">Quản lý bảo mật và xác thực</p>
            </div>

            <div className="flex flex-col">
                <ToggleRow 
                    label="Xác thực Email" 
                    desc="Yêu cầu xác thực email khi đăng ký" 
                    active={settings.emailVerify}
                    onClick={() => toggle('emailVerify')}
                />
                <ToggleRow 
                    label="Xác thực 2 yếu tố" 
                    desc="Bật xác thực 2 yếu tố cho tài khoản admin" 
                    active={settings.twoFactor}
                    onClick={() => toggle('twoFactor')}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-gray-50 pt-8">
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-black text-gray-700">Độ dài mật khẩu tối thiểu</label>
                    <input 
                        type="number" 
                        defaultValue={8}
                        className="w-full bg-gray-50 border border-transparent focus:border-blue-100 focus:bg-white px-5 py-3.5 rounded-2xl text-sm font-black text-gray-600 outline-none transition-all"
                    />
                    <p className="text-[10px] font-bold text-gray-400 italic">Khuyên dùng tối thiểu 8 ký tự</p>
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-black text-gray-700">Thời gian hết phiên (phút)</label>
                    <input 
                        type="number" 
                        defaultValue={30}
                        className="w-full bg-gray-50 border border-transparent focus:border-blue-100 focus:bg-white px-5 py-3.5 rounded-2xl text-sm font-black text-gray-600 outline-none transition-all"
                    />
                    <p className="text-[10px] font-bold text-gray-400 italic">Hệ thống sẽ tự động đăng xuất</p>
                </div>
            </div>

            <div className="pt-4 mt-4">
                <button className="bg-[#0092B8] text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-900/10 hover:shadow-blue-900/20 hover:-translate-y-0.5 transition-all active:translate-y-0">
                    Lưu thay đổi
                </button>
            </div>
        </div>
    );
};

export default SecurityPolicy;
