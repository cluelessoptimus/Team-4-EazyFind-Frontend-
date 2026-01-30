import { useState, useEffect, useCallback } from 'react';
import { searchRestaurants, getCities, getCuisines, getMealTypes } from '../api/client';
import Filter from '../components/Filter';
import RestaurantCard from '../components/RestaurantCard';
import RestaurantSkeleton from '../components/RestaurantSkeleton';
import AutocompleteSearch from '../components/AutocompleteSearch';
import { AlertCircle, Search, MapPin, Sparkles, ChevronLeft, ChevronRight, Loader2, Utensils, History, TrendingUp, Pizza, Coffee, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// SearchPage coordinates the restaurant discovery flow, integrating geolocation,
// metadata fetching, and filtered search logic into a single responsive interface.
export default function SearchPage() {
    // Use localStorage to provide zero-latency initial rendering. This populates
    // the UI with cached data while fresh API calls resolve in the background.
    const [restaurants, setRestaurants] = useState(() => {
        const saved = localStorage.getItem('eazyfind_last_restaurants');
        return saved ? JSON.parse(saved) : [];
    });
    const [cities, setCities] = useState([]);
    const [cuisines, setCuisines] = useState([]);
    const [mealTypes, setMealTypes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [location, setLocation] = useState(null);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [isLocating, setIsLocating] = useState(false);
    // Suppress empty state flickering by tracking first-run completion.
    const [hasFetched, setHasFetched] = useState(false);
    const limit = 12;

    const [filters, setFilters] = useState(() => {
        // Fallback to previously successful city to minimize cold-start delays.
        const savedCity = localStorage.getItem('eazyfind_last_city');
        return {
            cuisines: '',
            mealTypes: '',
            max_cost: '',
            sort: 'discount',
            city: savedCity || '',
            q: ''
        };
    });

    const [searchInput, setSearchInput] = useState('');
    const [surpriseSpot, setSurpriseSpot] = useState(null);

    // Initial metadata fetch to populate filter options (cities, cuisines, meal types)
    // before the user begins interacting with the page.
    useEffect(() => {
        const fetchMetadata = async () => {
            try {
                const [citiesData, cuisinesData, mealTypesData] = await Promise.all([
                    getCities(),
                    getCuisines(),
                    getMealTypes()
                ]);
                setCities(citiesData || []);
                setCuisines(cuisinesData || []);
                setMealTypes(mealTypesData || []);
            } catch (err) {
                console.error("Failed to fetch metadata", err);
            }
        };
        fetchMetadata();
    }, []);

    // Automatic city detection based on geolocation. Falls back to a default city
    // if permissions are denied or detection fails.
    useEffect(() => {
        if (filters.city === '' && !location) {
            if (!navigator.geolocation) {
                setError('Geolocation is not supported by your browser');
                return;
            }

            setIsLocating(true);
            setError(null);

            const options = {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            };

            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;
                    setLocation({ lat, lon });
                    setIsLocating(false);

                    try {
                        const { detectCity } = await import('../api/client');
                        const data = await detectCity(lat, lon);
                        if (data && data.city) {
                            setFilters(prev => ({ ...prev, city: data.city.toLowerCase() }));
                        }
                    } catch (err) {
                        console.error("Failed to detect city", err);
                    }
                },
                (err) => {
                    setIsLocating(false);
                    let errorMsg = 'Could not get your location.';

                    if (err.code === 1) {
                        errorMsg = 'Location permission denied. Please enable it in your browser settings.';
                    } else if (err.code === 2) {
                        errorMsg = 'Location information is unavailable.';
                    } else if (err.code === 3) {
                        errorMsg = 'Location request timed out.';
                    }

                    console.warn(errorMsg, err);
                    setError(errorMsg + ' Falling back to Bengaluru.');
                    setFilters(prev => ({ ...prev, city: 'bengaluru' }));
                },
                options
            );
        }
    }, [filters.city, location]);

    const fetchData = useCallback(async (isNewSearch = false) => {
        if (filters.city === '' && !location) return;

        setLoading(true);
        setError(null);
        try {
            const currentPage = isNewSearch ? 1 : page;
            const params = {
                ...filters,
                limit: limit,
                page: currentPage
            };

            if (filters.city === '' && location) {
                params.lat = location.lat;
                params.lon = location.lon;
            }

            const data = await searchRestaurants(params);
            const resData = data.restaurants || [];
            const countData = data.total_count || 0;

            setRestaurants(resData);
            setTotalResults(countData);

            // Persist valid search results to enable "Instant Load" on next visit.
            // Only cache primary page results to keep the storage footprint lean.
            if (isNewSearch || (page === 1 && filters.city)) {
                localStorage.setItem('eazyfind_last_restaurants', JSON.stringify(resData));
                localStorage.setItem('eazyfind_last_count', countData.toString());
                localStorage.setItem('eazyfind_last_city', filters.city);
            }
        } catch (err) {
            console.error("Failed to fetch restaurants", err);
            const msg = err.response?.data?.message || err.message || 'System Glitch';
            setError(`Connection issue or data error (${msg}). Please refresh.`);
        } finally {
            setLoading(false);
            setHasFetched(true);
        }
    }, [filters, page, location]);

    useEffect(() => {
        // Trigger fresh fetch on mount and filter changes.
        // If we have cached results, the UI already shows them, making this quiet.
        fetchData();
    }, [fetchData]);

    // Updates filter state and resets pagination to ensure searches start from the first page.
    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setPage(1);
    };

    const handleSearch = (q) => {
        setFilters(prev => ({ ...prev, q }));
        setPage(1);
    };

    const handleSurpriseMe = () => {
        if (restaurants.length > 0) {
            const randomIndex = Math.floor(Math.random() * restaurants.length);
            setSurpriseSpot(restaurants[randomIndex]);
        }
    };

    const handlePageChange = (newPage) => {
        setPage(newPage);
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
            mainContent.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <div className="flex flex-col h-full overflow-hidden bg-white">
            <div className="flex-1 overflow-y-auto" id="main-content">
                <header className="bg-zinc-900 pt-16 pb-32 px-6 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-20">
                        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_120%,#f97316,transparent)]" />
                    </div>

                    <div className="max-w-7xl mx-auto relative z-10 text-center">

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-5xl md:text-7xl font-black text-white mb-12 tracking-tighter leading-none"
                        >
                            Hungry? <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-brand-600">Let's find something delicious.</span>
                        </motion.h1>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            <AutocompleteSearch
                                onSearch={handleSearch}
                                placeholder="Search for restaurants or cuisines..."
                            />
                        </motion.div>
                    </div>
                </header>

                <div className="max-w-7xl mx-auto px-6 relative z-20 py-12">
                    <div className="flex flex-col lg:flex-row gap-12">
                        <aside className="lg:w-80 flex-shrink-0">
                            <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl border border-zinc-100 lg:sticky lg:top-8">
                                <Filter
                                    filters={filters}
                                    onChange={handleFilterChange}
                                    cities={cities}
                                    cuisines={cuisines}
                                    mealTypes={mealTypes}
                                    isLocating={isLocating}
                                />
                            </div>
                        </aside>

                        <div className="flex-1">
                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                                <div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-1.5 h-1.5 bg-brand-600 rounded-full animate-pulse" />
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Live Discoveries</span>
                                    </div>
                                    <h2 className="text-5xl font-black text-zinc-900 tracking-tighter">
                                        {filters.city ? (filters.city.charAt(0).toUpperCase() + filters.city.slice(1)) : 'Nearby Spots'}
                                    </h2>
                                </div>
                                <div className="flex flex-wrap items-center gap-3">
                                    <span className="text-[10px] font-black text-zinc-400 bg-zinc-50 px-4 py-2 rounded-full border border-zinc-100 uppercase tracking-widest">
                                        {totalResults} spots found
                                    </span>
                                    <button
                                        onClick={handleSurpriseMe}
                                        disabled={restaurants.length === 0}
                                        className="inline-flex items-center gap-2 bg-brand-50 text-brand-700 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-brand-100 transition-colors border border-brand-100 disabled:opacity-50 disabled:cursor-not-allowed group whitespace-nowrap"
                                    >
                                        <Sparkles className="w-3 h-3 group-hover:animate-pulse" />
                                        Surprise Me
                                    </button>
                                </div>
                            </div>

                            {error && (
                                <div className="bg-rose-50 text-rose-600 p-6 rounded-[2rem] mb-8 flex items-center gap-4 border border-rose-100 shadow-sm">
                                    <div className="bg-rose-100 p-2 rounded-xl">
                                        <AlertCircle className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-black tracking-tight">
                                            {error.includes('permission') ? 'Location Blocked' : 'System Glitch'}
                                        </p>
                                        <p className="text-sm font-bold opacity-80">{error}</p>
                                    </div>
                                    <button
                                        onClick={() => window.location.reload()}
                                        className="text-xs font-black uppercase bg-white/20 px-4 py-2 rounded-lg hover:bg-white/30 transition-all border border-rose-200"
                                    >
                                        Try Again
                                    </button>
                                </div>
                            )}

                            {loading && restaurants.length === 0 ? (
                                <div className="grid gap-8 sm:grid-cols-1 lg:grid-cols-2">
                                    {[1, 2, 3, 4].map(i => (
                                        <RestaurantSkeleton key={i} />
                                    ))}
                                </div>
                            ) : (
                                <>
                                    <div className="grid gap-8 sm:grid-cols-1 lg:grid-cols-2">
                                        <AnimatePresence mode="popLayout">
                                            {restaurants.length === 0 ? (
                                                // Suppress the "empty state" during initial load to prevent visual flicker.
                                                // Only show if a confirmed fetch returns no results.
                                                hasFetched && !loading && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, scale: 0.95 }}
                                                        className="col-span-full py-20 text-center bg-zinc-50 rounded-[3rem] border border-dashed border-zinc-200"
                                                    >
                                                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                                                            <Search className="w-10 h-10 text-zinc-300" />
                                                        </div>
                                                        <h3 className="text-2xl font-black text-zinc-900 mb-2 tracking-tight">Oops! Nothing found here</h3>
                                                        <p className="text-zinc-500 font-bold max-w-xs mx-auto">
                                                            Maybe try a different search or clear some filters to see what else we have!
                                                        </p>
                                                    </motion.div>
                                                )
                                            ) : (
                                                restaurants.map((r, idx) => (
                                                    <motion.div
                                                        key={r.id}
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: idx * 0.05 }}
                                                    >
                                                        <RestaurantCard restaurant={r} />
                                                    </motion.div>
                                                ))
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    {restaurants.length > 0 && (
                                        <div className="mt-16 flex items-center justify-center gap-2">
                                            <button
                                                onClick={() => handlePageChange(Math.max(1, page - 1))}
                                                disabled={page === 1}
                                                className="p-4 rounded-2xl bg-white border border-zinc-200 text-zinc-400 hover:text-zinc-900 transition-all shadow-sm disabled:opacity-30 disabled:hover:text-zinc-400 group"
                                            >
                                                <ChevronLeft className="w-6 h-6 group-active:-translate-x-1 transition-transform" />
                                            </button>

                                            <div className="bg-white border border-zinc-200 px-8 py-4 rounded-2xl font-black text-zinc-900 shadow-sm flex items-center gap-4">
                                                <span className="text-zinc-400">Page</span>
                                                <span>{page}</span>
                                            </div>

                                            <button
                                                onClick={() => handlePageChange(page + 1)}
                                                disabled={page * limit >= totalResults}
                                                className="p-4 rounded-2xl bg-white border border-zinc-200 text-zinc-400 hover:text-zinc-900 transition-all shadow-sm disabled:opacity-30 disabled:hover:text-zinc-400 group"
                                            >
                                                <ChevronRight className="w-6 h-6 group-active:translate-x-1 transition-transform" />
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {surpriseSpot && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-zinc-900/60 backdrop-blur-md"
                        onClick={() => setSurpriseSpot(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="w-full max-w-lg relative"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="absolute -top-12 left-1/2 -translate-x-1/2 text-center w-full">
                                <motion.div
                                    animate={{ y: [0, -10, 0] }}
                                    transition={{ repeat: Infinity, duration: 2 }}
                                    className="bg-brand-500 text-white px-6 py-2 rounded-full font-black text-xs uppercase tracking-widest shadow-xl shadow-brand-500/40 inline-flex items-center gap-2"
                                >
                                    <Sparkles className="w-4 h-4" />
                                    Your Curated Match
                                </motion.div>
                            </div>

                            <button
                                onClick={() => setSurpriseSpot(null)}
                                className="absolute -right-2 -top-2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-xl z-20 hover:scale-110 transition-transform"
                            >
                                <X className="w-5 h-5 text-zinc-400" />
                            </button>

                            <div className="shadow-2xl shadow-black/50 rounded-[2.5rem] overflow-hidden">
                                <RestaurantCard restaurant={surpriseSpot} />
                            </div>

                            <div className="mt-8 text-center">
                                <button
                                    onClick={handleSurpriseMe}
                                    className="bg-white/20 backdrop-blur-md text-white px-8 py-3 rounded-full font-black text-xs uppercase tracking-[0.2em] hover:bg-white/30 transition-all border border-white/10"
                                >
                                    Not feeling it? Roll again
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {(loading || isLocating) && (
                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
                    <div className="bg-zinc-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 backdrop-blur-xl border border-white/10">
                        <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                        <span className="text-xs font-black uppercase tracking-widest">
                            {isLocating ? 'Finding where you are...' : 'Gathering the best spots for you...'}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}
