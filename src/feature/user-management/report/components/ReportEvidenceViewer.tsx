import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, ExternalLink, FileText, X } from "lucide-react";
import type { ReportEvidence } from "../../../../types/report.types";
import { safeHttpsUrl } from "../../verify-document/DTO/VerificationInterface";

const isImage = (evidence: ReportEvidence): boolean => evidence.contentType.startsWith("image/");

interface LightboxProps {
    images: ReportEvidence[];
    index: number;
    onChange: (index: number) => void;
    onClose: () => void;
}

function Lightbox({ images, index, onChange, onClose }: LightboxProps) {
    const closeRef = useRef<HTMLButtonElement>(null);
    const current = images[index];
    const hasMany = images.length > 1;

    useEffect(() => {
        closeRef.current?.focus();
    }, []);

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
            if (e.key === "ArrowRight") onChange((index + 1) % images.length);
            if (e.key === "ArrowLeft") onChange((index - 1 + images.length) % images.length);
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [images.length, index, onChange, onClose]);

    return (
        <div className="fixed inset-0 z-50 flex flex-col bg-black/85" role="dialog" aria-modal="true" aria-label={`Minh chứng ${index + 1} / ${images.length}`}>
            <header className="flex items-center justify-between gap-4 px-5 py-3 text-white">
                <p className="text-sm font-semibold truncate">{current.fileName} · {index + 1}/{images.length}</p>
                <button ref={closeRef} type="button" onClick={onClose} aria-label="Đóng" className="p-2 rounded-xl hover:bg-white/10"><X size={20} /></button>
            </header>
            <div className="relative flex-1 flex items-center justify-center min-h-0 px-4 pb-6" onClick={onClose}>
                <img src={current.fileUrl} alt={current.fileName} onClick={(e) => e.stopPropagation()} className="max-w-full max-h-full object-contain rounded-lg" />
                {hasMany && (
                    <>
                        <button type="button" aria-label="Ảnh trước" onClick={(e) => { e.stopPropagation(); onChange((index - 1 + images.length) % images.length); }}
                            className="absolute left-4 p-3 rounded-full bg-white/10 text-white hover:bg-white/20"><ChevronLeft size={22} /></button>
                        <button type="button" aria-label="Ảnh sau" onClick={(e) => { e.stopPropagation(); onChange((index + 1) % images.length); }}
                            className="absolute right-4 p-3 rounded-full bg-white/10 text-white hover:bg-white/20"><ChevronRight size={22} /></button>
                    </>
                )}
            </div>
        </div>
    );
}

/** Ảnh mở lightbox, file khác (pdf) mở tab mới; chỉ dùng link https. */
export default function ReportEvidenceViewer({ evidences }: { evidences: ReportEvidence[] }) {
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
    const images = evidences.filter((e) => isImage(e) && safeHttpsUrl(e.fileUrl));
    const files = evidences.filter((e) => !images.includes(e));

    return (
        <section aria-labelledby="evidence-title" className="flex flex-col gap-3">
            <h2 id="evidence-title" className="text-xs font-bold uppercase tracking-wide text-gray-500">Minh chứng ({evidences.length})</h2>

            {images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {images.map((evidence, index) => (
                        <button key={evidence.mediaId} type="button" onClick={() => setLightboxIndex(index)} aria-label={`Xem ảnh ${evidence.fileName}`}
                            className="aspect-[4/3] rounded-xl border border-gray-100 overflow-hidden bg-gray-50 hover:border-[#0092B8] transition-colors">
                            <img src={evidence.fileUrl} alt={evidence.fileName} loading="lazy" className="w-full h-full object-cover" />
                        </button>
                    ))}
                </div>
            )}

            {files.map((evidence) => {
                const url = safeHttpsUrl(evidence.fileUrl);
                return (
                    <div key={evidence.mediaId} className="flex items-center gap-3 rounded-xl border border-gray-100 px-4 py-3">
                        <FileText size={18} className="text-[#0092B8] shrink-0" aria-hidden="true" />
                        <p className="flex-1 min-w-0 text-sm font-semibold text-gray-800 truncate">{evidence.fileName}</p>
                        {url ? (
                            <a href={url} target="_blank" rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-3 min-h-9 rounded-lg border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50">
                                <ExternalLink size={13} aria-hidden="true" />Mở file
                            </a>
                        ) : (
                            <span className="text-xs text-red-500">Link không an toàn</span>
                        )}
                    </div>
                );
            })}

            {lightboxIndex !== null && (
                <Lightbox images={images} index={lightboxIndex} onChange={setLightboxIndex} onClose={() => setLightboxIndex(null)} />
            )}
        </section>
    );
}
