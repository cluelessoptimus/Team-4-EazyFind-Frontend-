import React, { useState, useRef } from 'react';
import { Search, X } from 'lucide-react';

// AutocompleteSearch provides a real-time search interface for discovering 
// restaurants by name, area, or keywords.
export default function AutocompleteSearch({ onSearch, placeholder }) {
    const [input, setInput] = useState('');

    const handleSearchClick = () => {
        onSearch(input);
    };

    return (
        <div className="relative w-full max-w-2xl mx-auto">
            <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                    <Search className="w-5 h-5 text-zinc-400 group-focus-within:text-brand-600 transition-colors" />
                </div>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={placeholder}
                    className="w-full pl-14 pr-16 py-4 bg-white border-2 border-zinc-100 rounded-[2rem] shadow-xl outline-none focus:border-brand-500/20 focus:ring-8 focus:ring-brand-500/5 transition-all text-zinc-900 font-bold placeholder:text-zinc-300"
                    onKeyDown={(e) => e.key === 'Enter' && handleSearchClick()}
                />
                <div className="absolute inset-y-0 right-2 flex items-center gap-2">
                    {input && (
                        <button
                            onClick={() => { setInput(''); onSearch(''); }}
                            className="p-2 hover:bg-zinc-100 rounded-full transition-colors"
                        >
                            <X className="w-4 h-4 text-zinc-400" />
                        </button>
                    )}
                    <button
                        onClick={handleSearchClick}
                        className="bg-slate-900 text-white px-6 py-2 rounded-[1.5rem] font-black text-sm hover:bg-brand-600 transition-all active:scale-95 shadow-lg shadow-black/10"
                    >
                        Search
                    </button>
                </div>
            </div>
        </div>
    );
}
