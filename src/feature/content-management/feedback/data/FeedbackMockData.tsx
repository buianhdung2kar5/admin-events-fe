export type QuestionType = "TEXT" | "RATING" | "SINGLECHOICE" | "MULTIPLECHOICE";

export interface FeedbackQuestion {
    id: string;
    eventId: string;
    content: string;
    type: QuestionType;
    options?: string[]; // for SINGLECHOICE / MULTIPLECHOICE
    required: boolean;
    order: number;
}

export interface FeedbackAnswer {
    questionId: string;
    questionContent: string;
    type: QuestionType;
    textValue?: string;
    ratingValue?: number;
    choiceValues?: string[];
}

export interface Feedback {
    id: string;
    eventId: string;
    participantId: string;
    participantName: string;
    participantAvatar: string;
    overallRating: number;
    comment: string;
    answers: FeedbackAnswer[];
    submittedAt: string;
}

// --- Mock Questions ---
export const MockFeedbackQuestions: FeedbackQuestion[] = [
    {
        id: "q-001", eventId: "ev-001",
        content: "Bạn đánh giá chất lượng nội dung chương trình như thế nào?",
        type: "RATING", required: true, order: 1
    },
    {
        id: "q-002", eventId: "ev-001",
        content: "Ban tổ chức phục vụ bạn tốt không?",
        type: "SINGLECHOICE",
        options: ["Rất tốt", "Tốt", "Bình thường", "Chưa tốt"],
        required: true, order: 2
    },
    {
        id: "q-003", eventId: "ev-001",
        content: "Bạn đã học được gì từ sự kiện này?",
        type: "TEXT", required: false, order: 3
    },
    {
        id: "q-004", eventId: "ev-001",
        content: "Điều gì thu hút bạn đến sự kiện? (Chọn nhiều)",
        type: "MULTIPLECHOICE",
        options: ["Diễn giả nổi tiếng", "Chủ đề hay", "Networking", "Học bổng / Coin", "Bạn bè rủ"],
        required: false, order: 4
    },
    {
        id: "q-005", eventId: "ev-002",
        content: "Bạn đánh giá độ khó của Hackathon?",
        type: "RATING", required: true, order: 1
    }
];

// --- Mock Feedbacks ---
export const MockFeedbacks: Feedback[] = [
    {
        id: "fb-001", eventId: "ev-001",
        participantId: "p-001", participantName: "Nguyễn Thị Lan",
        participantAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lan",
        overallRating: 5,
        comment: "Chương trình rất hay, diễn giả nhiều kinh nghiệm, nội dung thực tế và bổ ích!",
        submittedAt: "2024-04-15T20:00:00Z",
        answers: [
            { questionId: "q-001", questionContent: "Bạn đánh giá chất lượng nội dung chương trình?", type: "RATING", ratingValue: 5 },
            { questionId: "q-002", questionContent: "Ban tổ chức phục vụ bạn tốt không?", type: "SINGLECHOICE", choiceValues: ["Rất tốt"] },
            { questionId: "q-003", questionContent: "Bạn đã học được gì từ sự kiện này?", type: "TEXT", textValue: "Học được tư duy quản trị kinh doanh trong kỷ nguyên AI." },
            { questionId: "q-004", questionContent: "Điều gì thu hút bạn đến sự kiện?", type: "MULTIPLECHOICE", choiceValues: ["Diễn giả nổi tiếng", "Chủ đề hay"] }
        ]
    },
    {
        id: "fb-002", eventId: "ev-001",
        participantId: "p-002", participantName: "Trần Văn Minh",
        participantAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Minh",
        overallRating: 4,
        comment: "Tổ chức tốt, nhưng hơi đông, khó nghe ở cuối hội trường.",
        submittedAt: "2024-04-15T21:30:00Z",
        answers: [
            { questionId: "q-001", questionContent: "Bạn đánh giá chất lượng nội dung chương trình?", type: "RATING", ratingValue: 4 },
            { questionId: "q-002", questionContent: "Ban tổ chức phục vụ bạn tốt không?", type: "SINGLECHOICE", choiceValues: ["Tốt"] },
            { questionId: "q-003", questionContent: "Bạn đã học được gì từ sự kiện này?", type: "TEXT", textValue: "Kỹ năng networking và cách tiếp cận nhà đầu tư." },
            { questionId: "q-004", questionContent: "Điều gì thu hút bạn đến sự kiện?", type: "MULTIPLECHOICE", choiceValues: ["Networking", "Học bổng / Coin"] }
        ]
    },
    {
        id: "fb-003", eventId: "ev-001",
        participantId: "p-005", participantName: "Võ Thị Mai",
        participantAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mai",
        overallRating: 5,
        comment: "Xuất sắc! Sẽ tiếp tục tham gia các sự kiện tiếp theo.",
        submittedAt: "2024-04-16T08:15:00Z",
        answers: [
            { questionId: "q-001", questionContent: "Bạn đánh giá chất lượng nội dung chương trình?", type: "RATING", ratingValue: 5 },
            { questionId: "q-002", questionContent: "Ban tổ chức phục vụ bạn tốt không?", type: "SINGLECHOICE", choiceValues: ["Rất tốt"] },
            { questionId: "q-004", questionContent: "Điều gì thu hút bạn đến sự kiện?", type: "MULTIPLECHOICE", choiceValues: ["Chủ đề hay", "Bạn bè rủ"] }
        ]
    }
];

// --- Stats helpers ---
export const getFeedbackStats = (eventId: string, questions: FeedbackQuestion[], feedbacks: Feedback[]) => {
    const eventFeedbacks = feedbacks.filter(f => f.eventId === eventId);
    const totalFeedbacks = eventFeedbacks.length;
    const avgRating = totalFeedbacks > 0
        ? Math.round((eventFeedbacks.reduce((s, f) => s + f.overallRating, 0) / totalFeedbacks) * 10) / 10
        : 0;

    const ratingDist = [1, 2, 3, 4, 5].map(star => ({
        star,
        count: eventFeedbacks.filter(f => f.overallRating === star).length
    }));

    const questionStats = questions
        .filter(q => q.eventId === eventId && (q.type === "SINGLECHOICE" || q.type === "MULTIPLECHOICE"))
        .map(q => {
            const choiceCounts: Record<string, number> = {};
            (q.options || []).forEach(opt => { choiceCounts[opt] = 0; });
            eventFeedbacks.forEach(fb => {
                const ans = fb.answers.find(a => a.questionId === q.id);
                ans?.choiceValues?.forEach(cv => {
                    choiceCounts[cv] = (choiceCounts[cv] || 0) + 1;
                });
            });
            return { question: q.content, choiceCounts };
        });

    return { totalFeedbacks, avgRating, ratingDist, questionStats };
};
