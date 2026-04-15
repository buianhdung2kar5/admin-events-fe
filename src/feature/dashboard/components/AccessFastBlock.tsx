interface Item{
    icon:React.ReactNode,
    title:string,
    path:string,
}
interface AccessFastBlockProps{
    item:Item
}
export default function AccessFastBlock({item}:AccessFastBlockProps){
    return (
        <button className="flex flex-col gap-4 items-center cursor-pointer text-gray-600 hover:text-blue-600 hover:bg-blue-50 p-2 md:p-3 rounded-lg transition-colors w-full">
            <p className="text-gray-600">{item.icon}</p>
           <p className="font-semibold text-sm">{item.title}</p>
        </button>
    )
}