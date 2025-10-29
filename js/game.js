// Main game class
class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = canvas.width;
        this.height = canvas.height;
        
        // Game state
        this.state = 'menu'; // 'menu', 'playing', 'gameOver'
        this.score = 0;
        this.highScore = this.loadHighScore();
        this.level = 1;
        this.lastTime = 0;
        
        // Game objects
        this.player = new Player(this.width / 2, this.height - 100);
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

        // Update player
        this.player.update(deltaTime, this.canvas, this.particleSystem, this.audioSystem);

        // Update asteroids
        for (let i = this.asteroids.length - 1; i >= 0; i--) {
            const asteroid = this.asteroids[i];
            asteroid.update(deltaTime, this.canvas);

            // Check collision with player
            if (asteroid.checkCollision(this.player)) {
                // Player takes damage
                if (this.player.takeDamage(this.particleSystem)) {
                    this.audioSystem.play('gameOver');
                    this.gameOver();
                    return;
                } else {
                    this.audioSystem.play('damage');
                }

                // Always remove/split the asteroid that hit the player
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

            // Check collision with player
            if (powerUp.checkCollision(this.player)) {
                this.audioSystem.play('powerup');
                powerUp.applyEffect(this.player, this, this.particleSystem);
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

            // Render player
            this.player.render(this.ctx);

            // Update UI
            this.updateUI();
        }
    }

    updateUI() {
        document.getElementById('scoreValue').textContent = this.score;
        document.getElementById('livesValue').textContent = this.player.health;
        document.getElementById('levelValue').textContent = this.level;
        document.getElementById('highScoreValue').textContent = this.highScore;
    }

    startGame() {
        this.state = 'playing';
        this.score = 0;
        this.level = 1;
        this.player = new Player(this.width / 2, this.height - 100);
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
        
        // Hide start screen
        document.getElementById('startScreen').classList.add('hidden');
        document.getElementById('gameOverScreen').classList.add('hidden');
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
        
        // Create final explosion
        this.particleSystem.createExplosion(this.player.position.x, this.player.position.y, 30, '#ff6b6b');
    }

    restart() {
        this.startGame();
    }

    loadHighScore() {
        const saved = localStorage.getItem('spaceExplorerHighScore');
        return saved ? parseInt(saved) : 0;
    }

    saveHighScore() {
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('spaceExplorerHighScore', this.highScore.toString());
        }
    }
}