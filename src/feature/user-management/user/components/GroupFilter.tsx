import React, { useState, useEffect, useRef } from 'react';
import { useForm } from "react-hook-form";
import { Search, ChevronDown, Check } from "lucide-react";
import { useParams } from 'react-router-dom';

interface GroupFilterProps {
    setFilter: (filter: any) => void
}

interface DropdownProps {
    label: string;
    options: string[];
    value: string;
    onSelect: (val: string) => void;
}

const CustomDropdown = ({ label, options, value, onSelect }: DropdownProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div ref={dropdownRef} className="relative w-44">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-2 px-4 py-2.5 transition-all duration-300 outline-none w-full justify-between
                    ${isOpen ? 'bg-[#E30613] text-white rounded-xl shadow-md ring-4 ring-red-50' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50 rounded-xl'}`}
            >
                <span className="text-sm font-bold tracking-tight truncate mr-1">{value || label}</span>
                <ChevronDown size={14} strokeWidth={2.5} className={`shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-white' : 'text-gray-300'}`} />
            </button>

            {isOpen && (
                <div className="absolute top-[calc(100%+8px)] right-0 w-60 bg-white border border-gray-100 rounded-2xl shadow-2xl z-50 overflow-hidden py-2 animate-in fade-in zoom-in-95 duration-200">
                    {options.map((option) => {
                        const isDefault = option.startsWith("Tất cả");
                        const isSelected = value === option || (value === "" && isDefault);
                        
                        return (
                            <button
                                key={option}
                                type="button"
                                onClick={() => {
                                    onSelect(isDefault ? "" : option);
                                    setIsOpen(false);
                                }}
                                className={`flex items-center justify-between w-full px-4 py-3 text-sm transition-all duration-200
                                    ${isSelected ? 'text-[#E30613] font-bold bg-red-50/30' : 'text-gray-600 font-medium hover:bg-gray-50'}`}
                            >
                                <span className={isSelected ? 'translate-x-0.5 transition-transform' : ''}>{option}</span>
                                {isSelected && (
                                    <div className="bg-[#E30613] rounded-full p-0.5">
                                        <Check size={10} className="text-white" strokeWidth={3} />
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

const FILTER_CONFIG: any = {
    "user": {
        filter1: { label: "Tất cả vai trò", options: ["Tất cả vai trò", "Sinh viên", "Doanh nghiệp", "Quản trị viên"] },
        filter2: { label: "Tất cả trạng thái", options: ["Tất cả trạng thái", "Hoạt động", "Bị khóa"] }
    },
    "organization": {
        filter1: { label: "Tất cả loại", options: ["Tất cả loại", "Trường ĐH", "CLB / Hội SV", "Doanh nghiệp", "Tổ chức phi LN"] },
        filter2: { label: "Tất cả", options: ["Tất cả", "Hoạt động", "Đã khóa"] }
    },
    "verify-document": {
        filter1: { label: "Tất cả", options: ["Tất cả", "Chờ duyệt", "Đã duyệt", "Từ chối"] },
        filter2: { label: "Tất cả vai trò", options: ["Tất cả vai trò", "Sinh viên", "Tổ chức"] }
    }
};

export default function GroupFilter({ setFilter }: GroupFilterProps) {
    const { type } = useParams();
    const currentConfig = FILTER_CONFIG[type || "user"] || FILTER_CONFIG["user"];

    const { register, watch, setValue, reset } = useForm({
        defaultValues: {
            search: "",
            filter1: "",
            filter2: ""
        }
    });

    // Reset filters when changing sections
    useEffect(() => {
        reset({
            search: "",
            filter1: "",
            filter2: ""
        });
    }, [type, reset]);

    const values = watch();

    useEffect(() => {
        setFilter(values);
    }, [values, setFilter]);

    return (
        <div className="bg-white p-2 pl-6 pr-2 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between w-full group focus-within:ring-4 focus-within:ring-blue-50/50 focus-within:border-blue-100 transition-all duration-300">
            <div className="flex items-center gap-3 flex-1">
                <Search size={18} className="text-gray-300 group-focus-within:text-[#0092B8] transition-colors" strokeWidth={2.5} />
                <input
                    {...register("search")}
                    type="text"
                    placeholder="Tìm kiếm thông tin..."
                    className="flex-1 bg-transparent border-none outline-none focus:ring-0 text-sm py-3 text-gray-700 font-medium placeholder:text-gray-300 placeholder:font-normal rounded-2xl"
                />
            </div>

            <div className="flex items-center gap-1">
                <CustomDropdown
                    label={currentConfig.filter1.label}
                    options={currentConfig.filter1.options}
                    value={values.filter1}
                    onSelect={(val) => setValue("filter1", val)}
                />
                <div className="h-6 w-px bg-gray-100 mx-1"></div>
                <CustomDropdown
                    label={currentConfig.filter2.label}
                    options={currentConfig.filter2.options}
                    value={values.filter2}
                    onSelect={(val) => setValue("filter2", val)}
                />
            </div>
        </div>
    );
}

