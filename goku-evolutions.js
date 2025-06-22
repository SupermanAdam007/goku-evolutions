// Goku Evolution System for Button Hold Game
// Maps time thresholds to Goku transformations with smooth transitions

class GokuEvolutionSystem {
    constructor() {
        this.evolutions = [];
        this.currentEvolution = null;
        this.evolutionContainer = null;
        this.evolutionImage = null;
        this.evolutionName = null;
        this.isInitialized = false;
        
        this.loadEvolutionData();
    }

    async loadEvolutionData() {
        try {
            const response = await fetch('./goku-evolutions-local.json');
            const data = await response.json();
            this.processEvolutionData(data);
            console.log('🐉 Successfully loaded local Goku evolution data!');
        } catch (error) {
            console.warn('Failed to load Goku evolution data:', error);
            this.evolutions = [];
        }
    }

    processEvolutionData(data) {
        // Map Goku evolutions to time thresholds (in seconds)
        const timeThresholds = [
            { time: 0, name: "Base" },
            { time: 2, name: "Kaio-Ken x2" },
            { time: 5, name: "Kaio-Ken x4" },
            { time: 8, name: "Kaio-Ken x10" },
            { time: 12, name: "Kaio-Ken x20" },
            { time: 18, name: "Super Saiyan" },
            { time: 25, name: "Super Saiyan 2" },
            { time: 35, name: "Super Saiyan 3" },
            { time: 50, name: "Super Saiyan God" },
            { time: 70, name: "Super Saiyan Blue" },
            { time: 100, name: "Ultra Instinct Sign" },
            { time: 150, name: "Mastered Ultra Instinct" },
            { time: 200, name: "True Ultra Instinct" }
        ];

        // Create evolution mapping
        this.evolutions = timeThresholds.map(threshold => {
            const evolutionData = data.find(evo => evo.name === threshold.name);
            if (evolutionData) {
                return {
                    time: threshold.time,
                    name: evolutionData.name,
                    image: evolutionData.image,
                    powerLevel: evolutionData.attributes["Power Level"],
                    multiplier: evolutionData.attributes["Multiplier"] || ""
                };
            }
            return null;
        }).filter(Boolean);

        console.log('Loaded Goku evolutions:', this.evolutions.length);
    }

    initializeUI() {
        if (this.isInitialized) return;

        // Find existing Goku elements in the new interface
        this.evolutionImage = document.getElementById('goku-character');
        this.evolutionName = document.getElementById('goku-name');
        this.evolutionPowerLevel = document.getElementById('goku-power-level');

        if (!this.evolutionImage || !this.evolutionName || !this.evolutionPowerLevel) {
            console.warn('Goku evolution UI elements not found');
            return;
        }

        this.isInitialized = true;
        console.log('Goku evolution system initialized with new interface');
    }

    updateEvolution(timeInSeconds) {
        if (!this.isInitialized) {
            this.initializeUI();
        }

        if (this.evolutions.length === 0) return;

        // Find the current evolution based on time
        let targetEvolution = this.evolutions[0]; // Default to base form
        
        for (let i = this.evolutions.length - 1; i >= 0; i--) {
            if (timeInSeconds >= this.evolutions[i].time) {
                targetEvolution = this.evolutions[i];
                break;
            }
        }

        // Only update if evolution has changed
        if (!this.currentEvolution || this.currentEvolution.name !== targetEvolution.name) {
            this.transitionToEvolution(targetEvolution);
        }
    }

    transitionToEvolution(evolution) {
        if (!this.evolutionImage || !this.evolutionName || !this.evolutionPowerLevel) return;

        this.currentEvolution = evolution;

        // Add evolution effect to character holder
        const characterHolder = document.getElementById('goku-character-holder');
        if (characterHolder) {
            characterHolder.classList.add('evolving');
        }

        // Preload the new image with fallback handling for local images
        const newImage = new Image();
        
        newImage.onload = () => {
            // Update the display with local image
            this.evolutionImage.src = evolution.image;
            this.evolutionImage.alt = evolution.name;
            this.evolutionImage.style.display = 'block';
            this.evolutionName.textContent = evolution.name;
            this.evolutionPowerLevel.textContent = `Power Level: ${evolution.powerLevel}`;

            console.log(`✨ Evolution: ${evolution.name} loaded successfully!`);

            // Remove transition class after a short delay
            setTimeout(() => {
                if (characterHolder) {
                    characterHolder.classList.remove('evolving');
                }
            }, 600);
        };

        newImage.onerror = () => {
            console.warn('Failed to load local Goku evolution image:', evolution.image);
            // Use Base Goku as fallback image
            this.evolutionImage.src = './images/goku/base.jpg';
            this.evolutionImage.alt = evolution.name + ' (Base Goku fallback)';
            this.evolutionImage.style.display = 'block';
            this.evolutionName.textContent = evolution.name;
            this.evolutionPowerLevel.textContent = `Power Level: ${evolution.powerLevel}`;
            
            if (characterHolder) {
                characterHolder.classList.remove('evolving');
            }
        };

        // Load the local image
        newImage.src = evolution.image;
    }

    getCurrentEvolution() {
        return this.currentEvolution;
    }

    getEvolutionForTime(timeInSeconds) {
        if (this.evolutions.length === 0) return null;

        for (let i = this.evolutions.length - 1; i >= 0; i--) {
            if (timeInSeconds >= this.evolutions[i].time) {
                return this.evolutions[i];
            }
        }
        return this.evolutions[0];
    }

    getNextEvolution(timeInSeconds) {
        if (this.evolutions.length === 0) return null;

        // Find the next evolution after the current time
        for (let i = 0; i < this.evolutions.length; i++) {
            if (timeInSeconds < this.evolutions[i].time) {
                return this.evolutions[i];
            }
        }
        
        // If we're at the maximum evolution, return null
        return null;
    }

    getEvolutionThreshold(evolutionName) {
        if (this.evolutions.length === 0) return 0;

        const evolution = this.evolutions.find(evo => evo.name === evolutionName);
        return evolution ? evolution.time : 0;
    }

    // Generate share text including current evolution
    generateShareText(timeInSeconds) {
        const evolution = this.getEvolutionForTime(timeInSeconds);
        if (evolution) {
            return `I just held a button for ${timeInSeconds.toFixed(2)} seconds and reached ${evolution.name} (${evolution.powerLevel})! Can you beat my power level? 💪⚡`;
        }
        return `I just held a button for ${timeInSeconds.toFixed(2)} seconds! Can you beat my time? 💪`;
    }
}

// Export for use in main script
window.GokuEvolutionSystem = GokuEvolutionSystem; 