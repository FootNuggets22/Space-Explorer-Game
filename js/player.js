// Player spaceship class
class Player {
    constructor(x, y) {
        this.position = new Vector2(x, y);
        this.velocity = new Vector2(0, 0);
        this.size = 12;
        this.maxSpeed = 5;
        this.acceleration = 0.3;
        this.friction = 0.95;
        this.rotation = 0;
        this.health = 3;
        this.maxHealth = 3;
        this.invulnerable = false;
        this.invulnerabilityTime = 0;
        this.trailTimer = 0;
        this.shield = false;
        this.shieldTime = 0;
    }

    update(deltaTime, canvas, particleSystem, audioSystem) {
        // Handle input
        this.handleInput(audioSystem);
        
        // Apply friction
        this.velocity.multiply(this.friction);
        
        // Update position
        this.position.add(this.velocity);
        
        // Keep player within bounds
        this.position.x = Utils.clamp(this.position.x, this.size, canvas.width - this.size);
        this.position.y = Utils.clamp(this.position.y, this.size, canvas.height - this.size);
        
        // Update invulnerability
        if (this.invulnerable) {
            this.invulnerabilityTime -= deltaTime;
            if (this.invulnerabilityTime <= 0) {
                this.invulnerable = false;
            }
        }
        
        // Update shield
        if (this.shield) {
            this.shieldTime -= deltaTime;
            if (this.shieldTime <= 0) {
                this.shield = false;
            }
        }
        
        // Create trail effect
        this.trailTimer += deltaTime;
        if (this.trailTimer > 0.05) {
            particleSystem.createTrail(
                this.position.x - Math.cos(this.rotation) * this.size,
                this.position.y - Math.sin(this.rotation) * this.size,
                this.shield ? '#ffeaa7' : '#4ecdc4'
            );
            this.trailTimer = 0;
        }
        
        // Update rotation based on movement
        if (this.velocity.magnitude() > 0.1) {
            this.rotation = Math.atan2(this.velocity.y, this.velocity.x);
        }
    }

    handleInput(audioSystem) {
        const keys = game.input.keys;
        
        // Movement
        if (keys['KeyW'] || keys['ArrowUp']) {
            this.velocity.y -= this.acceleration;
        }
        if (keys['KeyS'] || keys['ArrowDown']) {
            this.velocity.y += this.acceleration;
        }
        if (keys['KeyA'] || keys['ArrowLeft']) {
            this.velocity.x -= this.acceleration;
        }
        if (keys['KeyD'] || keys['ArrowRight']) {
            this.velocity.x += this.acceleration;
        }
        
        // Limit speed
        const speed = this.velocity.magnitude();
        if (speed > this.maxSpeed) {
            this.velocity.normalize().multiply(this.maxSpeed);
        }
    }

    takeDamage(particleSystem) {
        if (this.invulnerable || this.shield) return false;
        
        this.health--;
        this.invulnerable = true;
        this.invulnerabilityTime = 1.5; // Reduced from 2 seconds to 1.5 seconds
        
        // Create damage effect
        particleSystem.createExplosion(this.position.x, this.position.y, 15, '#ff6b6b');
        
        return this.health <= 0;
    }

    heal() {
        this.health = Math.min(this.health + 1, this.maxHealth);
    }

    activateShield() {
        this.shield = true;
        this.shieldTime = 5; // 5 seconds of shield
    }

    render(ctx) {
        ctx.save();
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(this.rotation);
        
        // Enhanced invulnerability visual effects
        if (this.invulnerable) {
            const time = Date.now();
            
            // Faster flickering effect
            if (Math.floor(time / 80) % 2) {
                ctx.globalAlpha = 0.3;
            }
            
            // Pulsing red outline to indicate damage immunity
            const pulse = (Math.sin(time * 0.01) + 1) * 0.5; // 0 to 1
            ctx.strokeStyle = `rgba(255, 107, 107, ${0.5 + pulse * 0.5})`;
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.arc(0, 0, this.size + 8 + pulse * 4, 0, Math.PI * 2);
            ctx.stroke();
            
            // Additional inner glow
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.3 + pulse * 0.4})`;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(0, 0, this.size + 6, 0, Math.PI * 2);
            ctx.stroke();
        }
        
        // Draw shield
        if (this.shield) {
            ctx.strokeStyle = '#ffeaa7';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(0, 0, this.size + 5, 0, Math.PI * 2);
            ctx.stroke();
        }
        
        // Draw spaceship
        ctx.fillStyle = '#45b7d1';
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        
        ctx.beginPath();
        // Main body
        ctx.moveTo(this.size, 0);
        ctx.lineTo(-this.size/2, -this.size/2);
        ctx.lineTo(-this.size/4, 0);
        ctx.lineTo(-this.size/2, this.size/2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        // Engine glow
        ctx.fillStyle = '#ff6b6b';
        ctx.beginPath();
        ctx.moveTo(-this.size/2, -this.size/4);
        ctx.lineTo(-this.size, 0);
        ctx.lineTo(-this.size/2, this.size/4);
        ctx.closePath();
        ctx.fill();
        
        ctx.restore();
    }
}