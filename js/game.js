// Main game class
class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = canvas.width;
        this.height = canvas.height;
        
        // Game state
        this.state = 'menu'; // 'menu', 'playerCount', 'modeSelection', 'playing', 'gameOver', 'winner'
        this.gameMode = 'single'; // 'single', 'vs', 'coop'
        this.playerCount = 1; // 1 or 2
        this.score = 0;
        this.highScore = 0; // Will be loaded when mode is selected
        this.level = 1;
        this.lastTime = 0;
        this.sharedLives = 5; // For co-op mode
        
        // Game objects - will be initialized based on game mode
        this.player1 = null;
        this.player2 = null;
        this.players = [];
        this.asteroids = [];
        this.powerUps = [];
        this.particleSystem = new ParticleSystem();
        this.audioSystem = new AudioSystem();
        
        // Timers
        this.asteroidSpawnTimer = 0;
        this.powerUpSpawnTimer = 0;
        this.backgroundTimer = 0;
        
        // Input handling
        this.input = {
            keys: {}
        };
        
        // Game settings
        this.asteroidSpawnRate = 2; // seconds
        this.powerUpSpawnRate = 8; // seconds
        this.difficultyIncreaseRate = 30; // seconds
        this.difficultyTimer = 0;
        
        this.setupEventListeners();
        this.initializeGame();
    }

    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            this.input.keys[e.code] = true;
        });

        document.addEventListener('keyup', (e) => {
            this.input.keys[e.code] = false;
        });

        // Prevent page scrolling with arrow keys
        document.addEventListener('keydown', (e) => {
            if(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
                e.preventDefault();
            }
        });
    }

    initializeGame() {
        // Create initial asteroids
        for (let i = 0; i < 3; i++) {
            this.spawnAsteroid();
        }
    }

    spawnAsteroid() {
        const x = Utils.random(0, this.width);
        const y = -50;
        const asteroid = new Asteroid(x, y, 'large');
        this.asteroids.push(asteroid);
    }

    spawnPowerUp() {
        const x = Utils.random(50, this.width - 50);
        const y = -20;
        const powerUp = new PowerUp(x, y);
        this.powerUps.push(powerUp);
    }

    update(deltaTime) {
        if (this.state !== 'playing') return;

        // Update timers
        this.asteroidSpawnTimer += deltaTime;
        this.powerUpSpawnTimer += deltaTime;
        this.backgroundTimer += deltaTime;
        this.difficultyTimer += deltaTime;

        // Spawn asteroids
        if (this.asteroidSpawnTimer >= this.asteroidSpawnRate) {
            this.spawnAsteroid();
            this.asteroidSpawnTimer = 0;
        }

        // Spawn power-ups
        if (this.powerUpSpawnTimer >= this.powerUpSpawnRate) {
            this.spawnPowerUp();
            this.powerUpSpawnTimer = 0;
        }

        // Create background stars
        if (this.backgroundTimer >= 0.1) {
            this.particleSystem.createStar(Utils.random(0, this.width), -5);
            this.backgroundTimer = 0;
        }

        // Increase difficulty
        if (this.difficultyTimer >= this.difficultyIncreaseRate) {
            this.level++;
            this.audioSystem.play('levelUp');
            this.audioSystem.updateMusicLevel(this.level); // Update music intensity
            this.asteroidSpawnRate = Math.max(0.5, this.asteroidSpawnRate - 0.1);
            this.difficultyTimer = 0;
        }

        // Update players
        this.players.forEach(player => {
            player.update(deltaTime, this.canvas, this.particleSystem, this.audioSystem);
        });

        // Update asteroids
        for (let i = this.asteroids.length - 1; i >= 0; i--) {
            const asteroid = this.asteroids[i];
            asteroid.update(deltaTime, this.canvas);

            // Check collision with both players
            let asteroidHit = false;
            for (let j = 0; j < this.players.length; j++) {
                const player = this.players[j];
                if (asteroid.checkCollision(player)) {
                    // Handle damage based on game mode
                    if (this.gameMode === 'coop') {
                        // In co-op mode, reduce shared lives
                        if (!player.invulnerable && !player.shield) {
                            this.sharedLives--;
                            player.invulnerable = true;
                            player.invulnerabilityTime = 1.5;
                            
                            // Create damage effect
                            this.particleSystem.createExplosion(player.position.x, player.position.y, 15, '#ff6b6b');
                            
                            if (this.sharedLives <= 0) {
                                this.audioSystem.play('gameOver');
                                this.gameOver();
                                return;
                            } else {
                                this.audioSystem.play('damage');
                            }
                        }
                    } else {
                        // In single/vs mode, player takes individual damage
                        if (player.takeDamage(this.particleSystem)) {
                            if (this.gameMode === 'single') {
                                this.audioSystem.play('gameOver');
                                this.gameOver();
                                return;
                            } else if (this.gameMode === 'vs') {
                                // Check for winner in VS mode
                                const winner = player === this.player1 ? this.player2 : this.player1;
                                this.audioSystem.play('gameOver');
                                this.showWinner(winner);
                                return;
                            }
                        } else {
                            this.audioSystem.play('damage');
                        }
                    }
                    asteroidHit = true;
                    break; // One collision per asteroid
                }
            }

            // Remove/split asteroid if it was hit
            if (asteroidHit) {
                this.audioSystem.play('asteroid');
                asteroid.split(this.asteroids, this.particleSystem);
                this.asteroids.splice(i, 1);
            }
        }

        // Update power-ups
        for (let i = this.powerUps.length - 1; i >= 0; i--) {
            const powerUp = this.powerUps[i];
            
            if (!powerUp.update(deltaTime, this.canvas)) {
                this.powerUps.splice(i, 1);
                continue;
            }

            // Check collision with both players
            let powerUpCollected = false;
            for (let j = 0; j < this.players.length; j++) {
                const player = this.players[j];
                if (powerUp.checkCollision(player)) {
                    this.audioSystem.play('powerup');
                    powerUp.applyEffect(player, this, this.particleSystem);
                    powerUpCollected = true;
                    break; // One collection per power-up
                }
            }

            if (powerUpCollected) {
                this.powerUps.splice(i, 1);
            }
        }

        // Update particle system
        this.particleSystem.update(deltaTime);

        // Update score based on time survived
        if (deltaTime > 0) {
            const pointsPerSecond = 25 + (this.level - 1) * 10; // 25, 35, 45, 55, etc.
            this.score += Math.ceil(deltaTime * pointsPerSecond);
        }
    }

    render() {
        // Clear canvas
        this.ctx.fillStyle = 'rgba(12, 12, 12, 0.1)';
        this.ctx.fillRect(0, 0, this.width, this.height);

        if (this.state === 'playing') {
            // Render particles (background)
            this.particleSystem.render(this.ctx);

            // Render asteroids
            this.asteroids.forEach(asteroid => asteroid.render(this.ctx));

            // Render power-ups
            this.powerUps.forEach(powerUp => powerUp.render(this.ctx));

            // Render players
            this.players.forEach(player => player.render(this.ctx));

            // Update UI
            this.updateUI();
        }
    }

    updateUI() {
        document.getElementById('scoreValue').textContent = this.score;
        
        if (this.gameMode === 'single') {
            document.getElementById('livesValue').textContent = this.player1.health;
        } else if (this.gameMode === 'vs') {
            document.getElementById('livesValue').textContent = `P1: ${this.player1.health} | P2: ${this.player2.health}`;
        } else if (this.gameMode === 'coop') {
            document.getElementById('livesValue').textContent = `Team Lives: ${this.sharedLives}`;
        }
        
        document.getElementById('levelValue').textContent = this.level;
        document.getElementById('highScoreValue').textContent = this.highScore;
    }

    startGame(mode = 'single') {
        this.startGameWithControls(mode, 'WASD');
    }

    startGameWithControls(mode = 'single', controls = 'WASD') {
        this.state = 'playing';
        this.gameMode = mode;
        this.score = 0;
        this.level = 1;
        this.sharedLives = 5; // Reset shared lives for co-op mode
        
        // Load high score for this specific mode
        this.highScore = this.getCurrentModeHighScore();
        
        // Initialize players based on game mode
        if (mode === 'single') {
            this.player1 = new Player(this.width / 2, this.height - 100, controls, 1);
            this.players = [this.player1];
        } else if (mode === 'vs') {
            this.player1 = new Player(this.width / 3, this.height - 100, 'WASD', 1);
            this.player2 = new Player((this.width * 2) / 3, this.height - 100, 'ARROWS', 2);
            this.players = [this.player1, this.player2];
        } else if (mode === 'coop') {
            this.player1 = new Player(this.width / 3, this.height - 100, 'WASD', 1);
            this.player2 = new Player((this.width * 2) / 3, this.height - 100, 'ARROWS', 2);
            this.players = [this.player1, this.player2];
        }
        
        this.asteroids = [];
        this.powerUps = [];
        this.particleSystem.clear();
        this.asteroidSpawnTimer = 0;
        this.powerUpSpawnTimer = 0;
        this.difficultyTimer = 0;
        this.asteroidSpawnRate = 2;
        
        // Start background music
        this.audioSystem.startBackgroundMusic(this.level);
        
        this.initializeGame();
        
        // Hide all screens and show game
        document.getElementById('startScreen').classList.add('hidden');
        document.getElementById('playerCountScreen').classList.add('hidden');
        document.getElementById('playerSelectionScreen').classList.add('hidden');
        document.getElementById('gameOverScreen').classList.add('hidden');
        document.getElementById('winnerScreen').classList.add('hidden');
    }

    showPlayerCount() {
        this.state = 'playerCount';
        document.getElementById('startScreen').classList.add('hidden');
        document.getElementById('playerSelectionScreen').classList.add('hidden');
        document.getElementById('gameOverScreen').classList.add('hidden');
        document.getElementById('winnerScreen').classList.add('hidden');
        document.getElementById('playerCountScreen').classList.remove('hidden');
    }

    showModeSelection(playerCount) {
        this.state = 'modeSelection';
        this.playerCount = playerCount;
        
        // Hide all other screens
        document.getElementById('startScreen').classList.add('hidden');
        document.getElementById('playerCountScreen').classList.add('hidden');
        document.getElementById('gameOverScreen').classList.add('hidden');
        document.getElementById('winnerScreen').classList.add('hidden');
        
        // Populate mode selection based on player count
        this.populateModeSelection(playerCount);
        
        document.getElementById('playerSelectionScreen').classList.remove('hidden');
    }

    populateModeSelection(playerCount) {
        const modeButtons = document.getElementById('modeButtons');
        const title = document.getElementById('modeSelectionTitle');
        const desc = document.getElementById('modeSelectionDesc');
        
        if (playerCount === 1) {
            title.textContent = 'Single Player Mode';
            desc.textContent = 'Choose your control scheme';
            
            // Get high score for single player mode
            const singleHighScore = this.getHighScoreForMode('single');
            
            modeButtons.innerHTML = `
                <button id="singlePlayerBtn" class="mode-btn">
                    <div class="mode-icon">⌨️</div>
                    <div class="mode-title">WASD Controls</div>
                    <div class="mode-desc">Use W/A/S/D keys to move<br/>3 Lives<br/><span class="high-score-text">High Score: ${singleHighScore}</span></div>
                </button>
                <button id="singleArrowBtn" class="mode-btn">
                    <div class="mode-icon">🔼</div>
                    <div class="mode-title">Arrow Controls</div>
                    <div class="mode-desc">Use Arrow keys to move<br/>3 Lives<br/><span class="high-score-text">High Score: ${singleHighScore}</span></div>
                </button>
            `;
        } else {
            title.textContent = 'Two Player Mode';
            desc.textContent = 'Choose your game style';
            
            // Get high scores for multiplayer modes
            const vsHighScore = this.getHighScoreForMode('vs');
            const coopHighScore = this.getHighScoreForMode('coop');
            
            modeButtons.innerHTML = `
                <button id="vsPlayerBtn" class="mode-btn">
                    <div class="mode-icon">⚔️</div>
                    <div class="mode-title">VS Mode</div>
                    <div class="mode-desc">P1: WASD, P2: Arrow keys<br/>3 Lives each - Last player standing wins!<br/><span class="high-score-text">High Score: ${vsHighScore}</span></div>
                </button>
                <button id="coopPlayerBtn" class="mode-btn">
                    <div class="mode-icon">🤝</div>
                    <div class="mode-title">Co-op Mode</div>
                    <div class="mode-desc">P1: WASD, P2: Arrow keys<br/>5 Shared Lives - Work together!<br/><span class="high-score-text">High Score: ${coopHighScore}</span></div>
                </button>
            `;
        }
    }

    getHighScoreForMode(mode) {
        const baseKey = 'spaceExplorerHighScore';
        const key = `${baseKey}_${mode}`;
        const saved = localStorage.getItem(key);
        return saved ? parseInt(saved) : 0;
    }

    showWinner(winnerPlayer) {
        this.state = 'winner';
        
        // Stop background music
        this.audioSystem.stopBackgroundMusic();
        
        // Check and save high score
        this.saveHighScore();
        
        // Show winner screen
        const playerName = winnerPlayer === this.player1 ? 'Player 1' : 'Player 2';
        document.getElementById('winnerTitle').textContent = `${playerName} Wins!`;
        document.getElementById('winnerFinalScore').textContent = this.score;
        document.getElementById('winnerHighScore').textContent = this.highScore;
        
        document.getElementById('winnerScreen').classList.remove('hidden');
        
        // Create celebration effects
        this.particleSystem.createExplosion(winnerPlayer.position.x, winnerPlayer.position.y, 50, '#ffd700');
        
        // Play winner sound (you could add a specific winner sound effect)
        setTimeout(() => this.audioSystem.play('levelUp'), 500);
    }

    gameOver() {
        this.state = 'gameOver';
        
        // Stop background music
        this.audioSystem.stopBackgroundMusic();
        
        // Check if this is a new high score
        const isNewHighScore = this.score > this.highScore;
        
        // Check and save high score
        this.saveHighScore();
        
        // Show game over screen
        document.getElementById('finalScore').textContent = this.score;
        document.getElementById('finalHighScore').textContent = this.highScore;
        
        // Add "NEW HIGH SCORE!" message if applicable
        const gameOverTitle = document.querySelector('#gameOverScreen h2');
        if (isNewHighScore && this.score > 0) {
            gameOverTitle.innerHTML = 'NEW HIGH SCORE!<br><span style="font-size: 0.7em; color: #ffeaa7;">Game Over</span>';
        } else {
            gameOverTitle.textContent = 'Game Over';
        }
        
        document.getElementById('gameOverScreen').classList.remove('hidden');
        
        // Create final explosion for both players
        this.players.forEach(player => {
            if (player.health <= 0) {
                this.particleSystem.createExplosion(player.position.x, player.position.y, 30, '#ff6b6b');
            }
        });
    }

    restart() {
        this.showPlayerCount();
    }

    showPlayerSelection() {
        this.showPlayerCount();
    }

    showMainMenu() {
        this.state = 'menu';
        document.getElementById('startScreen').classList.remove('hidden');
        document.getElementById('playerCountScreen').classList.add('hidden');
        document.getElementById('playerSelectionScreen').classList.add('hidden');
        document.getElementById('gameOverScreen').classList.add('hidden');
        document.getElementById('winnerScreen').classList.add('hidden');
    }

    loadHighScore() {
        const key = this.getHighScoreKey();
        const saved = localStorage.getItem(key);
        return saved ? parseInt(saved) : 0;
    }

    saveHighScore() {
        if (this.score > this.highScore) {
            this.highScore = this.score;
            const key = this.getHighScoreKey();
            localStorage.setItem(key, this.highScore.toString());
        }
    }

    getHighScoreKey() {
        const baseKey = 'spaceExplorerHighScore';
        switch(this.gameMode) {
            case 'single':
                return `${baseKey}_single`;
            case 'vs':
                return `${baseKey}_vs`;
            case 'coop':
                return `${baseKey}_coop`;
            default:
                return baseKey;
        }
    }

    getCurrentModeHighScore() {
        const key = this.getHighScoreKey();
        const saved = localStorage.getItem(key);
        return saved ? parseInt(saved) : 0;
    }
}