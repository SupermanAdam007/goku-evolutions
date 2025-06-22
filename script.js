// Main game state and configuration
class ButtonHoldGame {
    constructor() {
        // Game state
        this.isHolding = false;
        this.startTime = null;
        this.currentTime = 0;
        this.animationFrame = null;

        
        // Last session time for sharing
        this.lastSessionTime = 0;
        
        // DOM elements
        this.elements = {};
        this.bindElements();
        
        // YouTube player
        this.youtubePlayer = null;
        this.youtubeReady = false;
        
        // Achievement tracking
        this.shownAchievements = new Set();
        
        // PWA support
        this.deferredPrompt = null;
        this.isInstalled = false;
        
        // Initialize Goku evolution system
        this.gokuSystem = new GokuEvolutionSystem();
        
        // Initialize everything
        this.setupEventListeners();
        this.setupPWA();
        
        // Initialize YouTube player if API is ready
        if (window.youTubeAPIReady || (window.YT && window.YT.Player)) {
            this.initializeYouTubePlayer();
        }
        
        console.log('🎮 Button Hold Game initialized!');
    }
    
    // Bind all DOM elements
    bindElements() {
        this.elements = {
            gokuCharacter: document.getElementById('goku-character'),
            gokuCharacterHolder: document.getElementById('goku-character-holder'),
            timerText: document.getElementById('timer-text'),
            progressRing: document.getElementById('progress-ring-fill'),

            shareBtn: document.getElementById('share-btn'),
            shareModal: document.getElementById('share-modal'),
            closeShareModal: document.getElementById('close-share-modal'),
            shareTimeValue: document.getElementById('share-time-value'),
            shareTwitter: document.getElementById('share-twitter'),
            shareFacebook: document.getElementById('share-facebook'),
            shareLinkedIn: document.getElementById('share-linkedin'),
            shareReddit: document.getElementById('share-reddit'),
            shareWhatsApp: document.getElementById('share-whatsapp'),
            shareTelegram: document.getElementById('share-telegram'),
            shareDiscord: document.getElementById('share-discord'),
            shareTikTok: document.getElementById('share-tiktok'),
            shareCopy: document.getElementById('share-copy'),
            shareNative: document.getElementById('share-native'),
            viralTextContent: document.getElementById('viral-text-content'),
            copyViralText: document.getElementById('copy-viral-text'),
            achievementPopup: document.getElementById('achievement-popup'),
            achievementTitle: document.getElementById('achievement-title'),
            achievementDescription: document.getElementById('achievement-description'),
            installBanner: document.getElementById('install-banner'),
            installBtn: document.getElementById('install-btn'),
            dismissInstall: document.getElementById('dismiss-install'),
            loading: document.getElementById('loading'),
            gokuName: document.getElementById('goku-name'),
            gokuPowerLevel: document.getElementById('goku-power-level'),
            // Music elements
            bgm: document.getElementById('bgm'),
            musicToggle: document.getElementById('music-toggle'),
            // Progress bar elements
            evolutionProgressFill: document.getElementById('evolution-progress-fill'),
            currentEvolution: document.getElementById('current-evolution'),
            nextEvolution: document.getElementById('next-evolution'),
            timeToEvolution: document.getElementById('time-to-evolution'),
            // YouTube elements
            youtubeBackground: document.getElementById('youtube-background'),
            youtubePlayer: document.getElementById('youtube-player')
        };
    }
    
