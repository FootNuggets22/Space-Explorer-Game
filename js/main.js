// Main entry point
let game;
let lastTime = 0;

function init() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    
    // Initialize game
    game = new Game(canvas);
    
    // Initialize high score display
    document.getElementById('highScoreValue').textContent = game.highScore;
    
    // Setup event listeners
    document.getElementById('startBtn').addEventListener('click', () => {
        game.startGame();
    });
    
    document.getElementById('restartBtn').addEventListener('click', () => {
        game.restart();
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