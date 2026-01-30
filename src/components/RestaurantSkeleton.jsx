import React from 'react';
import { motion } from 'framer-motion';

// RestaurantSkeleton mirrors the RestaurantCard's layout to eliminate 
// Layout Shift (CLS) during asynchronous data fetching.
export default function RestaurantSkeleton() {
    return (
        <div className="bg-white rounded-[2rem] overflow-hidden border border-zinc-100 shadow-sm h-full flex flex-col">
            <div className="relative h-48 bg-zinc-100 animate-pulse overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
            </div>
            <div className="p-6 space-y-4 flex-1">
                <div className="space-y-2">
                    <div className="h-6 w-3/4 bg-zinc-100 rounded-lg animate-pulse" />
                    <div className="h-4 w-1/2 bg-zinc-50 rounded-lg animate-pulse" />
                </div>
                <div className="pt-4 border-t border-zinc-50 flex items-center justify-between">
                    <div className="h-4 w-20 bg-zinc-100 rounded-lg animate-pulse" />
                    <div className="h-4 w-12 bg-zinc-50 rounded-lg animate-pulse" />
                </div>
            </div>
        </div>
    );
}
