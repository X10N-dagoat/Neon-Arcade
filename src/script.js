let games = [];
let filteredGames = [];
let selectedCategory = 'All';
let searchQuery = '';

const homeView = document.getElementById('home-view');
const gameView = document.getElementById('game-view');
const gamesGrid = document.getElementById('games-grid');
const emptyState = document.getElementById('empty-state');
const searchInput = document.getElementById('search-input');
const categoryFilter = document.getElementById('category-filter');
const mainFooter = document.getElementById('main-footer');

const gameFrame = document.getElementById('game-frame');
const currentGameTitle = document.getElementById('current-game-title');
const currentGameCategory = document.getElementById('current-game-category');
const externalLink = document.getElementById('external-link');
const backButton = document.getElementById('back-button');
const closeGame = document.getElementById('close-game');
const fullscreenBtn = document.getElementById('fullscreen-btn');

// Initialize
async function init() {
    try {
        const response = await fetch('./src/games.json');
        games = await response.json();
        
        // Populate categories
        const categories = new Set(games.map(g => g.category));
        categories.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat;
            option.textContent = cat;
            option.className = 'bg-[#1a1a1a]';
            categoryFilter.appendChild(option);
        });

        renderGames();
    } catch (error) {
        console.error('Error loading games:', error);
    }
}

function renderGames() {
    filteredGames = games.filter(game => {
        const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            game.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || game.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    gamesGrid.innerHTML = '';
    
    if (filteredGames.length === 0) {
        gamesGrid.classList.add('hidden');
        emptyState.classList.remove('hidden');
    } else {
        gamesGrid.classList.remove('hidden');
        emptyState.classList.add('hidden');
        
        filteredGames.forEach((game, index) => {
            const card = document.createElement('div');
            card.className = 'game-card group relative bg-white/5 border border-white/10 rounded-2xl overflow-hidden cursor-pointer hover:border-[#ff4e00]/40 transition-all duration-300 fade-in';
            card.style.animationDelay = `${index * 0.05}s`;
            
            card.innerHTML = `
                <div class="aspect-[4/3] overflow-hidden relative">
                    <img
                        src="${game.thumbnail}"
                        alt="${game.title}"
                        class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        referrerpolicy="no-referrer"
                    />
                    <div class="absolute inset-0 bg-gradient-to-t from-[#0a0502] via-transparent to-transparent opacity-60"></div>
                    <div class="absolute top-4 left-4">
                        <span class="px-3 py-1 bg-black/60 backdrop-blur-md border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-wider text-[#00ffcc]">
                            ${game.category}
                        </span>
                    </div>
                </div>
                <div class="p-5">
                    <h3 class="text-xl font-bold mb-1 group-hover:text-[#ff4e00] transition-colors">${game.title}</h3>
                    <p class="text-white/40 text-sm line-clamp-2 leading-relaxed">${game.description}</p>
                </div>
            `;
            
            card.onclick = () => openGame(game);
            gamesGrid.appendChild(card);
        });
    }
}

function openGame(game) {
    homeView.classList.add('hidden');
    mainFooter.classList.add('hidden');
    gameView.classList.remove('hidden');
    gameView.classList.add('flex');
    
    gameFrame.src = game.url;
    currentGameTitle.textContent = game.title;
    currentGameCategory.textContent = game.category;
    externalLink.href = game.url;
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function closeGameView() {
    homeView.classList.remove('hidden');
    mainFooter.classList.remove('hidden');
    gameView.classList.add('hidden');
    gameView.classList.remove('flex');
    
    gameFrame.src = '';
}

// Event Listeners
searchInput.oninput = (e) => {
    searchQuery = e.target.value;
    renderGames();
};

categoryFilter.onchange = (e) => {
    selectedCategory = e.target.value;
    renderGames();
};

backButton.onclick = closeGameView;
closeGame.onclick = closeGameView;

fullscreenBtn.onclick = () => {
    if (gameFrame.requestFullscreen) {
        gameFrame.requestFullscreen();
    } else if (gameFrame.webkitRequestFullscreen) { /* Safari */
        gameFrame.webkitRequestFullscreen();
    } else if (gameFrame.msRequestFullscreen) { /* IE11 */
        gameFrame.msRequestFullscreen();
    }
};

init();
