import { Star } from "lucide-react";
import { StarRating } from "./FeedbackShared";
import { FeedbackQuestion } from "../data/FeedbackMockData";

interface Props {
    stats: any;
    questions: FeedbackQuestion[];
}

export default function FeedbackStatsTab({ stats, questions }: Props) {
    return (
        <div className="flex flex-col gap-5">
            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-2">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Tổng phản hồi</span>
                    <span className="text-3xl font-black text-gray-800">{stats.totalFeedbacks}</span>
                </div>
                <div className="bg-amber-50 rounded-2xl border border-amber-100 shadow-sm p-5 flex flex-col gap-2">
                    <span className="text-xs font-bold text-amber-600 uppercase tracking-wide">Điểm trung bình</span>
                    <div className="flex items-end gap-2">
                        <span className="text-3xl font-black text-amber-600">{stats.avgRating}</span>
                        <span className="text-sm font-bold text-amber-400 mb-1">/ 5</span>
                    </div>
                    <StarRating value={Math.round(stats.avgRating)} />
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-2">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Câu hỏi</span>
                    <span className="text-3xl font-black text-gray-800">{questions.length}</span>
                </div>
            </div>

            {/* Rating Distribution */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-4">
                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">Phân bố đánh giá tổng thể</h3>
                {[...stats.ratingDist].reverse().map(rd => (
                    <div key={rd.star} className="flex items-center gap-3">
                        <div className="flex items-center gap-1 w-14 shrink-0">
                            <Star size={13} className="text-amber-400 fill-amber-400" />
                            <span className="text-xs font-bold text-gray-600">{rd.star}</span>
                        </div>
                        <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-amber-400 rounded-full transition-all"
                                style={{ width: stats.totalFeedbacks > 0 ? `${(rd.count / stats.totalFeedbacks) * 100}%` : "0%" }}
                            />
                        </div>
                        <span className="text-xs font-bold text-gray-500 w-8 text-right">{rd.count}</span>
                    </div>
                ))}
            </div>

            {/* Choice question stats */}
            {stats.questionStats.map((qs: any, i: number) => {
                const choiceCounts = qs.choiceCounts as Record<string, number>;
                const maxVal = Math.max(...Object.values(choiceCounts), 1);
                return (
                    <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-4">
                        <h3 className="text-sm font-bold text-gray-700">{qs.question}</h3>
                        {Object.entries(choiceCounts).map(([opt, cnt]) => (
                            <div key={opt} className="flex items-center gap-3">
                                <span className="text-xs text-gray-600 font-medium w-28 shrink-0 truncate" title={opt}>{opt}</span>
                                <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-[#0092B8] rounded-full transition-all"
                                        style={{ width: `${(cnt / maxVal) * 100}%` }}
                                    />
                                </div>
                                <span className="text-xs font-bold text-gray-500 w-6 text-right">{cnt}</span>
                            </div>
                        ))}
                    </div>
                );
            })}
        </div>
    );
}