    // Setup all event listeners
    setupEventListeners() {
        // Goku character hold events (mouse)
        this.elements.gokuCharacter.addEventListener('mousedown', (e) => {
            e.preventDefault();
            this.startHolding();
        });
        
        document.addEventListener('mouseup', () => {
            if (this.isHolding) {
                this.stopHolding();
            }
        });
        
        // Goku character hold events (touch)
        this.elements.gokuCharacter.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.startHolding();
        });
        
        document.addEventListener('touchend', () => {
            if (this.isHolding) {
                this.stopHolding();
            }
        });
        
        // Prevent context menu on Goku character
        this.elements.gokuCharacter.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
        
        // Share functionality
        this.elements.shareBtn.addEventListener('click', () => {
            this.openShareModal();
        });
        
        this.elements.closeShareModal.addEventListener('click', () => {
            this.closeShareModal();
        });
        
        this.elements.shareModal.addEventListener('click', (e) => {
            if (e.target === this.elements.shareModal) {
                this.closeShareModal();
            }
        });
        
        // Social sharing buttons
        this.elements.shareTwitter.addEventListener('click', () => {
            this.shareToTwitter();
        });
        
        this.elements.shareFacebook.addEventListener('click', () => {
            this.shareToFacebook();
        });
        
        this.elements.shareLinkedIn.addEventListener('click', () => {
            this.shareToLinkedIn();
        });
        
        this.elements.shareReddit.addEventListener('click', () => {
            this.shareToReddit();
        });
        
        this.elements.shareWhatsApp.addEventListener('click', () => {
            this.shareToWhatsApp();
        });
        
        this.elements.shareTelegram.addEventListener('click', () => {
            this.shareToTelegram();
        });
        
        this.elements.shareDiscord.addEventListener('click', () => {
            this.shareToDiscord();
        });
        
        this.elements.shareTikTok.addEventListener('click', () => {
            this.shareToTikTok();
        });
        
        this.elements.shareCopy.addEventListener('click', () => {
            this.copyShareLink();
        });
        
                this.elements.shareNative.addEventListener('click', () => {
            this.shareNative();
        });
        
        // Copy viral text
        this.elements.copyViralText.addEventListener('click', () => {
            this.copyViralText();
        });

        
        
        // PWA install
        this.elements.installBtn.addEventListener('click', () => {
            this.installPWA();
        });
        
        this.elements.dismissInstall.addEventListener('click', () => {
            this.dismissInstallBanner();
        });
        
        // Music toggle
        this.elements.musicToggle.addEventListener('click', () => {
            this.toggleMusic();
        });
        
        // Keyboard support
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' || e.code === 'Enter') {
                e.preventDefault();
                if (!this.isHolding) {
                    this.startHolding();
                }
            }
        });
        
        document.addEventListener('keyup', (e) => {
            if (e.code === 'Space' || e.code === 'Enter') {
                e.preventDefault();
                if (this.isHolding) {
                    this.stopHolding();
                }
            }
        });
        
        // Prevent accidental navigation
        window.addEventListener('beforeunload', (e) => {
            if (this.isHolding) {
                e.preventDefault();
                e.returnValue = 'You are currently holding the button! Are you sure you want to leave?';
                return e.returnValue;
            }
        });
        
        // Visibility change (tab switching)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden && this.isHolding) {
                this.stopHolding();
            }
        });
    }
    
    // Start holding Goku
    startHolding() {
        if (this.isHolding) return;
        
        this.isHolding = true;
        this.startTime = performance.now();
        this.currentTime = 0;
        
        // Visual feedback - add holding class to Goku character
        this.elements.gokuCharacter.classList.add('holding');
        
        // Start background music
        this.playMusic();
        
        // Start YouTube video
        this.playYouTubeVideo();
        
        // Start the timer loop
        this.updateTimer();
        
        console.log('🎯 Started holding Goku!');
    }
    
    // Stop holding Goku
    stopHolding() {
        if (!this.isHolding) return;
        
        this.isHolding = false;
        
        // Stop animation frame
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
        }
        
        // Visual feedback - remove holding class from Goku character
        this.elements.gokuCharacter.classList.remove('holding');
        
        // Stop background music and reset to beginning
        this.pauseMusic();
        this.resetMusicToBeginning();
        
        // Pause YouTube video
        this.pauseYouTubeVideo();
        
        // Final time calculation
        const finalTime = this.currentTime;
        
        // Store session time for sharing
        this.lastSessionTime = finalTime;
        
        // Check for achievements
        this.checkAchievements(finalTime);
        
        // Auto-show share dialog immediately for maximum viral reach
        setTimeout(() => {
            this.openShareModal();
        }, 500); // Small delay to let user see their final time
        
        // Reset progress ring
        this.updateProgressRing(0);
        
        console.log(`🏁 Stopped holding! Final time: ${finalTime.toFixed(2)}s`);
    }
    
    // Update timer (called via requestAnimationFrame)
    updateTimer() {
        if (!this.isHolding) return;
        
        this.currentTime = (performance.now() - this.startTime) / 1000;
        
        // Update timer display
        this.elements.timerText.textContent = `${this.currentTime.toFixed(2)}s`;
        
        // Update progress ring
        this.updateProgressRing(this.currentTime);
        
        // Update evolution progress bar
        this.updateEvolutionProgress();
        
        // Update Goku evolution
        this.gokuSystem.updateEvolution(this.currentTime);
        
        // Continue the loop
        this.animationFrame = requestAnimationFrame(() => this.updateTimer());
    }
    

    
    // Update progress ring
    updateProgressRing(time) {
        // Progress ring fills up over 60 seconds, then repeats
        const maxTime = 60;
        const progress = (time % maxTime) / maxTime;
        const circumference = 2 * Math.PI * 90; // radius = 90
        const offset = circumference - (progress * circumference);
        
        this.elements.progressRing.style.strokeDashoffset = offset;
    }
    

    

    
    // Check for achievements
    checkAchievements(time) {
        const achievement = this.getAchievement(time);
        if (achievement) {
            this.showAchievement(achievement);
        }
    }
    
    // Get achievement based on time (simple achievement system)
    getAchievement(time) {
        const achievements = [
            { time: 5, title: "Getting Started!", description: "You held for 5 seconds!" },
            { time: 10, title: "Steady Hands", description: "10 seconds of pure focus!" },
            { time: 30, title: "Patience Master", description: "30 seconds! You're getting good at this!" },
            { time: 60, title: "One Minute Wonder", description: "A full minute of button holding!" },
            { time: 120, title: "Two Minute Champion", description: "Your patience is legendary!" },
            { time: 300, title: "Five Minute Legend", description: "You've achieved button holding mastery!" }
        ];
        
        // Find the highest achievement unlocked for this time
        let unlockedAchievement = null;
        for (const achievement of achievements) {
            if (time >= achievement.time) {
                unlockedAchievement = achievement;
            } else {
                break;
            }
        }
        
        // Only show achievement if it's new (not shown before for this session)
        if (unlockedAchievement && !this.shownAchievements) {
            this.shownAchievements = new Set();
        }
        
        if (unlockedAchievement && !this.shownAchievements.has(unlockedAchievement.time)) {
            this.shownAchievements.add(unlockedAchievement.time);
            return unlockedAchievement;
        }
        
        return null;
    }
    
    // Show achievement popup
    showAchievement(achievement) {
        this.elements.achievementTitle.textContent = achievement.title;
        this.elements.achievementDescription.textContent = achievement.description;
        
        this.elements.achievementPopup.classList.remove('hidden');
        
        // Auto-hide after 4 seconds
        setTimeout(() => {
            this.elements.achievementPopup.classList.add('hidden');
        }, 4000);
    }
    

    
    // Open share modal
    openShareModal() {
        const time = this.lastSessionTime;
        if (time === 0) return;
        
        this.elements.shareTimeValue.textContent = `${time.toFixed(2)}s`;
        
        // Update viral text content
        const currentEvolution = this.gokuSystem ? this.gokuSystem.getEvolutionForTime(time) : null;
        const viralMessage = this.getViralShareMessage(time, currentEvolution);
        this.elements.viralTextContent.textContent = viralMessage;
        
        // Show native share button if supported
        if (navigator.share) {
            this.elements.shareNative.classList.remove('hidden');
        }
        
        this.elements.shareModal.classList.remove('hidden');
    }
    
    // Close share modal
    closeShareModal() {
        this.elements.shareModal.classList.add('hidden');
    }
    
    // Share to Twitter
    shareToTwitter() {
        // Simply open Twitter - user will paste the copied text
        const twitterUrl = `https://twitter.com/intent/tweet`;
        window.open(twitterUrl, '_blank', 'width=550,height=420');
    }
    
    // Share to Facebook
    shareToFacebook() {
        // Simply open Facebook - user will paste the copied text
        const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`;
        window.open(fbUrl, '_blank', 'width=580,height=296');
    }
    
    // Copy viral text to clipboard
    async copyViralText() {
        const viralText = this.elements.viralTextContent.textContent;
        
        try {
            await navigator.clipboard.writeText(viralText);
            
            // Visual feedback
            const originalText = this.elements.copyViralText.textContent;
            this.elements.copyViralText.textContent = '✅ Copied!';
            this.elements.copyViralText.classList.add('copied');
            
            setTimeout(() => {
                this.elements.copyViralText.textContent = originalText;
                this.elements.copyViralText.classList.remove('copied');
            }, 2000);
            
        } catch (error) {
            console.warn('Could not copy text to clipboard:', error);
            // Fallback for older browsers
            this.fallbackCopyText(viralText);
        }
    }
    
    // Fallback copy method for older browsers
    fallbackCopyText(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
            
            // Visual feedback
            const originalText = this.elements.copyViralText.textContent;
            this.elements.copyViralText.textContent = '✅ Copied!';
            this.elements.copyViralText.classList.add('copied');
            
            setTimeout(() => {
                this.elements.copyViralText.textContent = originalText;
                this.elements.copyViralText.classList.remove('copied');
            }, 2000);
            
        } catch (error) {
            console.warn('Fallback copy failed:', error);
            // Show alert as last resort
            alert(`Copy this text:\n\n${text}`);
        } finally {
            document.body.removeChild(textArea);
        }
    }
    
    // Copy share link
    async copyShareLink() {
        const time = this.lastSessionTime;
        const currentEvolution = this.gokuSystem ? this.gokuSystem.getEvolutionForTime(time) : null;
        const text = this.getViralShareMessage(time, currentEvolution);
        const shareText = `${text}\n\n${window.location.href}`;
        
        try {
            await navigator.clipboard.writeText(shareText);
            this.elements.shareCopy.innerHTML = '<span>✅ Copied!</span>';
            setTimeout(() => {
                this.elements.shareCopy.innerHTML = '<span>📋 Copy Link</span>';
            }, 2000);
        } catch (error) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = shareText;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            
            this.elements.shareCopy.innerHTML = '<span>✅ Copied!</span>';
            setTimeout(() => {
                this.elements.shareCopy.innerHTML = '<span>📋 Copy Link</span>';
            }, 2000);
        }
    }
    
    // Native share (mobile)
    async shareNative() {
        const time = this.lastSessionTime;
        const currentEvolution = this.gokuSystem ? this.gokuSystem.getEvolutionForTime(time) : null;
        const text = this.getViralShareMessage(time, currentEvolution);
        
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'How Long Can You Hold This Button?',
                    text: text,
                    url: window.location.href
                });
            } catch (error) {
                console.log('Native sharing cancelled or failed:', error);
            }
        }
    }
    
    // Share to LinkedIn
    shareToLinkedIn() {
        // Simply open LinkedIn - user will paste the copied text
        const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`;
        window.open(linkedInUrl, '_blank', 'width=600,height=600');
    }
    
    // Share to Reddit
    shareToReddit() {
        // Simply open Reddit submit page - user will paste the copied text
        const redditUrl = `https://www.reddit.com/submit?url=${encodeURIComponent(window.location.href)}`;
        window.open(redditUrl, '_blank', 'width=800,height=600');
    }
    
    // Share to WhatsApp
    shareToWhatsApp() {
        // Simply open WhatsApp - user will paste the copied text
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(window.location.href)}`;
        window.open(whatsappUrl, '_blank');
    }
    
    // Share to Telegram
    shareToTelegram() {
        // Simply open Telegram - user will paste the copied text
        const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(window.location.href)}`;
        window.open(telegramUrl, '_blank');
    }
    
    // Share to Discord
    shareToDiscord() {
        // Discord doesn't have a direct share URL, so just show a helpful message
        // User will need to manually share in Discord
        alert('💡 To share on Discord:\n\n1. Copy the viral text above\n2. Open Discord\n3. Paste in your channel or DM\n4. Add this link: ' + window.location.href);
    }
    
    // Share to TikTok
    shareToTikTok() {
        // TikTok doesn't have a direct web share URL for external links
        // Show helpful instructions for TikTok sharing
        alert('💡 To share on TikTok:\n\n1. Copy the viral text above\n2. Open TikTok app\n3. Create a video about your achievement\n4. Add the text as caption or in comments\n5. Include: ' + window.location.href);
    }
    
    // PWA Setup
    setupPWA() {
        // Listen for beforeinstallprompt event
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.deferredPrompt = e;
            this.showInstallBanner();
        });
        
        // Listen for app installed event
        window.addEventListener('appinstalled', () => {
            console.log('PWA was installed');
            this.isInstalled = true;
            this.hideInstallBanner();
        });
        
        // Check if already installed
        if (window.matchMedia('(display-mode: standalone)').matches) {
            this.isInstalled = true;
        }
    }
    
    // Show install banner
    showInstallBanner() {
        if (!this.isInstalled) {
            this.elements.installBanner.classList.remove('hidden');
        }
    }
    
    // Hide install banner
    hideInstallBanner() {
        this.elements.installBanner.classList.add('hidden');
    }
    
    // Dismiss install banner
    dismissInstallBanner() {
        this.hideInstallBanner();
        // Remember dismissal for this session
        sessionStorage.setItem('installBannerDismissed', 'true');
    }
    
    // Install PWA
    async installPWA() {
        if (!this.deferredPrompt) return;
        
        this.deferredPrompt.prompt();
        const { outcome } = await this.deferredPrompt.userChoice;
        
        if (outcome === 'accepted') {
            console.log('User accepted the install prompt');
        } else {
            console.log('User dismissed the install prompt');
        }
        
        this.deferredPrompt = null;
        this.hideInstallBanner();
    }
    
    // Music control methods
    playMusic() {
        if (this.elements.bgm && !this.elements.musicToggle.classList.contains('muted')) {
            this.elements.bgm.play().catch(e => {
                console.log('🎵 Audio autoplay blocked - user interaction required');
            });
        }
    }
    
    pauseMusic() {
        if (this.elements.bgm) {
            this.elements.bgm.pause();
        }
    }
    
    resetMusicToBeginning() {
        if (this.elements.bgm) {
            try {
                this.elements.bgm.currentTime = 0;
            } catch (error) {
                console.warn('Could not reset audio currentTime:', error);
            }
        }
    }
    
    toggleMusic() {
        const isMuted = this.elements.musicToggle.classList.contains('muted');
        
        if (isMuted) {
            // Unmute
            this.elements.musicToggle.classList.remove('muted');
            if (this.isHolding) {
                this.playMusic();
            }
        } else {
            // Mute
            this.elements.musicToggle.classList.add('muted');
            this.pauseMusic();
        }
    }
    
    // YouTube video control methods
    initializeYouTubePlayer() {
        if (window.YT && window.YT.Player) {
            this.youtubePlayer = new window.YT.Player('youtube-player', {
                height: '100%',
                width: '100%',
                videoId: 'kZx3E77pvPQ',
                playerVars: {
                    autoplay: 0,
                    controls: 0,
                    mute: 1,
                    loop: 1,
                    playlist: 'kZx3E77pvPQ',
                    modestbranding: 1,
                    rel: 0,
                    fs: 0,
                    playsinline: 1,
                    enablejsapi: 1
                },
                events: {
                    'onReady': (event) => {
                        console.log('🎬 YouTube player ready');
                        this.youtubeReady = true;
                    },
                    'onError': (event) => {
                        console.warn('🚨 YouTube player error:', event.data);
                    }
                }
            });
        }
    }
    
    playYouTubeVideo() {
        if (this.youtubePlayer && this.youtubeReady) {
            try {
                this.youtubePlayer.playVideo();
                this.elements.youtubeBackground.classList.add('playing');
                console.log('🎬 YouTube video started');
            } catch (error) {
                console.warn('Could not play YouTube video:', error);
            }
        }
    }
    
    pauseYouTubeVideo() {
        if (this.youtubePlayer && this.youtubeReady) {
            try {
                this.youtubePlayer.pauseVideo();
                this.elements.youtubeBackground.classList.remove('playing');
                console.log('🎬 YouTube video paused');
            } catch (error) {
                console.warn('Could not pause YouTube video:', error);
            }
        }
    }
    
    // Update evolution progress bar
    updateEvolutionProgress() {
        if (!this.gokuSystem || !this.elements.evolutionProgressFill) return;
        
        try {
            const currentEvolution = this.gokuSystem.getEvolutionForTime(this.currentTime);
            const nextEvolution = this.gokuSystem.getNextEvolution(this.currentTime);
            
            if (currentEvolution) {
                // Update current evolution name
                this.elements.currentEvolution.textContent = currentEvolution.name;
                
                if (nextEvolution) {
                    // There is a next evolution - show progress towards it
                    const currentThreshold = this.gokuSystem.getEvolutionThreshold(currentEvolution.name);
                    const nextThreshold = this.gokuSystem.getEvolutionThreshold(nextEvolution.name);
                    
                    const progress = Math.min(100, ((this.currentTime - currentThreshold) / (nextThreshold - currentThreshold)) * 100);
                    
                    // Update progress bar
                    this.elements.evolutionProgressFill.style.width = `${progress}%`;
                    
                    // Update evolution names
                    this.elements.nextEvolution.textContent = nextEvolution.name;
                    
                    // Update countdown
                    const timeToNext = Math.max(0, nextThreshold - this.currentTime);
                    this.elements.timeToEvolution.textContent = `${timeToNext.toFixed(1)}s`;
                } else {
                    // At maximum evolution - show as complete
                    this.elements.evolutionProgressFill.style.width = '100%';
                    this.elements.nextEvolution.textContent = 'MAX POWER!';
                    this.elements.timeToEvolution.textContent = 'ACHIEVED';
                }
            }
        } catch (error) {
            console.warn('Error updating evolution progress:', error);
        }
    }
    


    // Epic viral share messages with Goku and evolution - short, punchy, and engaging
    getViralShareMessage(time, evolution) {
        const websiteUrl = window.location.href;
        const evolutionName = evolution?.name || 'Base';
        
        const viralMessages = [
            `🔥 Just reached Goku ${evolutionName} in ${time.toFixed(2)}s! Think you can beat me? ${websiteUrl}`,
            `⚡ Goku ${evolutionName} achieved! ${time.toFixed(2)}s of pure power! Can you do better? ${websiteUrl}`,
            `💪 Held Goku ${evolutionName} for ${time.toFixed(2)}s straight! Your turn! ${websiteUrl}`,
            `🎯 Epic Goku ${evolutionName} time: ${time.toFixed(2)}s! Beat that! ${websiteUrl}`,
            `🔥 ${time.toFixed(2)}s Goku ${evolutionName} mastery! Think you're stronger? ${websiteUrl}`,
            `⚡ Goku ${evolutionName} unlocked in ${time.toFixed(2)}s! Can you last longer? ${websiteUrl}`,
            `💥 Just dominated Goku ${evolutionName} for ${time.toFixed(2)}s! Your move! ${websiteUrl}`,
            `🌟 ${time.toFixed(2)}s Goku ${evolutionName} challenge complete! Top this! ${websiteUrl}`,
            `🥊 Goku ${evolutionName} couldn't break me for ${time.toFixed(2)}s! Can you? ${websiteUrl}`,
            `🎮 Goku ${evolutionName} achieved in ${time.toFixed(2)}s! Think you can top it? ${websiteUrl}`
        ];
        
        return viralMessages[Math.floor(Math.random() * viralMessages.length)];
    }
}

