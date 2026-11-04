import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, FormEvent, ReactNode } from "react";
import { EditorContent, useEditor, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableHeader from "@tiptap/extension-table-header";
import TableCell from "@tiptap/extension-table-cell";
import Placeholder from "@tiptap/extension-placeholder";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import {
    Bold, Eraser, Heading1, Heading2, Heading3, ImagePlus, Italic, Link as LinkIcon, List, ListOrdered, Loader2, Pilcrow, Quote,
    Redo2, Strikethrough, Subscript as SubscriptIcon, Superscript as SuperscriptIcon, Table as TableIcon, TextAlignCenter,
    TextAlignEnd, TextAlignJustify, TextAlignStart, Underline as UnderlineIcon, Undo2, Unlink,
} from "lucide-react";
import { UploadService } from "../../../../services/UploadService";
import { getErrorMessage } from "../../../../services/apiError";
import "./NewsEditor.css";

interface Props {
    /** HTML ban đầu (chỉ đọc lúc khởi tạo) */
    initialContent: string;
    onChange: (html: string, isEmpty: boolean) => void;
    disabled?: boolean;
    invalid?: boolean;
}

const HTTP_URL = /^https?:\/\/\S+$/i;

/**
 * Chỉ bật các node/mark sinh ra thẻ nằm trong whitelist OWASP của backend (§15):
 * không code block (pre), không đường kẻ ngang, không video/iframe.
 */
const EXTENSIONS = [
    StarterKit.configure({ heading: { levels: [1, 2, 3] }, codeBlock: false, horizontalRule: false }),
    Underline,
    Subscript,
    Superscript,
    Link.configure({
        openOnClick: false,
        autolink: true,
        protocols: ["http", "https"],
        validate: (href: string) => HTTP_URL.test(href),
        HTMLAttributes: { rel: "noopener noreferrer nofollow", target: "_blank", class: null },
    }),
    Image.configure({ allowBase64: false }),
    TextAlign.configure({ types: ["heading", "paragraph"] }),
    Table.configure({ resizable: false }),
    TableRow,
    TableHeader,
    TableCell,
    Placeholder.configure({ placeholder: "Viết nội dung bài viết…" }),
];

function ToolButton({ label, active, disabled, onClick, children }: { label: string; active?: boolean; disabled?: boolean; onClick: () => void; children: ReactNode }) {
    return (
        <button type="button" onClick={onClick} disabled={disabled} title={label} aria-label={label} aria-pressed={active}
            className={`inline-flex items-center justify-center min-w-9 h-9 px-2 rounded-lg text-sm font-semibold transition-colors disabled:opacity-40 ${active ? "bg-[#0092B8]/10 text-[#0092B8]" : "text-gray-600 hover:bg-gray-100"}`}>
            {children}
        </button>
    );
}

const Divider = () => <span aria-hidden="true" className="w-px h-6 bg-gray-200 mx-1" />;

/** Ô nhập link ngay dưới thanh công cụ (thay cho window.prompt). */
function LinkBar({ editor, onDone }: { editor: Editor; onDone: () => void }) {
    const [url, setUrl] = useState<string>(() => editor.getAttributes("link").href ?? "https://");
    const [error, setError] = useState<string | null>(null);

    const submit = (e: FormEvent) => {
        e.preventDefault();
        const value = url.trim();
        if (!HTTP_URL.test(value)) {
            setError("Link phải bắt đầu bằng http:// hoặc https://");
            return;
        }
        editor.chain().focus().extendMarkRange("link").setLink({ href: value }).run();
        onDone();
    };

    return (
        <form onSubmit={submit} className="flex flex-wrap items-center gap-2 px-3 py-2 border-b border-gray-100 bg-gray-50">
            <input type="url" value={url} onChange={(e) => setUrl(e.target.value)} autoFocus aria-label="Địa chỉ link"
                className="flex-1 min-w-[200px] border border-gray-200 rounded-lg px-3 h-9 text-sm outline-none focus:border-[#0092B8]" />
            <button type="submit" className="px-3 h-9 rounded-lg bg-[#0092B8] text-white text-sm font-semibold">Gắn link</button>
            <button type="button" onClick={onDone} className="px-3 h-9 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-200/60">Hủy</button>
            {error && <p role="alert" className="w-full text-xs text-red-600">{error}</p>}
        </form>
    );
}

function Toolbar({ editor, disabled, onError }: { editor: Editor; disabled: boolean; onError: (message: string | null) => void }) {
    const fileRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isLinking, setIsLinking] = useState(false);
    const chain = () => editor.chain().focus();
    const inTable = editor.isActive("table");

    const uploadImage = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        e.target.value = "";
        if (!file) return;
        if (!file.type.startsWith("image/")) {
            onError("Chỉ chèn được file ảnh");
            return;
        }
        onError(null);
        setIsUploading(true);
        try {
            const { fileUrl } = await UploadService.uploadImage(file, "news");
            if (!fileUrl.startsWith("https://")) throw new Error("Ảnh tải lên không có đường dẫn https");
            chain().setImage({ src: fileUrl, alt: file.name }).run();
        } catch (err: unknown) {
            onError(getErrorMessage(err, "Không tải được ảnh"));
        } finally {
            setIsUploading(false);
        }
    };

    const off = disabled || isUploading;

    return (
        <div className="sticky top-0 z-10 bg-white border-b border-gray-100 rounded-t-xl">
            <div role="toolbar" aria-label="Định dạng nội dung" className="flex flex-wrap items-center gap-0.5 px-2 py-1.5">
                <ToolButton label="Hoàn tác" disabled={off || !editor.can().undo()} onClick={() => chain().undo().run()}><Undo2 size={16} /></ToolButton>
                <ToolButton label="Làm lại" disabled={off || !editor.can().redo()} onClick={() => chain().redo().run()}><Redo2 size={16} /></ToolButton>
                <Divider />
                <ToolButton label="Đoạn văn" disabled={off} active={editor.isActive("paragraph")} onClick={() => chain().setParagraph().run()}><Pilcrow size={16} /></ToolButton>
                <ToolButton label="Tiêu đề 1" disabled={off} active={editor.isActive("heading", { level: 1 })} onClick={() => chain().toggleHeading({ level: 1 }).run()}><Heading1 size={16} /></ToolButton>
                <ToolButton label="Tiêu đề 2" disabled={off} active={editor.isActive("heading", { level: 2 })} onClick={() => chain().toggleHeading({ level: 2 }).run()}><Heading2 size={16} /></ToolButton>
                <ToolButton label="Tiêu đề 3" disabled={off} active={editor.isActive("heading", { level: 3 })} onClick={() => chain().toggleHeading({ level: 3 }).run()}><Heading3 size={16} /></ToolButton>
                <Divider />
                <ToolButton label="In đậm" disabled={off} active={editor.isActive("bold")} onClick={() => chain().toggleBold().run()}><Bold size={16} /></ToolButton>
                <ToolButton label="In nghiêng" disabled={off} active={editor.isActive("italic")} onClick={() => chain().toggleItalic().run()}><Italic size={16} /></ToolButton>
                <ToolButton label="Gạch chân" disabled={off} active={editor.isActive("underline")} onClick={() => chain().toggleUnderline().run()}><UnderlineIcon size={16} /></ToolButton>
                <ToolButton label="Gạch ngang" disabled={off} active={editor.isActive("strike")} onClick={() => chain().toggleStrike().run()}><Strikethrough size={16} /></ToolButton>
                <ToolButton label="Chỉ số dưới" disabled={off} active={editor.isActive("subscript")} onClick={() => chain().toggleSubscript().run()}><SubscriptIcon size={16} /></ToolButton>
                <ToolButton label="Chỉ số trên" disabled={off} active={editor.isActive("superscript")} onClick={() => chain().toggleSuperscript().run()}><SuperscriptIcon size={16} /></ToolButton>
                <Divider />
                <ToolButton label="Danh sách chấm" disabled={off} active={editor.isActive("bulletList")} onClick={() => chain().toggleBulletList().run()}><List size={16} /></ToolButton>
                <ToolButton label="Danh sách số" disabled={off} active={editor.isActive("orderedList")} onClick={() => chain().toggleOrderedList().run()}><ListOrdered size={16} /></ToolButton>
                <ToolButton label="Trích dẫn" disabled={off} active={editor.isActive("blockquote")} onClick={() => chain().toggleBlockquote().run()}><Quote size={16} /></ToolButton>
                <Divider />
                <ToolButton label="Căn trái" disabled={off} active={editor.isActive({ textAlign: "left" })} onClick={() => chain().setTextAlign("left").run()}><TextAlignStart size={16} /></ToolButton>
                <ToolButton label="Căn giữa" disabled={off} active={editor.isActive({ textAlign: "center" })} onClick={() => chain().setTextAlign("center").run()}><TextAlignCenter size={16} /></ToolButton>
                <ToolButton label="Căn phải" disabled={off} active={editor.isActive({ textAlign: "right" })} onClick={() => chain().setTextAlign("right").run()}><TextAlignEnd size={16} /></ToolButton>
                <ToolButton label="Căn đều" disabled={off} active={editor.isActive({ textAlign: "justify" })} onClick={() => chain().setTextAlign("justify").run()}><TextAlignJustify size={16} /></ToolButton>
                <Divider />
                <ToolButton label="Gắn link" disabled={off} active={editor.isActive("link")} onClick={() => setIsLinking(true)}><LinkIcon size={16} /></ToolButton>
                <ToolButton label="Bỏ link" disabled={off || !editor.isActive("link")} onClick={() => chain().unsetLink().run()}><Unlink size={16} /></ToolButton>
                <ToolButton label="Chèn ảnh" disabled={off} onClick={() => fileRef.current?.click()}>
                    {isUploading ? <Loader2 size={16} className="animate-spin" /> : <ImagePlus size={16} />}
                </ToolButton>
                <ToolButton label="Chèn bảng" disabled={off || inTable} onClick={() => chain().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}><TableIcon size={16} /></ToolButton>
                <ToolButton label="Xóa định dạng" disabled={off} onClick={() => chain().unsetAllMarks().clearNodes().run()}><Eraser size={16} /></ToolButton>
                <input ref={fileRef} type="file" accept="image/*" onChange={uploadImage} className="hidden" />
            </div>
            {inTable && (
                <div className="flex flex-wrap items-center gap-1 px-2 pb-1.5 text-xs">
                    <span className="px-1 font-semibold text-gray-400">Bảng:</span>
                    <ToolButton label="Thêm hàng" disabled={off} onClick={() => chain().addRowAfter().run()}>+ Hàng</ToolButton>
                    <ToolButton label="Thêm cột" disabled={off} onClick={() => chain().addColumnAfter().run()}>+ Cột</ToolButton>
                    <ToolButton label="Xóa hàng" disabled={off} onClick={() => chain().deleteRow().run()}>− Hàng</ToolButton>
                    <ToolButton label="Xóa cột" disabled={off} onClick={() => chain().deleteColumn().run()}>− Cột</ToolButton>
                    <ToolButton label="Xóa bảng" disabled={off} onClick={() => chain().deleteTable().run()}>Xóa bảng</ToolButton>
                </div>
            )}
            {isLinking && <LinkBar editor={editor} onDone={() => setIsLinking(false)} />}
        </div>
    );
}

/** Trình soạn thảo nội dung tin tức (TipTap). Trả HTML qua onChange. */
export default function NewsEditor({ initialContent, onChange, disabled = false, invalid = false }: Props) {
    const [toolError, setToolError] = useState<string | null>(null);
    const editor = useEditor({
        extensions: EXTENSIONS,
        content: initialContent,
        editable: !disabled,
        onUpdate: ({ editor: current }) => onChange(current.getHTML(), current.isEmpty),
    });

    useEffect(() => {
        // emitUpdate = false: không coi việc khóa/mở editor là người dùng sửa nội dung
        editor?.setEditable(!disabled, false);
    }, [editor, disabled]);

    return (
        <div className={`news-editor rounded-xl border bg-white ${invalid ? "border-red-300" : "border-gray-200 focus-within:border-[#0092B8]"}`}>
            {editor && <Toolbar editor={editor} disabled={disabled} onError={setToolError} />}
            {toolError && <p role="alert" className="px-4 py-2 text-xs text-red-600 bg-red-50 border-b border-red-100">{toolError}</p>}
            <EditorContent editor={editor} />
        </div>
    );
}
