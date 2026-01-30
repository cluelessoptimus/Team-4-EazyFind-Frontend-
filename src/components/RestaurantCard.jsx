import { Star, IndianRupee, MapPin, Navigation, Tag, Timer } from 'lucide-react';
import { motion } from 'framer-motion';

// RestaurantCard displays a visual and data summary of a restaurant, 
// highlighting ratings, active offers, and key metadata.
export default function RestaurantCard({ restaurant }) {
    const getPlaceholderImage = () => {
        return "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=600&auto=format&fit=crop";
    };

    return (
        <motion.div
            whileHover={{ y: -8 }}
            className="group bg-white rounded-[2rem] shadow-sm hover:shadow-2xl transition-all duration-500 border border-zinc-100 overflow-hidden flex flex-col h-full relative"
        >
            <div className="h-48 bg-zinc-100 relative overflow-hidden">
                <img
                    src={restaurant.image_url || getPlaceholderImage()}
                    alt={restaurant.restaurant_name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {restaurant.rating >= 4.5 && (
                        <span className="bg-amber-400 text-amber-950 text-[10px] font-black uppercase tracking-tighter px-3 py-1.5 rounded-full shadow-lg backdrop-blur-md animate-pulse-subtle">
                            Top Choice
                        </span>
                    )}
                    {restaurant.effective_discount > 0 && (
                        <span className="bg-rose-600 text-white text-[11px] font-black uppercase tracking-tighter px-3 py-1.5 rounded-full shadow-xl backdrop-blur-md ring-2 ring-white/20">
                            {Math.round(restaurant.effective_discount * 100)}% OFF
                        </span>
                    )}
                </div>

                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-xl px-2.5 py-1.5 rounded-2xl shadow-xl flex items-center gap-1.5 text-xs font-black text-zinc-800 border border-white/20">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    {restaurant.rating}
                </div>

                {restaurant.offers && restaurant.offers.length > 0 && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-r from-rose-600 to-orange-500 text-white px-4 py-3 text-[11px] font-black flex items-center gap-2 shadow-2xl backdrop-blur-sm border-t border-white/10">
                        <Tag className="w-3.5 h-3.5" />
                        <span className="flex-1 truncate uppercase tracking-widest">{restaurant.offers[0].description}</span>
                        {restaurant.offers[0].code && (
                            <span className="bg-white/20 backdrop-blur-md px-2 py-0.5 rounded text-[9px] font-bold border border-white/30 tracking-wider">
                                {restaurant.offers[0].code}
                            </span>
                        )}
                    </div>
                )}
            </div>

            <div className="p-6 flex flex-col flex-grow">
                <div className="flex justify-between items-start gap-4 mb-2">
                    <div>
                        <h3 className="text-xl font-black text-zinc-900 line-clamp-1 group-hover:text-brand-600 transition-colors tracking-tight">
                            {restaurant.restaurant_name}
                        </h3>
                        <div className="flex items-center gap-1.5 text-zinc-400 mt-1">
                            <MapPin className="w-3.5 h-3.5 text-zinc-300" />
                            <p className="text-xs font-bold uppercase tracking-widest whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px]">
                                {restaurant.area || 'Premium Spot'}
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                        {restaurant.distance > 0 && (
                            <div className="flex items-center gap-1 text-zinc-400 text-[10px] font-black uppercase tracking-tighter bg-zinc-50 px-2 py-1 rounded-lg border border-zinc-100">
                                <Navigation className="w-2.5 h-2.5" />
                                {restaurant.distance < 1000
                                    ? `${Math.round(restaurant.distance)}m`
                                    : `${(restaurant.distance / 1000).toFixed(1)}km`}
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex flex-wrap gap-1.5 my-4">
                    {restaurant.cuisines?.slice(0, 3).map((cuisine, idx) => (
                        <span key={idx} className="text-[10px] font-bold text-zinc-500 bg-zinc-50 px-2.5 py-1 rounded-lg border border-zinc-100 group-hover:bg-white group-hover:border-zinc-200 transition-colors">
                            {typeof cuisine === 'string' ? cuisine : (cuisine.cuisine_name || cuisine.name)}
                        </span>
                    ))}
                </div>

                <div className="mt-auto pt-6 flex items-center justify-between border-t border-zinc-50">
                    <div className="flex items-center gap-1.5">
                        <div className="bg-emerald-50 text-emerald-700 p-1.5 rounded-lg border border-emerald-100">
                            <IndianRupee className="w-3.5 h-3.5" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-zinc-400 uppercase leading-none mb-0.5 tracking-widest">Two People</p>
                            <p className="text-sm font-black text-zinc-800 tracking-tight">₹{restaurant.cost_for_two}</p>
                        </div>
                    </div>

                    <button className="flex items-center justify-center bg-zinc-900 hover:bg-black text-white px-6 py-2.5 rounded-xl text-xs font-black transition-all shadow-lg active:scale-95 group-hover:shadow-zinc-200">
                        Reserve Now
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
