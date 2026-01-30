import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, MapPin, Filter as Funnel, Utensils, CreditCard, RotateCcw, ChefHat, Search, X } from 'lucide-react';

// Filter provides a UI for refining search results through city selection,
// multi-select cuisines, budget constraints, and sorting.
export default function Filter({ filters, onChange, cities = [], cuisines = [], mealTypes = [], isLocating = false }) {
    const [cuisineSearch, setCuisineSearch] = useState('');
    const [isCuisineOpen, setIsCuisineOpen] = useState(false);
    const cuisineRef = useRef(null);

    // UX Helper: Closes the searchable cuisine dropdown when clicking outside the component.
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (cuisineRef.current && !cuisineRef.current.contains(event.target)) {
                setIsCuisineOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedCuisines = filters.cuisines ? filters.cuisines.split(',') : [];

    // Toggles a cuisine selection in the comma-separated filter string.
    const toggleCuisine = (name) => {
        const newSelected = selectedCuisines.includes(name)
            ? selectedCuisines.filter(c => c !== name)
            : [...selectedCuisines, name];

        onChange('cuisines', newSelected.join(','));
    };

    const filteredCuisines = cuisines.filter(c =>
        c.cuisine_name.toLowerCase().includes(cuisineSearch.toLowerCase())
    );

    const handleReset = () => {
        onChange('city', '');
        onChange('cuisines', '');
        onChange('mealTypes', '');
        onChange('max_cost', '');
        onChange('sort', 'discount');
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between pb-2">
                <h3 className="text-xs font-black text-zinc-900 uppercase tracking-[0.2em] flex items-center gap-2">
                    <div className="p-2 bg-zinc-900 text-white rounded-lg shadow-lg">
                        <Funnel className="w-3.5 h-3.5" />
                    </div>
                    Filters
                </h3>
                <button
                    onClick={handleReset}
                    className="text-[10px] font-black text-zinc-400 hover:text-brand-600 transition-colors flex items-center gap-1.5 uppercase tracking-tighter group bg-zinc-50 px-3 py-1.5 rounded-full border border-zinc-100"
                >
                    <RotateCcw className="w-3 h-3 group-hover:rotate-[-45deg] transition-transform" />
                    Clear All
                </button>
            </div>

            <div className="space-y-6">
                <div className="space-y-3">
                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.15em] flex items-center gap-2 ml-1">
                        <div className="w-6 h-6 rounded-lg bg-amber-50 flex items-center justify-center">
                            <MapPin className="w-3.5 h-3.5 text-amber-500" />
                        </div>
                        Location
                    </label>
                    <div className="relative group">
                        <select
                            value={filters.city || ''}
                            onChange={(e) => onChange('city', e.target.value)}
                            className={`w-full pl-4 pr-10 py-3.5 bg-zinc-50 border-2 border-transparent rounded-[1.25rem] focus:bg-white focus:border-brand-500/20 focus:ring-4 focus:ring-brand-500/5 outline-none transition-all text-sm font-black appearance-none cursor-pointer shadow-sm group-hover:bg-white group-hover:border-zinc-100 ${isLocating ? 'animate-pulse text-brand-600 border-brand-200' : 'text-zinc-800'}`}
                        >
                            <option value="" disabled>{isLocating ? 'Detecting Location...' : 'Select City...'}</option>
                            {cities.map(city => (
                                <option key={city.id || city} value={city.city_name || city}>
                                    {city.city_name || city}
                                </option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-4 w-4 h-4 text-zinc-400 pointer-events-none group-hover:text-zinc-600 transition-colors" />
                    </div>
                </div>

                <div className="space-y-4" ref={cuisineRef}>
                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.15em] flex items-center gap-2 ml-1">
                        <div className="w-6 h-6 rounded-lg bg-violet-50 flex items-center justify-center">
                            <Utensils className="w-3.5 h-3.5 text-violet-500" />
                        </div>
                        <div className="flex-1 flex items-center justify-between">
                            <span>Cuisine</span>
                            {selectedCuisines.length > 0 && (
                                <span className="bg-violet-500 text-white text-[9px] px-1.5 py-0.5 rounded-full font-black min-w-[18px] text-center shadow-sm">
                                    {selectedCuisines.length}
                                </span>
                            )}
                        </div>
                    </label>

                    <div className="relative">
                        <button
                            onClick={() => setIsCuisineOpen(!isCuisineOpen)}
                            className={`w-full flex items-center justify-between px-4 py-3.5 bg-zinc-50 border-2 rounded-[1.25rem] transition-all text-sm font-black group hover:bg-white hover:border-zinc-100 ${isCuisineOpen ? 'border-brand-500/20 ring-4 ring-brand-500/5 bg-white' : 'border-transparent shadow-sm'}`}
                        >
                            <div className="flex flex-wrap gap-1.5 flex-1 mr-2 overflow-hidden">
                                {selectedCuisines.length > 0 ? (
                                    cuisines
                                        .filter(c => selectedCuisines.includes(c.cuisine_name))
                                        .map(c => (
                                            <span
                                                key={c.id}
                                                className="bg-brand-500 text-white text-[10px] px-2 py-0.5 rounded-lg flex items-center gap-1 animate-in fade-in zoom-in duration-200"
                                            >
                                                {c.cuisine_name}
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); toggleCuisine(c.cuisine_name); }}
                                                    className="hover:text-brand-200 transition-colors"
                                                >
                                                    <X className="w-2.5 h-2.5" />
                                                </button>
                                            </span>
                                        ))
                                ) : (
                                    <span className="text-zinc-400 font-bold">Select Flavours</span>
                                )}
                            </div>
                            <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform duration-300 ${isCuisineOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isCuisineOpen && (
                            <div className="absolute top-[calc(100%+8px)] left-0 right-0 bg-white rounded-2xl shadow-2xl border border-zinc-100 p-4 z-[100] animate-in slide-in-from-top-2 duration-200">
                                <div className="space-y-4">
                                    <div className="relative group">
                                        <input
                                            type="text"
                                            placeholder="Search cuisines..."
                                            value={cuisineSearch}
                                            onChange={(e) => setCuisineSearch(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 bg-zinc-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-brand-500/20 outline-none transition-all text-xs font-bold text-zinc-800"
                                            autoFocus
                                        />
                                        <div className="absolute left-3.5 top-2.5">
                                            <Search className="w-3.5 h-3.5 text-zinc-300" />
                                        </div>
                                    </div>

                                    <div className="max-h-48 overflow-y-auto pr-2 space-y-1.5 hide-scrollbar">
                                        {filteredCuisines.length > 0 ? (
                                            filteredCuisines.map((c) => {
                                                const isSelected = selectedCuisines.includes(c.cuisine_name);
                                                return (
                                                    <button
                                                        key={c.id}
                                                        onClick={() => toggleCuisine(c.cuisine_name)}
                                                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl border transition-all text-left ${isSelected
                                                            ? 'bg-brand-50 border-brand-200 text-brand-700 shadow-sm'
                                                            : 'bg-white border-zinc-100 text-zinc-600 hover:border-zinc-200'
                                                            }`}
                                                    >
                                                        <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${isSelected ? 'bg-brand-500 border-brand-500' : 'bg-zinc-50 border-zinc-200'
                                                            }`}>
                                                            {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
                                                        </div>
                                                        <span className="text-xs font-bold">{c.cuisine_name}</span>
                                                    </button>
                                                );
                                            })
                                        ) : (
                                            <p className="text-[10px] text-zinc-400 font-bold text-center py-4 italic">No matches found</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-3">
                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.15em] flex items-center gap-2 ml-1">
                        <div className="w-6 h-6 rounded-lg bg-rose-50 flex items-center justify-center">
                            <ChefHat className="w-3.5 h-3.5 text-rose-500" />
                        </div>
                        Meal Type
                    </label>
                    <div className="relative group">
                        <select
                            value={filters.mealTypes || ''}
                            onChange={(e) => onChange('mealTypes', e.target.value)}
                            className="w-full pl-4 pr-10 py-3.5 bg-zinc-50 border-2 border-transparent rounded-[1.25rem] focus:bg-white focus:border-brand-500/20 focus:ring-4 focus:ring-brand-500/5 outline-none transition-all text-sm font-black appearance-none cursor-pointer shadow-sm group-hover:bg-white group-hover:border-zinc-100 text-zinc-800"
                        >
                            <option value="">Any Time</option>
                            {mealTypes.map(m => (
                                <option key={m.id || m} value={m.meal_type || m}>
                                    {m.meal_type || m}
                                </option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-4 w-4 h-4 text-zinc-400 pointer-events-none group-hover:text-zinc-600 transition-colors" />
                    </div>
                </div>

                <div className="space-y-3">
                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.15em] flex items-center gap-2 ml-1">
                        <div className="w-6 h-6 rounded-lg bg-emerald-50 flex items-center justify-center">
                            <CreditCard className="w-3.5 h-3.5 text-emerald-500" />
                        </div>
                        Budget
                    </label>
                    <div className="relative group">
                        <span className="absolute left-4 top-4 text-emerald-600 font-black text-sm">₹</span>
                        <input
                            type="number"
                            placeholder="Enter amount"
                            value={filters.max_cost}
                            onChange={(e) => onChange('max_cost', e.target.value)}
                            className="w-full pl-10 pr-4 py-3.5 bg-zinc-50 border-2 border-transparent rounded-[1.25rem] focus:bg-white focus:border-brand-500/20 focus:ring-4 focus:ring-brand-500/5 outline-none transition-all text-sm font-black shadow-sm group-hover:bg-white group-hover:border-zinc-100 placeholder:text-zinc-300 text-zinc-800"
                        />
                    </div>
                </div>
            </div>

            <div className="pt-4 space-y-4">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.15em] ml-1">
                    Sort by
                </label>
                <div className="grid grid-cols-1 gap-2.5">
                    {[
                        { id: 'rating_desc', label: 'Top Rated', color: 'bg-amber-400' },
                        { id: 'cost_asc', label: 'Value First', color: 'bg-emerald-500' },
                        { id: 'discount', label: 'Best Deals', color: 'bg-rose-500' }
                    ].map((option) => (
                        <button
                            key={option.id}
                            onClick={() => onChange('sort', option.id)}
                            className={`px-5 py-3.5 rounded-[1.25rem] text-left text-sm font-black transition-all relative overflow-hidden group ${filters.sort === option.id
                                ? 'bg-zinc-900 text-white shadow-xl shadow-zinc-200'
                                : 'bg-zinc-50 text-zinc-500 hover:bg-white hover:shadow-md border border-transparent hover:border-zinc-100'
                                }`}
                        >
                            <div className="flex items-center gap-3 relative z-10 transition-transform group-active:scale-95">
                                <div className={`w-1.5 h-1.5 rounded-full ${filters.sort === option.id ? option.color : 'bg-zinc-200'}`} />
                                {option.label}
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
