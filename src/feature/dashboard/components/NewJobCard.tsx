import { CalendarDays, Building2, Briefcase } from "lucide-react";

interface JobPost {
    id: string;
    logo: string;           // URL ảnh logo công ty
    company: string;        // Tên công ty
    title: string;          // Vị trí tuyển
    deadline: string;       // Hạn nộp
    tag: string;            // Nhãn loại công việc
    tagColor: string;
    tagBg: string;
}

const mockJobs: JobPost[] = [
    {
        id: "job-1",
        logo: "https://i.pravatar.cc/40?img=1",
        company: "Cộng tác viên chạy sự kiện",
        title: "Vietnam International Music Festival 2026",
        deadline: "30/05/2026",
        tag: "Sự kiện",
        tagColor: "#0092B8",
        tagBg: "#EFF9FC",
    },
    {
        id: "job-2",
        logo: "https://i.pravatar.cc/40?img=5",
        company: "Cộng tác viên chạy sự kiện",
        title: "Lễ hội Ánh sáng Đà Nẵng 2026",
        deadline: "15/05/2026",
        tag: "Sự kiện",
        tagColor: "#0092B8",
        tagBg: "#EFF9FC",
    },
    {
        id: "job-3",
        logo: "https://i.pravatar.cc/40?img=9",
        company: "Cộng tác viên chạy sự kiện",
        title: "Tech Summit Hà Nội 2026",
        deadline: "20/05/2026",
        tag: "Sự kiện",
        tagColor: "#D08700",
        tagBg: "#FFFBEB",
    },
    {
        id: "job-4",
        logo: "https://i.pravatar.cc/40?img=12",
        company: "Cộng tác viên chạy sự kiện",
        title: "Hội chợ Thương mại TP.HCM 2026",
        deadline: "10/05/2026",
        tag: "Sự kiện",
        tagColor: "#0092B8",
        tagBg: "#EFF9FC",
    },
    {
        id: "job-5",
        logo: "https://i.pravatar.cc/40?img=15",
        company: "Cộng tác viên chạy sự kiện",
        title: "Gala Trao giải Khởi nghiệp Quốc gia",
        deadline: "25/05/2026",
        tag: "Sự kiện",
        tagColor: "#059669",
        tagBg: "#ECFDF5",
    },
];

export default function NewJobCard() {
    return (
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col gap-5 h-full">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Briefcase size={20} className="text-[#0092B8]" />
                    <h3 className="text-xl font-bold text-gray-800">Việc làm mới tuyển</h3>
                </div>
                <span className="text-xs font-semibold text-[#0092B8] bg-[#EFF9FC] px-3 py-1 rounded-full cursor-pointer hover:opacity-80 transition">
                    Xem tất cả
                </span>
            </div>

            {/* Table header */}
            <div className="grid grid-cols-[40px_1fr_auto] gap-x-3 px-2 pb-1 border-b border-gray-100">
                <span />
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Công ty / Vị trí</span>
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Hạn nộp</span>
            </div>

            {/* Job rows */}
            <div className="flex flex-col gap-2">
                {mockJobs.map((job) => (
                    <div
                        key={job.id}
                        className="grid grid-cols-[40px_1fr_auto] items-center gap-x-3 px-2 py-2.5 rounded-2xl hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                        {/* Logo */}
                        <img
                            src={job.logo}
                            alt={job.company}
                            className="w-10 h-10 rounded-xl object-cover border border-gray-100 flex-shrink-0"
                        />

                        {/* Company + Title */}
                        <div className="flex flex-col min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-sm font-semibold text-gray-800 truncate">{job.title}</span>
                                <span
                                    style={{ color: job.tagColor, backgroundColor: job.tagBg }}
                                    className="text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0"
                                >
                                    {job.tag}
                                </span>
                            </div>
                            <div className="flex items-center gap-1 mt-0.5">
                                <Building2 size={11} className="text-gray-400 flex-shrink-0" />
                                <span className="text-xs text-gray-400 truncate">{job.company}</span>
                            </div>
                        </div>

                        {/* Deadline */}
                        <div className="flex items-center gap-1 flex-shrink-0">
                            <CalendarDays size={13} className="text-gray-400" />
                            <span className="text-xs text-gray-500 whitespace-nowrap">{job.deadline}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
