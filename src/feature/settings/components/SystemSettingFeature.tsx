import React, { useState } from 'react';

const SystemSettingFeature: React.FC = () => {
    const [features, setFeatures] = useState({
        userReg: true,
        postApproval: true,
        businessReg: true,
        comments: true,
        ratings: true
    });

    const toggle = (key: keyof typeof features) => {
        setFeatures(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const ToggleRow = ({ label, desc, active, onClick }: { label: string, desc: string, active: boolean, onClick: () => void }) => (
        <div className="flex items-center justify-between py-4 group cursor-pointer" onClick={onClick}>
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
                <h2 className="text-xl font-black text-gray-800 tracking-tight">Cài đặt tính năng</h2>
                <p className="text-xs font-bold text-gray-400">Bật/tắt các tính năng của hệ thống</p>
            </div>

            <div className="flex flex-col divide-y divide-gray-50 font-bold overflow-hidden rounded-2xl">
                <ToggleRow 
                    label="Cho phép đăng ký người dùng" 
                    desc="Cho phép sinh viên tự đăng ký tài khoản" 
                    active={features.userReg}
                    onClick={() => toggle('userReg')}
                />
                <ToggleRow 
                    label="Yêu cầu phê duyệt bài đăng" 
                    desc="Bài đăng cần được duyệt trước khi hiển thị" 
                    active={features.postApproval}
                    onClick={() => toggle('postApproval')}
                />
                <ToggleRow 
                    label="Cho phép đăng ký doanh nghiệp" 
                    desc="Cho phép doanh nghiệp tự đăng ký" 
                    active={features.businessReg}
                    onClick={() => toggle('businessReg')}
                />
                <ToggleRow 
                    label="Bình luận" 
                    desc="Cho phép người dùng bình luận" 
                    active={features.comments}
                    onClick={() => toggle('comments')}
                />
                <ToggleRow 
                    label="Đánh giá" 
                    desc="Cho phép đánh giá sự kiện" 
                    active={features.ratings}
                    onClick={() => toggle('ratings')}
                />
            </div>

            <div className="pt-4 border-t border-gray-50">
                <button className="bg-[#0092B8] text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-900/10 hover:shadow-blue-900/20 hover:-translate-y-0.5 transition-all active:translate-y-0">
                    Lưu thay đổi
                </button>
            </div>
        </div>
    );
};

export default SystemSettingFeature;
