import { Clock, ShieldCheck, FileClock, FileCheck, ShieldAlert } from "lucide-react";

export default function EmergencyCard() {

    const mockData = [
        {
            id: 'authen',
            title: "Xác thực tài liệu chờ duyệt",
            number: 3,
            icon: ShieldCheck,
            colorText: '#0092B8',
            colorBorder: '#0092B8',
            colorBg: '#EFF9FC',
            colorIcon: '#0092B8',
        },
        {
            id: 'report',
            title: 'Báo cáo nghiêm trọng chưa xử lý',
            number: 2,
            icon: ShieldAlert,
            colorText: '#E7000B',
            colorBorder: '#FBBFC2',
            colorBg: '#FFF5F5',
            colorIcon: '#E7000B',
        },
        {
            id: 'transaction',
            title: 'Giao dịch đang xử lý',
            number: 5,
            icon: FileClock,
            colorText: '#D08700',
            colorBorder: '#FFE08A',
            colorBg: '#FFFBEB',
            colorIcon: '#D08700',
        },
        {
            id: 'post_waiting_approved',
            title: 'Bài đăng chờ phê duyệt',
            number: 8,
            icon: FileCheck,
            colorText: '#6B7280',
            colorBorder: '#D1D5DB',
            colorBg: '#F9FAFB',
            colorIcon: '#6B7280',
        },
        {
            id: 'momo_pay',
            title: "Callback Momo chưa xử lý",
            number: 3,
            icon: Clock,
            colorText: '#D08700',
            colorBorder: '#FFE08A',
            colorBg: '#FFFBEB',
            colorIcon: '#D08700',
        }
    ];

    return (
        <div className="flex flex-wrap gap-3 w-full">
            {mockData.map((item) => {
                const Icon = item.icon;
                return (
                    <div
                        key={item.id}
                        style={{
                            border: `1.5px solid ${item.colorBorder}`,
                            backgroundColor: item.colorBg,
                        }}
                        className="flex items-center gap-3 px-4 py-3 rounded-2xl flex-1 min-w-[160px]"
                    >
                        {/* Icon */}
                        <Icon
                            size={22}
                            style={{ color: item.colorIcon }}
                            className="flex-shrink-0"
                        />

                        {/* Text */}
                        <div className="flex flex-col leading-tight">
                            <span
                                style={{ color: '#6B7280' }}
                                className="text-xs font-medium leading-snug"
                            >
                                {item.title}
                            </span>
                            <span
                                style={{ color: item.colorText }}
                                className="text-xl font-bold mt-0.5"
                            >
                                {item.number}
                            </span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}