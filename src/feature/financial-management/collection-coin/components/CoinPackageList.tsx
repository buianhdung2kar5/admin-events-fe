import React from 'react';
import { Edit3, Trash2, Zap, CircleDollarSign } from 'lucide-react';
import { dataCoin, SummaryData } from '../data/MockData';

const CoinPackageList: React.FC = () => {
    return (
        <div className="flex flex-col gap-8 animate-in fade-in duration-500">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                {SummaryData.map((item, index) => (
                    <div key={index} className="flex flex-col gap-2 items-center justify-center bg-white p-6 py-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 group">
                        <p className={`text-4xl font-black ${item.color || 'text-gray-800'} tracking-tight group-hover:scale-110 transition-transform duration-300`}>
                            {item.value}
                        </p>
                        <h1 className="text-[10px] font-black text-gray-400 text-center uppercase tracking-widest">{item.title}</h1>
                    </div>
                ))}
            </div>

            {/* Package Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                {dataCoin.map((pkg) => (
                    <div key={pkg.id} className="relative bg-white rounded-[32px] p-6 shadow-sm border border-gray-100 hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)] transition-all duration-500 flex flex-col group overflow-hidden">
                        {pkg.isPopular && (
                            <div className="absolute top-4 right-[-35px] bg-[#FBBF24] text-white text-[9px] font-black px-10 py-1.5 rotate-45 shadow-sm flex items-center gap-1 uppercase tracking-widest z-10">
                                <Zap size={10} fill="white" /> Phổ biến
                            </div>
                        )}

                        <div className="flex items-start justify-between mb-6">
                            <div className="flex items-center gap-4">
                                <div className={`${pkg.color} p-3.5 rounded-2xl shadow-lg shadow-${pkg.color.split('[')[1].split(']')[0]}/20 group-hover:rotate-12 transition-transform duration-300`}>
                                    <CircleDollarSign size={24} className="text-white" />
                                </div>
                                <div className="flex flex-col">
                                    <h3 className="text-xl font-black text-gray-800 tracking-tight">{pkg.name}</h3>
                                    <p className="text-[11px] text-gray-400 font-bold italic line-clamp-1">{pkg.description}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-baseline gap-2 mb-1">
                            <span className="text-4xl font-black text-gray-800 tracking-tighter tabular-nums">{pkg.coins.toLocaleString()}</span>
                            <span className="text-sm font-bold text-gray-400 uppercase tracking-tighter">coin</span>
                            {pkg.bonus && (
                                <span className="text-sm font-black text-emerald-500 ml-1">+{pkg.bonus} bonus</span>
                            )}
                        </div>

                        <div className="text-2xl font-black text-[#0092B8] tracking-tighter mb-6 tabular-nums">
                            {pkg.price.toLocaleString()}đ
                        </div>

                        <div className="flex items-center justify-between text-[11px] font-bold text-gray-400 border-t border-gray-50 pt-4 mb-6">
                            <div className="flex flex-col">
                                <span className="text-gray-300 uppercase text-[9px] tracking-widest mb-0.5">Đã bán</span>
                                <span className="text-gray-600 font-extrabold">{pkg.soldCount}</span>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="text-gray-300 uppercase text-[9px] tracking-widest mb-0.5">Doanh thu</span>
                                <span className="text-gray-600 font-extrabold">{pkg.revenue.toLocaleString()}Kđ</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 mt-auto">
                            <button className="flex-1 bg-emerald-50 text-emerald-600 text-[11px] font-black py-3 rounded-2xl border border-emerald-100 uppercase tracking-wider hover:bg-emerald-100 transition-colors">
                                Đang bán
                            </button>
                            <button className="p-3 bg-gray-50 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-2xl transition-all border border-gray-100">
                                <Edit3 size={18} />
                            </button>
                            <button className="p-3 bg-rose-50 text-rose-400 hover:text-rose-600 hover:bg-rose-100 rounded-2xl transition-all border border-rose-100">
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CoinPackageList;
