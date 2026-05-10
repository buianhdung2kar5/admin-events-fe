import { Star } from "lucide-react";
import { QuestionType } from "../data/FeedbackMockData";

export const TYPE_BADGE: Record<QuestionType, { label: string; cls: string }> = {
    TEXT:          { label: "Văn bản",    cls: "bg-gray-100 text-gray-600" },
    RATING:        { label: "Sao",        cls: "bg-amber-50 text-amber-600" },
    SINGLECHOICE:  { label: "Chọn 1",     cls: "bg-blue-50 text-blue-600" },
    MULTIPLECHOICE:{ label: "Chọn nhiều", cls: "bg-purple-50 text-purple-600" }
};

export const StarRating = ({ value }: { value: number }) => (
    <div className="flex items-center gap-0.5">
        {[1,2,3,4,5].map(s => (
            <Star key={s} size={14} className={s <= value ? "text-amber-400 fill-amber-400" : "text-gray-200"} />
        ))}
    </div>
);
