import { useNavigate } from "react-router-dom";

interface Item {
    icon: React.ReactNode;
    title: string;
    path: string;
}
interface AccessFastBlockProps {
    item: Item;
}
export default function AccessFastBlock({ item }: AccessFastBlockProps) {
    const navigate = useNavigate();
    return (
        <button
            onClick={() => navigate(item.path)}
            className="flex flex-col gap-4 items-center cursor-pointer text-gray-600 hover:text-[#0092B8] hover:bg-blue-50 p-2 md:p-3 rounded-xl transition-colors w-full"
        >
            <p className="text-gray-600 group-hover:text-[#0092B8]">{item.icon}</p>
            <p className="font-semibold text-sm">{item.title}</p>
        </button>
    );
}