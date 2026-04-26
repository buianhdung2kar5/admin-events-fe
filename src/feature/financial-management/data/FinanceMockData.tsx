export type TransactionStatus = "PENDING" | "SUCCESS" | "FAILED";
export type PaymentProvider = "SEPAY";

export interface Transaction {
    id: string;
    orderId: string;
    userId: string;
    userName: string;
    userEmail: string;
    amount: number;
    coinAmount?: number;
    paymentProvider: PaymentProvider;
    status: TransactionStatus;
    reference?: string;
    reason?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CoinHistory {
    id: string;
    userId: string;
    type: "ADD" | "SUBTRACT";
    amount: number;
    reason: string;
    createdAt: string;
}

export interface UserCoinBalance {
    userId: string;
    userName: string;
    email: string;
    balance: number;
}

export const MockTransactions: Transaction[] = [
    {
        id: "tx-001", orderId: "ORD-SEPAY-12345", userId: "u-001", userName: "Nguyễn Thị Lan", userEmail: "lan@student.edu.vn",
        amount: 50000, coinAmount: 50, paymentProvider: "SEPAY", status: "SUCCESS", reference: "SEPAY123984572",
        createdAt: "2024-04-20T10:00:00Z", updatedAt: "2024-04-20T10:05:00Z"
    },
    {
        id: "tx-002", orderId: "ORD-SEPAY-67890", userId: "u-002", userName: "Trần Văn Minh", userEmail: "minh@student.edu.vn",
        amount: 100000, coinAmount: 110, paymentProvider: "SEPAY", status: "PENDING", reference: "SEPAY998231",
        createdAt: "2024-04-25T08:30:00Z", updatedAt: "2024-04-25T08:30:00Z"
    },
    {
        id: "tx-003", orderId: "ORD-SEPAY-111", userId: "u-003", userName: "Lê Thị Hoa", userEmail: "hoa@student.edu.vn",
        amount: 0, coinAmount: 200, paymentProvider: "SEPAY", status: "FAILED", reason: "Phát hiện gian lận",
        createdAt: "2024-04-22T14:20:00Z", updatedAt: "2024-04-22T15:00:00Z"
    },
    {
        id: "tx-004", orderId: "ORD-SEPAY-99999", userId: "u-004", userName: "Phạm Quang Huy", userEmail: "huy@student.edu.vn",
        amount: 200000, coinAmount: 230, paymentProvider: "SEPAY", status: "PENDING",
        createdAt: "2024-04-26T09:15:00Z", updatedAt: "2024-04-26T09:15:00Z"
    }
];

export const MockCoinBalances: UserCoinBalance[] = [
    { userId: "u-001", userName: "Nguyễn Thị Lan", email: "lan@student.edu.vn", balance: 150 },
    { userId: "u-002", userName: "Trần Văn Minh", email: "minh@student.edu.vn", balance: 500 },
    { userId: "u-003", userName: "Lê Thị Hoa", email: "hoa@student.edu.vn", balance: 0 },
];

export const MockCoinHistories: CoinHistory[] = [
    { id: "ch-001", userId: "u-001", type: "ADD", amount: 50, reason: "Nạp coin qua SePay", createdAt: "2024-04-20T10:05:00Z" },
    { id: "ch-002", userId: "u-001", type: "ADD", amount: 100, reason: "Thưởng sự kiện Hackathon", createdAt: "2024-04-21T09:00:00Z" },
    { id: "ch-003", userId: "u-002", type: "SUBTRACT", amount: 20, reason: "Mua vé sự kiện AI", createdAt: "2024-04-22T11:30:00Z" },
];

// Dashboard stats helper
export const getFinanceStats = () => {
    const totalRevenue = MockTransactions.filter(t => t.status === "SUCCESS").reduce((acc, t) => acc + t.amount, 0);
    const pendingTransactions = MockTransactions.filter(t => t.status === "PENDING").length;
    const totalCoinsIssued = MockCoinBalances.reduce((acc, u) => acc + u.balance, 0);
    return { totalRevenue, pendingTransactions, totalCoinsIssued };
};
