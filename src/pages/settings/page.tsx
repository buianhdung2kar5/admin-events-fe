import { useState } from 'react';
import { Settings, Bell, Shield, Layers, Palette } from 'lucide-react';

// Import components
import General from '../../feature/settings/components/General';
import NotificationSystem from '../../feature/settings/components/NotificationSystem';
import SecurityPolicy from '../../feature/settings/components/SecurityPolicy';
import SystemSettingFeature from '../../feature/settings/components/SystemSettingFeature';
import Brand from '../../feature/settings/components/Brand';

const tabs = [
    { id: 'general', label: 'Chung', icon: <Settings size={18} /> },
    { id: 'notification', label: 'Thông báo', icon: <Bell size={18} /> },
    { id: 'security', label: 'Bảo mật', icon: <Shield size={18} /> },
    { id: 'feature', label: 'Tính năng', icon: <Layers size={18} /> },
    { id: 'brand', label: 'Thương hiệu', icon: <Palette size={18} /> },
];

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState('general');

    const renderContent = () => {
        switch (activeTab) {
            case 'general': return <General />;
            case 'notification': return <NotificationSystem />;
            case 'security': return <SecurityPolicy />;
            case 'feature': return <SystemSettingFeature />;
            case 'brand': return <Brand />;
            default: return <General />;
        }
    };

    return (
        <div className="flex flex-col gap-8 pb-12 animate-in fade-in duration-500">
            <header className="flex flex-col gap-1.5">
                <h1 className="text-3xl font-black text-gray-800 tracking-tight">Cài đặt hệ thống</h1>
                <p className="text-sm font-bold text-gray-400">Quản lý các cấu hình và tùy chỉnh hệ thống</p>
            </header>

            <nav className="flex items-center gap-2 p-1 bg-gray-100/50 rounded-2xl w-fit border border-gray-100">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-sm font-black transition-all duration-300
                            ${activeTab === tab.id 
                                ? 'bg-white text-gray-800 shadow-sm border border-gray-100 scale-105' 
                                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'}`}
                    >
                        {tab.icon}
                        {tab.label}
                    </button>
                ))}
            </nav>

            <main className="animate-in slide-in-from-bottom-4 duration-500">
                {renderContent()}
            </main>
        </div>
    );
}
