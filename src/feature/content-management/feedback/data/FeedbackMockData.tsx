export type QuestionType = "TEXT" | "RATING" | "SINGLECHOICE" | "MULTIPLECHOICE";

export interface EventData {
    eventId: number;
    title: string;
    banner: string | null;
    registerOpenTime: string;
    startTime: string;
    endTime: string;
    status: string;
    price: number;
    categories: any;
    capacity: number | null;
    totalParticipants: number | null;
    youthUnionPoint: number | null;
    certificateName: string | null;
    userEventState: string | null;
    recruitmentType: string;
}

export interface FeedbackQuestionOption {
    optionId?: number;
    questionId?: number;
    optionValue: string;
}

export interface FeedbackQuestion {
    feedbackQuestionId: number;
    event: EventData;
    questionContent: string;
    questionType: QuestionType;
    isRequired: boolean;
    options: FeedbackQuestionOption[];
}

export interface FeedbackAnswer {
    id: number;
    questionId: number;
    questionText: string;
    questionType: QuestionType;
    answerValue: string;
}

export interface Feedback {
    attendanceFeedbackId: number;
    eventParticipant: {
        eventParticipantId: number;
        eventId: number;
        user: any;
    };
    comment: string;
    feedbackAnswers: FeedbackAnswer[];
    createdTime: string;
}

// --- Stats helpers ---
export const getFeedbackStats = (eventId: string | number, questions: FeedbackQuestion[], feedbacks: Feedback[]) => {
    const eventIdNum = typeof eventId === "string" ? parseInt(eventId, 10) : eventId;
    const eventFeedbacks = feedbacks?.filter(f => f.eventParticipant?.eventId === eventIdNum) || [];
    
    const getOverallRating = (fb: Feedback) => {
        const ratingAnswers = fb.feedbackAnswers?.filter(a => a.questionType === "RATING") || [];
        if (ratingAnswers.length === 0) return 0;
        const sum = ratingAnswers.reduce((s, a) => s + parseInt(a.answerValue || "0", 10), 0);
        return Math.round(sum / ratingAnswers.length);
    };

    const totalFeedbacks = eventFeedbacks.length;
    const avgRating = totalFeedbacks > 0
        ? Math.round((eventFeedbacks.reduce((s, f) => s + getOverallRating(f), 0) / totalFeedbacks) * 10) / 10
        : 0;

    const ratingDist = [1, 2, 3, 4, 5].map(star => ({
        star,
        count: eventFeedbacks.filter(f => getOverallRating(f) === star).length
    }));

    const questionStats = questions?.
        filter(q => q.event?.eventId === eventIdNum && (q.questionType === "SINGLECHOICE" || q.questionType === "MULTIPLECHOICE"))
        .map(q => {
            const choiceCounts: Record<string, number> = {};
            (q.options || []).forEach(opt => { choiceCounts[opt.optionValue] = 0; });
            eventFeedbacks.forEach(fb => {
                const ans = fb.feedbackAnswers?.find(a => a.questionId === q.feedbackQuestionId);
                if (ans && ans.answerValue) {
                    const cvs = ans.answerValue.split(",").map(s => s.trim());
                    cvs.forEach(cv => {
                        choiceCounts[cv] = (choiceCounts[cv] || 0) + 1;
                    });
                }
            });
            return { question: q.questionContent, choiceCounts };
        });

    return { totalFeedbacks, avgRating, ratingDist, questionStats };
};
