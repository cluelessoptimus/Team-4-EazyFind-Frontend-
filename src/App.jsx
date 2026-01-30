import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SearchPage from './pages/SearchPage';

// App serves as the root layout and routing hub, delegating to functional pages
// like SearchPage based on the current URL.
function App() {
    return (
        <Router>
            <div className="h-screen w-screen overflow-hidden bg-zinc-50 text-zinc-900 font-sans flex flex-col">
                <header className="bg-white/80 backdrop-blur-md border-b border-zinc-200 z-50 flex-shrink-0">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-brand-500/30">
                                E
                            </div>
                            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-zinc-900 to-zinc-600 tracking-tight">
                                EazyFind
                            </h1>
                        </div>
                        <div className="text-sm font-medium text-zinc-500">
                            Discover Great Eats
                        </div>
                    </div>
                </header>
                <main className="flex-1 overflow-hidden relative">
                    <Routes>
                        <Route path="/" element={<SearchPage />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;