// Initialize the game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Show loading screen briefly
    const loading = document.getElementById('loading');
    loading.classList.remove('hidden');
    
    // Initialize game after a short delay for smooth loading
    setTimeout(() => {
        window.buttonHoldGame = new ButtonHoldGame();
        loading.classList.add('hidden');
    }, 500);
});

// Service Worker registration for PWA with auto-update
if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
        try {
            const registration = await navigator.serviceWorker.register('sw.js');
            console.log('SW registered: ', registration);
            
            // Auto-update mechanism - check for updates and refresh immediately
            registration.addEventListener('updatefound', () => {
                const newWorker = registration.installing;
                console.log('🔄 New service worker found, updating...');
                
                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        console.log('🔄 New service worker installed, refreshing page...');
                        // Auto-refresh to use new service worker immediately
                        window.location.reload();
                    }
                });
            });
            
            // Listen for service worker messages
            navigator.serviceWorker.addEventListener('message', (event) => {
                if (event.data && event.data.type === 'CACHE_UPDATED') {
                    console.log('🔄 Cache updated, refreshing page...');
                    window.location.reload();
                }
            });
            
            // Check for updates every 30 seconds when page is visible
            setInterval(() => {
                if (!document.hidden && registration) {
                    registration.update();
                }
            }, 30000);
            
        } catch (registrationError) {
            console.log('SW registration failed: ', registrationError);
        }
    });
}

// YouTube API ready callback (global function required by YouTube API)
window.onYouTubeIframeAPIReady = function() {
    console.log('🎬 YouTube iframe API ready');
    // Mark API as ready for future game initialization
    window.youTubeAPIReady = true;
    // Initialize YouTube player if game is already loaded
    if (window.buttonHoldGame) {
        window.buttonHoldGame.initializeYouTubePlayer();
    }
};

// Export for debugging
window.ButtonHoldGame = ButtonHoldGame; 