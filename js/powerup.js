// Power-up items for the game
class PowerUp {
    constructor(x, y, type) {
        this.position = new Vector2(x, y);
        this.velocity = new Vector2(0, Utils.random(1, 2));
        this.type = type || this.getRandomType();
        this.size = 8;
        this.rotation = 0;
        this.rotationSpeed = 0.1;
        this.pulseTime = 0;
        this.lifetime = 10; // 10 seconds before disappearing
        this.collected = false;
        
        // Set properties based on type
        this.setTypeProperties();
    }

    getRandomType() {
        const types = ['health', 'shield', 'speed', 'score'];
        return types[Utils.randomInt(0, types.length - 1)];
    }

    setTypeProperties() {
        switch(this.type) {
            case 'health':
                this.color = '#ff6b6b';
                this.symbol = '+';
                break;
            case 'shield':
                this.color = '#ffeaa7';
                this.symbol = '◆';
                break;
            case 'speed':
                this.color = '#4ecdc4';
                this.symbol = '▲';
                break;
            case 'score':
                this.color = '#96ceb4';
                this.symbol = '★';
                break;
        }
    }

    update(deltaTime, canvas) {
        // Update position
        this.position.add(this.velocity);
        this.rotation += this.rotationSpeed;
        this.pulseTime += deltaTime * 3;
        this.lifetime -= deltaTime;
        
        // Remove if off screen or expired
        if (this.position.y > canvas.height + this.size || this.lifetime <= 0) {
            return false;
        }
        
        return true;
    }

    checkCollision(player) {
        return Utils.circleCollision(
            this.position.x, this.position.y, this.size,
            player.position.x, player.position.y, player.size
        );
    }

    applyEffect(player, game, particleSystem) {
        this.collected = true;
        
        switch(this.type) {
            case 'health':
                if (game.gameMode === 'coop') {
                    // In co-op mode, restore shared lives
                    game.sharedLives = Math.min(game.sharedLives + 1, 5);
                } else {
                    // In single/vs mode, heal individual player
                    player.heal();
                }
                break;
            case 'shield':
                player.activateShield();
                // Additional shield sound effect
                setTimeout(() => game.audioSystem.play('shield'), 100);
                break;
            case 'speed':
                player.maxSpeed = Math.min(player.maxSpeed + 1, 8);
                setTimeout(() => {
                    player.maxSpeed = Math.max(player.maxSpeed - 1, 5);
                }, 5000);
                break;
            case 'score':
                game.score += 250; // Increased bonus points
                break;
        }
        
        // Create collection effect
        particleSystem.createCollectionEffect(this.position.x, this.position.y, this.color);
    }

    render(ctx) {
        if (this.collected) return;
        
        ctx.save();
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(this.rotation);
        
        // Pulsing effect
        const pulse = 1 + Math.sin(this.pulseTime) * 0.3;
        ctx.scale(pulse, pulse);
        
        // Draw glow
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size * 2);
        gradient.addColorStop(0, this.color + '80');
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(0, 0, this.size * 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw power-up base
        ctx.fillStyle = this.color;
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        
        // Draw hexagon
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI * 2;
            const x = Math.cos(angle) * this.size;
            const y = Math.sin(angle) * this.size;
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        // Draw symbol
        ctx.fillStyle = '#ffffff';
        ctx.font = `${this.size}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.symbol, 0, 0);
        
        // Warning flash when about to expire
        if (this.lifetime < 2) {
            ctx.fillStyle = '#ff6b6b80';
            ctx.beginPath();
            ctx.arc(0, 0, this.size * 1.5, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.restore();
    }
}