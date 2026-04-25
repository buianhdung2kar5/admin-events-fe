import { useState } from "react";
import { ArrowLeft, QrCode, ClipboardList, Users, BarChart2, LogIn, LogOut, Clock, Smartphone, Pen } from "lucide-react";
import { EventItem } from "../../event/data/EventMockData";
import { MockAttendanceLogs, MockEventQRs, getAttendanceStats, AttendanceLog, AttendanceMethod } from "../data/AttendanceMockData";
import ParticipantList from "./ParticipantList";

interface Props {
    event: EventItem;
    onBack: () => void;
}

type AttendanceTab = "dashboard" | "participants" | "logs" | "manual" | "qr";

export default function AttendancePanel({ event, onBack }: Props) {
    const [activeTab, setActiveTab] = useState<AttendanceTab>("dashboard");
    const [logs, setLogs] = useState<AttendanceLog[]>(
        MockAttendanceLogs.filter(l => l.eventId === event.id)
    );
    const [manualName, setManualName] = useState("");
    const [manualTicket, setManualTicket] = useState("");
    const [manualNote, setManualNote] = useState("");
    const [manualAction, setManualAction] = useState<"CHECK_IN" | "CHECK_OUT">("CHECK_IN");
    const [manualSuccess, setManualSuccess] = useState<string | null>(null);

    const stats = getAttendanceStats(event.id);
    const qrData = MockEventQRs.filter(q => q.eventId === event.id);

    const handleManualSubmit = () => {
        if (!manualName.trim() && !manualTicket.trim()) return;
        const newLog: AttendanceLog = {
            id: `log-${Date.now()}`,
            eventId: event.id,
            participantId: `manual-${Date.now()}`,
            participantName: manualName || manualTicket,
            action: manualAction,
            method: "MANUAL",
            timestamp: new Date().toISOString(),
            note: manualNote || undefined
        };
        setLogs(prev => [newLog, ...prev]);
        setManualSuccess(`Đã ${manualAction === "CHECK_IN" ? "check-in" : "check-out"} thành công cho: ${newLog.participantName}`);
        setManualName(""); setManualTicket(""); setManualNote("");
        setTimeout(() => setManualSuccess(null), 3000);
    };

    const tabs: { id: AttendanceTab; label: string; icon: React.ReactNode }[] = [
        { id: "dashboard", label: "Tổng quan", icon: <BarChart2 size={15} /> },
        { id: "participants", label: "Participants", icon: <Users size={15} /> },
        { id: "logs", label: "Nhật ký", icon: <ClipboardList size={15} /> },
        { id: "manual", label: "Thủ công", icon: <Pen size={15} /> },
        { id: "qr", label: "QR Code", icon: <QrCode size={15} /> },
    ];

    return (
        <div className="flex flex-col gap-5">
            {/* Back Header */}
            <div className="flex items-center gap-3">
                <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-600">
                    <ArrowLeft size={20} />
                </button>
                <div className="flex flex-col gap-0.5">
                    <h2 className="text-lg font-bold text-gray-800">Quản lý điểm danh</h2>
                    <p className="text-sm text-gray-500 truncate max-w-[480px]">{event.title}</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl p-1 w-fit">
                {tabs.map(tab => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                            activeTab === tab.id ? "bg-[#0092B8] text-white shadow-sm" : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                        }`}>
                        {tab.icon} {tab.label}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="animate-[fadeIn_0.2s_ease]">

                {/* ── DASHBOARD ── */}
                {activeTab === "dashboard" && (
                    <div className="flex flex-col gap-5">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { label: "Tổng participants", value: stats.total, icon: <Users size={18} />, color: "bg-blue-50 text-blue-600" },
                                { label: "Đã check-in", value: stats.checkedIn, icon: <LogIn size={18} />, color: "bg-green-50 text-green-600" },
                                { label: "Đã check-out", value: stats.checkedOut, icon: <LogOut size={18} />, color: "bg-teal-50 text-teal-600" },
                                { label: "CTV / TNV", value: stats.ctv, icon: <Users size={18} />, color: "bg-purple-50 text-purple-600" },
                            ].map(s => (
                                <div key={s.label} className={`p-5 rounded-2xl border flex flex-col gap-3 shadow-sm ${s.color} border-current/10`}>
                                    {s.icon}
                                    <div>
                                        <p className="text-2xl font-black">{s.value}</p>
                                        <p className="text-xs font-semibold opacity-70 mt-0.5">{s.label}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-3">
                            <div className="flex justify-between items-center text-sm font-bold text-gray-700">
                                <span>Tỷ lệ Check-in</span>
                                <span className="text-[#0092B8] text-lg">{stats.checkInRate}%</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-[#0092B8] to-teal-400 rounded-full transition-all" style={{ width: `${stats.checkInRate}%` }} />
                            </div>
                            <div className="flex gap-6 text-xs font-medium text-gray-500">
                                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#0092B8]" /> Check-in ({stats.checkedIn})</span>
                                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-teal-500" /> Check-out ({stats.checkedOut})</span>
                                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-gray-200" /> Chưa vào ({stats.notYet})</span>
                            </div>
                        </div>

                        {/* Timeline */}
                        {event.analytics.checkInTimeline.length > 0 && (
                            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-4">
                                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide flex items-center gap-2"><Clock size={14} /> Timeline Check-in</h3>
                                {event.analytics.checkInTimeline.map((item, i) => (
                                    <div key={i} className="flex items-center gap-4">
                                        <span className="w-10 text-xs font-bold text-gray-500 text-right">{item.time}</span>
                                        <div className="flex-1 flex items-center gap-3">
                                            <div className="h-2 rounded-full bg-[#0092B8]" style={{ width: `${Math.min(item.count / 10, 100)}%` }} />
                                            <span className="text-xs font-semibold text-gray-600">{item.count}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* ── PARTICIPANTS ── */}
                {activeTab === "participants" && <ParticipantList eventId={event.id} />}

                {/* ── LOGS ── */}
                {activeTab === "logs" && (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 border-b border-gray-100 text-xs text-gray-500 uppercase font-semibold tracking-wider">
                                <tr>
                                    <th className="px-5 py-3">Participant</th>
                                    <th className="px-5 py-3 text-center">Hành động</th>
                                    <th className="px-5 py-3 text-center">Phương thức</th>
                                    <th className="px-5 py-3">Thời gian</th>
                                    <th className="px-5 py-3">Ghi chú</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {logs.length === 0 ? (
                                    <tr><td colSpan={5} className="py-12 text-center text-sm text-gray-400">Chưa có log điểm danh nào</td></tr>
                                ) : logs.map(log => (
                                    <tr key={log.id} className="hover:bg-gray-50/60 transition-colors">
                                        <td className="px-5 py-4">
                                            <span className="font-semibold text-gray-800">{log.participantName}</span>
                                        </td>
                                        <td className="px-5 py-4 text-center">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold ${log.action === "CHECK_IN" ? "bg-green-50 text-green-600" : "bg-teal-50 text-teal-600"}`}>
                                                {log.action === "CHECK_IN" ? <><LogIn size={11} /> Check-in</> : <><LogOut size={11} /> Check-out</>}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-center">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold border ${log.method === "QR" ? "bg-blue-50 text-blue-600 border-blue-200" : "bg-amber-50 text-amber-600 border-amber-200"}`}>
                                                {log.method === "QR" ? <><Smartphone size={11} /> QR</> : <><Pen size={11} /> Thủ công</>}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-xs text-gray-500 font-medium">
                                            {new Date(log.timestamp).toLocaleString("vi-VN")}
                                        </td>
                                        <td className="px-5 py-4 text-xs text-gray-400 max-w-[180px] truncate">
                                            {log.note || "—"}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* ── MANUAL CHECK-IN ── */}
                {activeTab === "manual" && (
                    <div className="max-w-lg flex flex-col gap-5">
                        {manualSuccess && (
                            <div className="flex items-center gap-3 px-4 py-3 bg-green-50 rounded-xl border border-green-200 text-sm font-semibold text-green-700">
                                <LogIn size={18} /> {manualSuccess}
                            </div>
                        )}
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-5">
                            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">Check-in / Check-out thủ công</h3>
                            
                            <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-xl">
                                {(["CHECK_IN", "CHECK_OUT"] as const).map(a => (
                                    <button key={a} onClick={() => setManualAction(a)}
                                        className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${manualAction === a ? "bg-white shadow-sm text-[#0092B8]" : "text-gray-500"}`}>
                                        {a === "CHECK_IN" ? "✅ Check-in" : "🔚 Check-out"}
                                    </button>
                                ))}
                            </div>

                            <div className="flex flex-col gap-3">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Họ tên participant</label>
                                    <input type="text" value={manualName} onChange={e => setManualName(e.target.value)} placeholder="Nhập tên người tham dự..." className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#0092B8] focus:ring-2 focus:ring-[#0092B8]/20 transition-all" />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Mã vé (Ticket Code)</label>
                                    <input type="text" value={manualTicket} onChange={e => setManualTicket(e.target.value)} placeholder="VD: TK-001-LAN" className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none font-mono focus:border-[#0092B8] focus:ring-2 focus:ring-[#0092B8]/20 transition-all" />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Ghi chú (Lý do thủ công)</label>
                                    <textarea rows={2} value={manualNote} onChange={e => setManualNote(e.target.value)} placeholder="VD: Mã QR bị hỏng, điện thoại hết pin..." className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#0092B8] focus:ring-2 focus:ring-[#0092B8]/20 transition-all resize-none" />
                                </div>
                            </div>

                            <button onClick={handleManualSubmit} disabled={!manualName.trim() && !manualTicket.trim()}
                                className="w-full py-3 text-sm font-bold text-white bg-[#0092B8] hover:bg-[#007a99] rounded-xl transition-colors shadow-sm disabled:opacity-50">
                                {manualAction === "CHECK_IN" ? "Xác nhận Check-in" : "Xác nhận Check-out"}
                            </button>
                        </div>
                    </div>
                )}

                {/* ── QR CODE ── */}
                {activeTab === "qr" && (
                    <div className="flex flex-col gap-5">
                        <p className="text-sm text-gray-500">Hiển thị QR cho ban tổ chức quét hoặc chiếu màn hình lớn để participant tự quét.</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {(["CHECK_IN", "CHECK_OUT"] as const).map(type => {
                                const qr = qrData.find(q => q.qrType === type);
                                return (
                                    <div key={type} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col items-center gap-4">
                                        <span className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase border ${type === "CHECK_IN" ? "bg-green-50 text-green-600 border-green-200" : "bg-teal-50 text-teal-600 border-teal-200"}`}>
                                            QR {type === "CHECK_IN" ? "Check-in" : "Check-out"}
                                        </span>

                                        {qr ? (
                                            <>
                                                {/* Simulated QR using a grid pattern */}
                                                <div className="w-48 h-48 bg-white border-2 border-gray-200 rounded-2xl p-3 flex items-center justify-center relative overflow-hidden shadow-inner">
                                                    <img
                                                        src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(qr.code)}`}
                                                        alt={`QR ${type}`}
                                                        className="w-full h-full object-contain"
                                                    />
                                                </div>
                                                <div className="flex flex-col items-center gap-1 text-center">
                                                    <span className="font-mono text-xs text-gray-400 break-all max-w-[250px] leading-relaxed">{qr.code}</span>
                                                    <span className="text-xs text-gray-400 mt-1">Hết hạn: {new Date(qr.expiresAt).toLocaleString("vi-VN")}</span>
                                                </div>
                                                <button className="px-5 py-2 text-sm font-semibold text-white bg-[#0092B8] hover:bg-[#007a99] rounded-xl transition-colors">
                                                    Tải QR Code
                                                </button>
                                            </>
                                        ) : (
                                            <div className="flex flex-col items-center gap-3 py-8 text-gray-400">
                                                <QrCode size={40} className="opacity-30" />
                                                <p className="text-sm font-medium">Chưa có QR Code</p>
                                                <button className="px-5 py-2 text-sm font-semibold text-white bg-[#0092B8] hover:bg-[#007a99] rounded-xl transition-colors">
                                                    Tạo QR Code
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
