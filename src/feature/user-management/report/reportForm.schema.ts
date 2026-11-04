import { z } from "zod";
import { REPORT_LEVELS } from "../../../types/report.types";

/** Giới hạn của backend cho lời phản hồi (§14). */
export const REPORT_RESPONSE_MAX_LENGTH = 2000;

const responseField = (emptyMessage: string) =>
    z.string().trim().min(1, emptyMessage).max(REPORT_RESPONSE_MAX_LENGTH, `Phản hồi tối đa ${REPORT_RESPONSE_MAX_LENGTH} ký tự`);

export const resolveReportSchema = z.object({
    level: z.enum(REPORT_LEVELS).optional(),
    response: responseField("Vui lòng nhập phản hồi cho người báo cáo"),
});

export const rejectReportSchema = z.object({
    response: responseField("Vui lòng nhập lý do bác bỏ"),
});
