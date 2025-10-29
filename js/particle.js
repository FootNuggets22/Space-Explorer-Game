// Particle system for visual effects
class Particle {
    constructor(x, y, color = '#ffffff', size = 2, life = 1) {
        this.position = new Vector2(x, y);
        this.velocity = new Vector2(
            Utils.random(-2, 2),
            Utils.random(-2, 2)
        );
        this.color = color;
        this.size = size;
        this.life = life;
        this.maxLife = life;
        this.alpha = 1;
        this.gravity = 0;
        this.friction = 0.98;
    }

    update(deltaTime) {
        // Apply velocity
        this.position.add(this.velocity);
        
        // Apply friction
        this.velocity.multiply(this.friction);
        
        // Apply gravity
        this.velocity.y += this.gravity;
        
        // Update life
        this.life -= deltaTime;
        this.alpha = this.life / this.maxLife;
        
        return this.life > 0;
    }

    render(ctx) {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

// Particle system manager
class ParticleSystem {
    constructor() {
        this.particles = [];
    }

    // Create explosion effect
    createExplosion(x, y, count = 10, color = '#ff6b6b') {
        for (let i = 0; i < count; i++) {
            const particle = new Particle(x, y, color, Utils.random(2, 5), Utils.random(0.5, 1.5));
            particle.velocity = new Vector2(
                Utils.random(-5, 5),
                Utils.random(-5, 5)
            );
            particle.friction = 0.95;
            this.particles.push(particle);
        }
    }

    // Create trail effect
    createTrail(x, y, color = '#4ecdc4') {
        const particle = new Particle(x, y, color, Utils.random(1, 3), Utils.random(0.3, 0.8));
        particle.velocity = new Vector2(
            Utils.random(-1, 1),
            Utils.random(-1, 1)
        );
        this.particles.push(particle);
    }

    // Create power-up collection effect
    createCollectionEffect(x, y, color = '#ffeaa7') {
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const particle = new Particle(x, y, color, 3, 1);
            particle.velocity = new Vector2(
                Math.cos(angle) * 3,
                Math.sin(angle) * 3
            );
            particle.friction = 0.92;
            this.particles.push(particle);
        }
    }

    // Create stars background effect
    createStar(x, y) {
        const particle = new Particle(x, y, '#ffffff', Utils.random(0.5, 2), Utils.random(5, 10));
        particle.velocity = new Vector2(0, Utils.random(0.5, 2));
        particle.friction = 1;
        this.particles.push(particle);
    }

    update(deltaTime) {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            if (!this.particles[i].update(deltaTime)) {
                this.particles.splice(i, 1);
            }
        }
    }

    render(ctx) {
        this.particles.forEach(particle => particle.render(ctx));
    }

    clear() {
        this.particles = [];
    }
}