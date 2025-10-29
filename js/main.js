// Main entry point
let game;
let lastTime = 0;

function init() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    
    // Initialize game
    game = new Game(canvas);
    
    // Initialize high score display (will be 0 until mode is selected)
    document.getElementById('highScoreValue').textContent = '0';
    
    // Setup event listeners
    document.getElementById('startBtn').addEventListener('click', () => {
        game.showPlayerCount();
    });
    
    // Player count selection
    document.getElementById('onePlayerBtn').addEventListener('click', () => {
        game.showModeSelection(1);
    });
    
    document.getElementById('twoPlayerBtn').addEventListener('click', () => {
        game.showModeSelection(2);
    });
    
    // Back buttons
    document.getElementById('backToTitleBtn').addEventListener('click', () => {
        game.showMainMenu();
    });
    
    document.getElementById('backToPlayerCountBtn').addEventListener('click', () => {
        game.showPlayerCount();
    });
    
    // Restart buttons
    document.getElementById('restartBtn').addEventListener('click', () => {
        game.restart();
    });
    
    document.getElementById('winnerRestartBtn').addEventListener('click', () => {
        game.restart();
    });
    
    // Mode selection - need to use event delegation since buttons are dynamically created
    document.getElementById('modeButtons').addEventListener('click', (e) => {
        if (e.target.id === 'singlePlayerBtn') {
            game.startGameWithControls('single', 'WASD');
        } else if (e.target.id === 'singleArrowBtn') {
            game.startGameWithControls('single', 'ARROWS');
        } else if (e.target.id === 'vsPlayerBtn') {
            game.startGame('vs');
        } else if (e.target.id === 'coopPlayerBtn') {
            game.startGame('coop');
        } else if (e.target.closest('.mode-btn')) {
            // Handle clicks on child elements of mode buttons
            const button = e.target.closest('.mode-btn');
            if (button.id === 'singlePlayerBtn') {
                game.startGameWithControls('single', 'WASD');
            } else if (button.id === 'singleArrowBtn') {
                game.startGameWithControls('single', 'ARROWS');
            } else if (button.id === 'vsPlayerBtn') {
                game.startGame('vs');
            } else if (button.id === 'coopPlayerBtn') {
                game.startGame('coop');
            }
        }
    });
    
    // Audio toggle button
    document.getElementById('audioToggle').addEventListener('click', () => {
        const isEnabled = game.audioSystem.toggle();
        document.getElementById('audioToggle').textContent = isEnabled ? '🔊' : '🔇';
    });
    
    // Start game loop
    gameLoop();
}

function gameLoop(currentTime = 0) {
    const deltaTime = (currentTime - lastTime) / 1000;
    lastTime = currentTime;
    
    // Prevent large deltaTime on first frame or after pauses
    const clampedDeltaTime = Math.min(deltaTime, 0.016); // Cap at ~60fps
    
    // Update and render
    game.update(clampedDeltaTime);
    game.render();
    
    // Continue loop
    requestAnimationFrame(gameLoop);
}

// Start when page loads
document.addEventListener('DOMContentLoaded', init);