import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Gamepad2, X, Maximize2, ExternalLink, Filter, ChevronLeft } from 'lucide-react';
import gamesData from './games.json';

export default function App() {
  const [selectedGame, setSelectedGame] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = useMemo(() => {
    const cats = new Set(gamesData.map(g => g.category));
    return ['All', ...Array.from(cats)];
  }, []);

  const filteredGames = useMemo(() => {
    return gamesData.filter(game => {
      const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          game.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || game.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-[#0a0502] text-white font-sans selection:bg-[#ff4e00] selection:text-white">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#ff4e00]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#00ffcc]/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {!selectedGame ? (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              {/* Header */}
              <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-br from-[#ff4e00] to-[#ff8c00] rounded-2xl shadow-[0_0_20px_rgba(255,78,0,0.3)]">
                    <Gamepad2 className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold tracking-tighter bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                      NEON ARCADE
                    </h1>
                    <p className="text-white/40 text-sm font-medium tracking-widest uppercase">Unblocked & Unfiltered</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Search */}
                  <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within:text-[#ff4e00] transition-colors" />
                    <input
                      type="text"
                      placeholder="Search games..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full sm:w-64 pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-[#ff4e00]/50 focus:ring-1 focus:ring-[#ff4e00]/50 transition-all placeholder:text-white/20"
                    />
                  </div>

                  {/* Category Filter */}
                  <div className="relative group">
                    <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within:text-[#00ffcc] transition-colors" />
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full sm:w-48 pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-[#00ffcc]/50 focus:ring-1 focus:ring-[#00ffcc]/50 transition-all appearance-none cursor-pointer"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat} className="bg-[#1a1a1a] text-white">{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </header>

              {/* Games Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredGames.map((game, index) => (
                  <motion.div
                    key={game.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ y: -8 }}
                    onClick={() => setSelectedGame(game)}
                    className="group relative bg-white/5 border border-white/10 rounded-2xl overflow-hidden cursor-pointer hover:border-[#ff4e00]/40 transition-all duration-300"
                  >
                    <div className="aspect-[4/3] overflow-hidden relative">
                      <img
                        src={game.thumbnail}
                        alt={game.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0502] via-transparent to-transparent opacity-60" />
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-black/60 backdrop-blur-md border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-wider text-[#00ffcc]">
                          {game.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="text-xl font-bold mb-1 group-hover:text-[#ff4e00] transition-colors">{game.title}</h3>
                      <p className="text-white/40 text-sm line-clamp-2 leading-relaxed">{game.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {filteredGames.length === 0 && (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                  <div className="p-6 bg-white/5 rounded-full mb-4">
                    <Search className="w-12 h-12 text-white/20" />
                  </div>
                  <h3 className="text-2xl font-bold text-white/60">No games found</h3>
                  <p className="text-white/30">Try adjusting your search or category filter</p>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="game-view"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col h-[calc(100vh-4rem)]"
            >
              {/* Game Header */}
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={() => setSelectedGame(null)}
                  className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all group"
                >
                  <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                  <span className="font-medium">Back to Arcade</span>
                </button>

                <div className="flex items-center gap-4">
                  <div className="hidden sm:block text-right">
                    <h2 className="text-xl font-bold">{selectedGame.title}</h2>
                    <p className="text-white/40 text-xs uppercase tracking-widest">{selectedGame.category}</p>
                  </div>
                  <div className="flex gap-2">
                    <a
                      href={selectedGame.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all"
                      title="Open in new tab"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </a>
                    <button
                      onClick={() => setSelectedGame(null)}
                      className="p-2 bg-[#ff4e00]/10 hover:bg-[#ff4e00]/20 border border-[#ff4e00]/20 rounded-lg text-[#ff4e00] transition-all"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Game Frame */}
              <div className="flex-1 bg-black rounded-3xl overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative group">
                <iframe
                  src={selectedGame.url}
                  className="w-full h-full border-none"
                  title={selectedGame.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
                
                {/* Overlay Controls */}
                <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    className="p-3 bg-black/60 backdrop-blur-md border border-white/10 rounded-2xl hover:bg-[#ff4e00] transition-all"
                    onClick={() => {
                      const iframe = document.querySelector('iframe');
                      if (iframe?.requestFullscreen) iframe.requestFullscreen();
                    }}
                  >
                    <Maximize2 className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      {!selectedGame && (
        <footer className="relative z-10 border-t border-white/5 mt-24 py-12">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Gamepad2 className="w-5 h-5 text-[#ff4e00]" />
              <span className="font-bold tracking-tighter">NEON ARCADE</span>
            </div>
            <p className="text-white/20 text-sm">
              Built for speed. Optimized for fun. Unblocked for everyone.
            </p>
          </div>
        </footer>
      )}
    </div>
  );
}
