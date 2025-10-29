// Asteroid class for obstacles
class Asteroid {
    constructor(x, y, size = 'large') {
        this.position = new Vector2(x, y);
        this.velocity = new Vector2(
            Utils.random(-2, 2),
            Utils.random(1, 3)
        );
        this.rotation = 0;
        this.rotationSpeed = Utils.random(-0.05, 0.05);
        
        // Size variants
        this.sizeType = size;
        switch(size) {
            case 'large':
                this.radius = Utils.random(20, 30);
                this.health = 3;
                break;
            case 'medium':
                this.radius = Utils.random(12, 18);
                this.health = 2;
                break;
            case 'small':
                this.radius = Utils.random(6, 10);
                this.health = 1;
                break;
        }
        
        this.color = Utils.getRandomColor();
        this.vertices = this.generateVertices();
        this.glowIntensity = Utils.random(0.5, 1);
    }

    generateVertices() {
        const vertices = [];
        const sides = Utils.randomInt(6, 10);
        
        for (let i = 0; i < sides; i++) {
            const angle = (i / sides) * Math.PI * 2;
            const radius = this.radius + Utils.random(-this.radius * 0.3, this.radius * 0.3);
            vertices.push({
                x: Math.cos(angle) * radius,
                y: Math.sin(angle) * radius
            });
        }
        
        return vertices;
    }

    update(deltaTime, canvas) {
        // Update position
        this.position.add(this.velocity);
        this.rotation += this.rotationSpeed;
        
        // Wrap around screen
        if (this.position.x < -this.radius) {
            this.position.x = canvas.width + this.radius;
        } else if (this.position.x > canvas.width + this.radius) {
            this.position.x = -this.radius;
        }
        
        if (this.position.y > canvas.height + this.radius) {
            this.position.y = -this.radius;
            this.position.x = Utils.random(0, canvas.width);
        }
    }

    takeDamage(particleSystem) {
        this.health--;
        
        // Create damage effect
        particleSystem.createExplosion(this.position.x, this.position.y, 8, this.color);
        
        return this.health <= 0;
    }

    split(asteroids, particleSystem) {
        if (this.sizeType === 'large') {
            // Split into 2-3 medium asteroids
            const count = Utils.randomInt(2, 3);
            for (let i = 0; i < count; i++) {
                const asteroid = new Asteroid(
                    this.position.x + Utils.random(-20, 20),
                    this.position.y + Utils.random(-20, 20),
                    'medium'
                );
                asteroid.velocity = new Vector2(
                    Utils.random(-3, 3),
                    Utils.random(-1, 2)
                );
                asteroids.push(asteroid);
            }
        } else if (this.sizeType === 'medium') {
            // Split into 2-4 small asteroids
            const count = Utils.randomInt(2, 4);
            for (let i = 0; i < count; i++) {
                const asteroid = new Asteroid(
                    this.position.x + Utils.random(-15, 15),
                    this.position.y + Utils.random(-15, 15),
                    'small'
                );
                asteroid.velocity = new Vector2(
                    Utils.random(-4, 4),
                    Utils.random(-2, 3)
                );
                asteroids.push(asteroid);
            }
        }
        
        // Create destruction effect
        particleSystem.createExplosion(this.position.x, this.position.y, 20, this.color);
    }

    checkCollision(other) {
        return Utils.circleCollision(
            this.position.x, this.position.y, this.radius,
            other.position.x, other.position.y, other.size
        );
    }

    render(ctx) {
        ctx.save();
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(this.rotation);
        
        // Draw glow effect
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.radius * 1.5);
        gradient.addColorStop(0, this.color + '30');
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(0, 0, this.radius * 1.5, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw asteroid
        ctx.fillStyle = this.color;
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        
        ctx.beginPath();
        this.vertices.forEach((vertex, index) => {
            if (index === 0) {
                ctx.moveTo(vertex.x, vertex.y);
            } else {
                ctx.lineTo(vertex.x, vertex.y);
            }
        });
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        // Add some internal details
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        for (let i = 0; i < 3; i++) {
            const startVertex = this.vertices[Utils.randomInt(0, this.vertices.length - 1)];
            const endVertex = this.vertices[Utils.randomInt(0, this.vertices.length - 1)];
            ctx.moveTo(startVertex.x * 0.5, startVertex.y * 0.5);
            ctx.lineTo(endVertex.x * 0.5, endVertex.y * 0.5);
        }
        ctx.stroke();
        
        ctx.restore();
    }
}