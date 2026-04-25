export type ParticipantRole = "ATTENDEE" | "CTV" | "VOLUNTEER" | "ORGANIZER";
export type ParticipantCheckInStatus = "NOT_CHECKED_IN" | "CHECKED_IN" | "CHECKED_OUT";
export type AttendanceMethod = "QR" | "MANUAL";

export interface Participant {
    id: string;
    eventId: string;
    userId: string;
    name: string;
    email: string;
    studentId: string;
    avatarUrl: string;
    role: ParticipantRole;
    checkInStatus: ParticipantCheckInStatus;
    checkInTime?: string;
    checkOutTime?: string;
    ticketCode: string;
}

export interface AttendanceLog {
    id: string;
    eventId: string;
    participantId: string;
    participantName: string;
    action: "CHECK_IN" | "CHECK_OUT";
    method: AttendanceMethod;
    timestamp: string;
    note?: string;
}

export interface EventQR {
    eventId: string;
    qrType: "CHECK_IN" | "CHECK_OUT";
    code: string; // the QR value / URL
    expiresAt: string;
}

// --- Mock Participants ---
export const MockParticipants: Participant[] = [
    {
        id: "p-001", eventId: "ev-001", userId: "u-001",
        name: "Nguyễn Thị Lan", email: "lan@student.edu.vn", studentId: "11210123",
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lan",
        role: "ATTENDEE", checkInStatus: "CHECKED_OUT",
        checkInTime: "2024-04-15T08:02:00Z", checkOutTime: "2024-04-15T16:45:00Z",
        ticketCode: "TK-001-LAN"
    },
    {
        id: "p-002", eventId: "ev-001", userId: "u-002",
        name: "Trần Văn Minh", email: "minh@student.edu.vn", studentId: "11210456",
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Minh",
        role: "ATTENDEE", checkInStatus: "CHECKED_IN",
        checkInTime: "2024-04-15T08:15:00Z",
        ticketCode: "TK-001-MINH"
    },
    {
        id: "p-003", eventId: "ev-001", userId: "u-003",
        name: "Lê Thị Hoa", email: "hoa@student.edu.vn", studentId: "11210789",
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Hoa",
        role: "CTV", checkInStatus: "CHECKED_OUT",
        checkInTime: "2024-04-15T07:00:00Z", checkOutTime: "2024-04-15T17:30:00Z",
        ticketCode: "TK-001-HOA"
    },
    {
        id: "p-004", eventId: "ev-001", userId: "u-004",
        name: "Phạm Quang Huy", email: "huy@student.edu.vn", studentId: "20200123",
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Huy",
        role: "ATTENDEE", checkInStatus: "NOT_CHECKED_IN",
        ticketCode: "TK-001-HUY"
    },
    {
        id: "p-005", eventId: "ev-001", userId: "u-005",
        name: "Võ Thị Mai", email: "mai@student.edu.vn", studentId: "11211000",
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mai",
        role: "VOLUNTEER", checkInStatus: "CHECKED_IN",
        checkInTime: "2024-04-15T07:30:00Z",
        ticketCode: "TK-001-MAI"
    },
    {
        id: "p-006", eventId: "ev-002", userId: "u-006",
        name: "Đỗ Văn Tuấn", email: "tuan@student.edu.vn", studentId: "20210456",
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Tuan",
        role: "ATTENDEE", checkInStatus: "NOT_CHECKED_IN",
        ticketCode: "TK-002-TUAN"
    }
];

// --- Mock Attendance Logs ---
export const MockAttendanceLogs: AttendanceLog[] = [
    {
        id: "log-001", eventId: "ev-001", participantId: "p-003",
        participantName: "Lê Thị Hoa", action: "CHECK_IN", method: "QR",
        timestamp: "2024-04-15T07:00:11Z"
    },
    {
        id: "log-002", eventId: "ev-001", participantId: "p-001",
        participantName: "Nguyễn Thị Lan", action: "CHECK_IN", method: "QR",
        timestamp: "2024-04-15T08:02:33Z"
    },
    {
        id: "log-003", eventId: "ev-001", participantId: "p-005",
        participantName: "Võ Thị Mai", action: "CHECK_IN", method: "MANUAL",
        timestamp: "2024-04-15T07:30:00Z", note: "Check-in thủ công - mã vé bị mờ"
    },
    {
        id: "log-004", eventId: "ev-001", participantId: "p-002",
        participantName: "Trần Văn Minh", action: "CHECK_IN", method: "QR",
        timestamp: "2024-04-15T08:15:07Z"
    },
    {
        id: "log-005", eventId: "ev-001", participantId: "p-001",
        participantName: "Nguyễn Thị Lan", action: "CHECK_OUT", method: "QR",
        timestamp: "2024-04-15T16:45:22Z"
    },
    {
        id: "log-006", eventId: "ev-001", participantId: "p-003",
        participantName: "Lê Thị Hoa", action: "CHECK_OUT", method: "MANUAL",
        timestamp: "2024-04-15T17:30:00Z", note: "Check-out thủ công - hết giờ"
    }
];

// --- Mock QR ---
export const MockEventQRs: EventQR[] = [
    {
        eventId: "ev-001",
        qrType: "CHECK_IN",
        code: "https://s-events.vn/checkin/ev-001?token=ABC123XYZ",
        expiresAt: "2024-04-15T23:59:59Z"
    },
    {
        eventId: "ev-001",
        qrType: "CHECK_OUT",
        code: "https://s-events.vn/checkout/ev-001?token=DEF456UVW",
        expiresAt: "2024-04-15T23:59:59Z"
    }
];

// Helper stats
export const getAttendanceStats = (eventId: string) => {
    const participants = MockParticipants.filter(p => p.eventId === eventId);
    const total = participants.length;
    const checkedIn = participants.filter(p => p.checkInStatus !== "NOT_CHECKED_IN").length;
    const checkedOut = participants.filter(p => p.checkInStatus === "CHECKED_OUT").length;
    const notYet = participants.filter(p => p.checkInStatus === "NOT_CHECKED_IN").length;
    const ctv = participants.filter(p => p.role === "CTV" || p.role === "VOLUNTEER").length;
    return { total, checkedIn, checkedOut, notYet, ctv, checkInRate: total > 0 ? Math.round((checkedIn / total) * 100) : 0 };
};
