// Utility functions for the game

// Mathematical utilities
const Utils = {
    // Calculate distance between two points
    distance(x1, y1, x2, y2) {
        return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    },

    // Generate random number between min and max
    random(min, max) {
        return Math.random() * (max - min) + min;
    },

    // Generate random integer between min and max
    randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    // Clamp value between min and max
    clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    },

    // Linear interpolation
    lerp(start, end, factor) {
        return start + (end - start) * factor;
    },

    // Normalize angle to 0-2π range
    normalizeAngle(angle) {
        while (angle < 0) angle += Math.PI * 2;
        while (angle >= Math.PI * 2) angle -= Math.PI * 2;
        return angle;
    },

    // Check collision between two circles
    circleCollision(x1, y1, r1, x2, y2, r2) {
        return this.distance(x1, y1, x2, y2) < r1 + r2;
    },

    // Get random color from a palette
    getRandomColor() {
        const colors = [
            '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', 
            '#ffeaa7', '#dda0dd', '#98d8c8', '#f7dc6f'
        ];
        return colors[this.randomInt(0, colors.length - 1)];
    }
};

// Vector2 class for 2D vector operations
class Vector2 {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    // Add another vector
    add(vector) {
        this.x += vector.x;
        this.y += vector.y;
        return this;
    }

    // Subtract another vector
    subtract(vector) {
        this.x -= vector.x;
        this.y -= vector.y;
        return this;
    }

    // Multiply by scalar
    multiply(scalar) {
        this.x *= scalar;
        this.y *= scalar;
        return this;
    }

    // Get magnitude
    magnitude() {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }

    // Normalize vector
    normalize() {
        const mag = this.magnitude();
        if (mag > 0) {
            this.x /= mag;
            this.y /= mag;
        }
        return this;
    }

    // Copy vector
    copy() {
        return new Vector2(this.x, this.y);
    }

    // Set values
    set(x, y) {
        this.x = x;
        this.y = y;
        return this;
    }
}