import React, { useState, useEffect, useRef } from 'react';
import { useForm } from "react-hook-form";
import { Search, ChevronDown, Check, Calendar, X } from "lucide-react";
import { useParams } from 'react-router-dom';

interface GroupFilterProps {
    setFilter: (filter: any) => void
}

interface Option {
    label: string;
    value: string;
}

interface DropdownProps {
    label: string;
    options: Option[];
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

    const selectedOption = options.find(o => o.value === value) || options[0];

    return (
        <div ref={dropdownRef} className="relative w-44">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-2 px-4 py-2.5 transition-all duration-300 outline-none w-full justify-between
                    ${isOpen ? 'bg-[#0092B8] text-white rounded-xl shadow-md ring-4 ring-blue-50' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50 rounded-xl'}`}
            >
                <span className="text-sm font-bold tracking-tight truncate mr-1">{selectedOption.label}</span>
                <ChevronDown size={14} strokeWidth={2.5} className={`shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-white' : 'text-gray-300'}`} />
            </button>

            {isOpen && (
                <div className="absolute top-[calc(100%+8px)] right-0 w-60 bg-white border border-gray-100 rounded-2xl shadow-2xl z-50 overflow-hidden py-2 animate-in fade-in zoom-in-95 duration-200">
                    {options.map((option) => {
                        const isSelected = value === option.value || (value === "" && option.value === "");
                        
                        return (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => {
                                    onSelect(option.value);
                                    setIsOpen(false);
                                }}
                                className={`flex items-center justify-between w-full px-4 py-3 text-sm transition-all duration-200
                                    ${isSelected ? 'text-[#0092B8] font-bold bg-blue-50/30' : 'text-gray-600 font-medium hover:bg-gray-50'}`}
                            >
                                <span className={isSelected ? 'translate-x-0.5 transition-transform' : ''}>{option.label}</span>
                                {isSelected && (
                                    <div className="bg-[#0092B8] rounded-full p-0.5">
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
        filter1: { 
            label: "Vai trò", 
            options: [
                { label: "Tất cả vai trò", value: "" },
                { label: "Sinh viên", value: "Student" },
                { label: "Doanh nghiệp", value: "Business" },
                { label: "Tổ chức", value: "Organization" },
                { label: "Quản trị viên", value: "Admin" }
            ] 
        },
        filter2: { 
            label: "Trạng thái", 
            options: [
                { label: "Tất cả trạng thái", value: "" },
                { label: "Hoạt động", value: "Active" },
                { label: "Chờ duyệt", value: "Pending" },
                { label: "Bị khóa", value: "Blocked" }
            ] 
        }
    },
    "organization": {
        filter1: { 
            label: "Loại tổ chức", 
            options: [
                { label: "Tất cả loại", value: "" },
                { label: "Trường ĐH", value: "University" },
                { label: "CLB / Hội SV", value: "Club" },
                { label: "Doanh nghiệp", value: "Business" }
            ] 
        },
        filter2: { 
            label: "Trạng thái", 
            options: [
                { label: "Tất cả", value: "" },
                { label: "Hoạt động", value: "Active" },
                { label: "Đã khóa", value: "Blocked" }
            ] 
        }
    },
    "verify-document": {
        filter1: { 
            label: "Trạng thái duyệt", 
            options: [
                { label: "Tất cả", value: "" },
                { label: "Chờ duyệt", value: "Pending" },
                { label: "Đã duyệt", value: "Approved" },
                { label: "Từ chối", value: "Rejected" }
            ] 
        },
        filter2: { 
            label: "Vai trò", 
            options: [
                { label: "Tất cả vai trò", value: "" },
                { label: "Sinh viên", value: "Student" },
                { label: "Tổ chức", value: "Organization" }
            ] 
        }
    },
    "event": {
        filter1: {
            label: "Trạng thái",
            options: [
                { label: "Tất cả trạng thái", value: "" },
                { label: "Lưu nháp", value: "DRAFT" },
                { label: "Đã xuất bản", value: "PUBLISHED" },
                { label: "Đang diễn ra", value: "ONGOING" },
                { label: "Đã kết thúc", value: "COMPLETED" },
                { label: "Đã hủy", value: "CANCELLED" }
            ]
        },
        filter2: {
            label: "Loại sự kiện",
            options: [
                { label: "Tất cả loại", value: "" },
                { label: "Sự kiện", value: "Event" },
                { label: "Cuộc thi", value: "Competition" },
                { label: "Tuyển dụng", value: "Recruitment" }
            ]
        }
    }
};

export default function GroupFilter({ setFilter }: GroupFilterProps) {
    const { type } = useParams();
    const currentConfig = FILTER_CONFIG[type || "user"] || FILTER_CONFIG["user"];

    const { register, watch, setValue, reset } = useForm({
        defaultValues: {
            search: "",
            filter1: "",
            filter2: "",
            date: ""
        }
    });

    // Reset filters when changing sections
    useEffect(() => {
        reset({
            search: "",
            filter1: "",
            filter2: "",
            date: ""
        });
    }, [type, reset]);

    const values = watch();
    const hasFilter = values.search || values.filter1 || values.filter2 || values.date;

    useEffect(() => {
        setFilter(values);
    }, [values.search, values.filter1, values.filter2, values.date, setFilter]);

    const handleClear = () => {
        reset({
            search: "",
            filter1: "",
            filter2: "",
            date: ""
        });
    };

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
                {/* Date Filter */}
                <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-xl border border-transparent hover:border-gray-200 transition-all group/date">
                    <Calendar size={14} className="text-gray-400 group-hover/date:text-[#0092B8] transition-colors" />
                    <input
                        {...register("date")}
                        type="date"
                        className="text-[10px] font-bold text-gray-500 bg-transparent outline-none border-none p-0 cursor-pointer"
                    />
                </div>
                
                <div className="h-6 w-px bg-gray-100 mx-1"></div>

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

                {hasFilter && (
                    <>
                        <div className="h-6 w-px bg-gray-100 mx-1"></div>
                        <button
                            type="button"
                            onClick={handleClear}
                            className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                            title="Xóa bộ lọc"
                        >
                            <X size={16} strokeWidth={2.5} />
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
