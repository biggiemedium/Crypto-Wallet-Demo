class ParticleAnimation {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.canvas.className = 'particles';
        document.body.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        this.particlesArray = [];
        this.numberOfParticles = 40;

        this.init();
        this.animate();

        window.addEventListener('resize', () => this.resize());
    }

    init() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        for (let i = 0; i < this.numberOfParticles; i++) {
            this.particlesArray.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 2 + 1,
                speedX: Math.random() * 0.5 - 0.25,
                speedY: Math.random() * 0.5 - 0.25,
                color: this.getRandomColor()
            });
        }
    }

    getRandomColor() {
        const colors = [
            'rgba(109, 86, 193, 0.4)', // Primary
            'rgba(0, 184, 212, 0.4)',  // Secondary
            'rgba(134, 87, 255, 0.4)', // Accent
            'rgba(0, 229, 255, 0.4)'   // Accent Alt
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let i = 0; i < this.particlesArray.length; i++) {
            let particle = this.particlesArray[i];

            particle.x += particle.speedX;
            particle.y += particle.speedY;

            if (particle.x > this.canvas.width || particle.x < 0) {
                particle.speedX = -particle.speedX;
            }
            if (particle.y > this.canvas.height || particle.y < 0) {
                particle.speedY = -particle.speedY;
            }

            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = particle.color;
            this.ctx.fill();

            // Connect particles with lines if they are close enough
            for (let j = i; j < this.particlesArray.length; j++) {
                const dx = this.particlesArray[i].x - this.particlesArray[j].x;
                const dy = this.particlesArray[i].y - this.particlesArray[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 100) {
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = this.particlesArray[i].color;
                    this.ctx.lineWidth = 0.2;
                    this.ctx.moveTo(this.particlesArray[i].x, this.particlesArray[i].y);
                    this.ctx.lineTo(this.particlesArray[j].x, this.particlesArray[j].y);
                    this.ctx.stroke();
                }
            }
        }

        requestAnimationFrame(() => this.animate());
    }
}