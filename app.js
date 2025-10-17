// Game State Management
class GameState {
    constructor() {
        this.currentLevel = 0;
        this.totalLevels = 7; // 0 = homepage, 1-6 = levels, 7 = final
        this.soundEnabled = true;
        this.skillsActivated = false;
        this.levelHistory = [0]; // Track navigation history
    }
    
    updateProgress() {
        const progressFill = document.getElementById('progressFill');
        const levelIndicator = document.getElementById('levelIndicator');
        
        if (progressFill && levelIndicator) {
            const progress = (this.currentLevel / (this.totalLevels - 1)) * 100;
            progressFill.style.width = `${progress}%`;
            
            if (this.currentLevel === 0) {
                levelIndicator.textContent = 'READY TO START';
            } else if (this.currentLevel === this.totalLevels - 1) {
                levelIndicator.textContent = 'QUEST COMPLETE';
            } else {
                levelIndicator.textContent = `LEVEL ${this.currentLevel}`;
            }
        }
    }
    
    nextLevel() {
        if (this.currentLevel < this.totalLevels - 1) {
            this.currentLevel++;
            this.levelHistory.push(this.currentLevel);
            this.updateProgress();
            return true;
        }
        return false;
    }
    
    previousLevel() {
        if (this.levelHistory.length > 1) {
            this.levelHistory.pop(); // Remove current level
            this.currentLevel = this.levelHistory[this.levelHistory.length - 1];
            this.updateProgress();
            return true;
        }
        return false;
    }
    
    reset() {
        this.currentLevel = 0;
        this.skillsActivated = false;
        this.levelHistory = [0];
        this.updateProgress();
    }
}

// Initialize game state
const gameState = new GameState();

// Level Management
class LevelManager {
    constructor() {
        this.levels = document.querySelectorAll('.level');
        this.currentLevelElement = null;
        this.levelMap = {
            0: 'homepage',
            1: 'level1',
            2: 'level2', 
            3: 'level3',
            4: 'level4',
            5: 'level5',
            6: 'level6',
            7: 'finalLevel'
        };
        this.initialize();
    }
    
    initialize() {
        // Find the currently active level
        this.currentLevelElement = document.querySelector('.level.active') || document.getElementById('homepage');
        if (this.currentLevelElement) {
            this.currentLevelElement.classList.add('active');
        }
    }
    
    transitionToLevel(levelId, direction = 'forward') {
        const newLevelElement = document.getElementById(levelId);
        
        if (!newLevelElement) {
            console.error('Level not found:', levelId);
            return;
        }
        
        // Exit current level with appropriate direction
        if (this.currentLevelElement) {
            this.currentLevelElement.classList.remove('active');
            if (direction === 'forward') {
                this.currentLevelElement.classList.add('exit-left');
            } else {
                this.currentLevelElement.classList.add('exit-right');
            }
        }
        
        // After transition, show new level
        setTimeout(() => {
            // Clean up old level
            if (this.currentLevelElement) {
                this.currentLevelElement.classList.remove('exit-left', 'exit-right');
            }
            
            // Set up new level
            this.currentLevelElement = newLevelElement;
            
            // Set initial position based on direction
            if (direction === 'forward') {
                this.currentLevelElement.style.transform = 'translateX(100%)';
            } else {
                this.currentLevelElement.style.transform = 'translateX(-100%)';
            }
            
            // Trigger transition to active state
            setTimeout(() => {
                this.currentLevelElement.classList.add('active');
                this.currentLevelElement.style.transform = 'translateX(0)';
                
                // Trigger level-specific animations
                this.triggerLevelAnimations(levelId);
            }, 50);
        }, 400);
    }
    
    goToLevelByNumber(levelNumber, direction = 'forward') {
        const levelId = this.levelMap[levelNumber];
        if (levelId) {
            this.transitionToLevel(levelId, direction);
        }
    }
    
    triggerLevelAnimations(levelId) {
        setTimeout(() => {
            switch (levelId) {
                case 'level2':
                    this.animateXPBar();
                    break;
                case 'level4':
                    this.startGraduationCountdown();
                    this.animateCGPABar();
                    break;
                case 'level5':
                    // Skills will be animated when power-up button is clicked
                    break;
            }
        }, 800);
    }
    
    animateXPBar() {
        const xpFill = document.querySelector('.xp-fill');
        if (xpFill) {
            xpFill.style.width = '100%';
        }
    }
    
    animateCGPABar() {
        const cgpaFill = document.querySelector('.cgpa-fill');
        if (cgpaFill) {
            cgpaFill.style.width = '80.4%';
        }
    }
    
    startGraduationCountdown() {
        const graduationDate = new Date('2026-06-30');
        const updateCountdown = () => {
            const now = new Date();
            const difference = graduationDate - now;
            
            if (difference > 0) {
                const years = Math.floor(difference / (1000 * 60 * 60 * 24 * 365));
                const days = Math.floor((difference % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24));
                
                const yearsElement = document.getElementById('years');
                const daysElement = document.getElementById('days');
                
                if (yearsElement && daysElement) {
                    yearsElement.textContent = years;
                    daysElement.textContent = days;
                }
            }
        };
        
        updateCountdown();
    }
}

// Skills Animation Manager
class SkillsManager {
    constructor() {
        this.skillsData = [
            { name: "HTML5", level: 95 },
            { name: "CSS3", level: 90 },
            { name: "JavaScript ES6", level: 85 },
            { name: "React", level: 80 },
            { name: "Node.js", level: 78 },
            { name: "MongoDB", level: 80 },
            { name: "MySQL", level: 70 },
            { name: "RESTful APIs", level: 85 },
            { name: "C", level: 73 },
            { name: "Java", level: 73 }
        ];
    }
    
    activateSkills() {
        const skillItems = document.querySelectorAll('.skill-item');
        
        skillItems.forEach((item, index) => {
            setTimeout(() => {
                const skillFill = item.querySelector('.skill-fill');
                const level = parseInt(item.dataset.level);
                
                if (skillFill) {
                    skillFill.style.width = `${level}%`;
                }
                
                // Add a glow effect during animation
                item.style.boxShadow = '0 5px 20px rgba(var(--color-teal-300-rgb), 0.5)';
                
                setTimeout(() => {
                    item.style.boxShadow = '';
                }, 1000);
                
            }, index * 200);
        });
        
        gameState.skillsActivated = true;
        
        // Update button text
        const powerUpBtn = document.getElementById('powerUpBtn');
        if (powerUpBtn) {
            powerUpBtn.innerHTML = '⚡ POWER-UPS ACTIVATED!';
            powerUpBtn.style.background = 'linear-gradient(45deg, var(--color-success), var(--color-teal-300))';
            powerUpBtn.disabled = true;
        }
    }
    
    resetSkills() {
        const skillFills = document.querySelectorAll('.skill-fill');
        skillFills.forEach(fill => {
            fill.style.width = '0%';
        });
        
        gameState.skillsActivated = false;
        
        // Reset power-up button
        const powerUpBtn = document.getElementById('powerUpBtn');
        if (powerUpBtn) {
            powerUpBtn.innerHTML = '⚡ ACTIVATE ALL POWER-UPS';
            powerUpBtn.style.background = 'linear-gradient(45deg, var(--color-orange-400), var(--color-orange-500))';
            powerUpBtn.disabled = false;
        }
    }
}

// Contact Form Manager
class ContactManager {
    constructor() {
        this.modal = document.getElementById('successModal');
    }
    
    handleSubmit(event) {
        event.preventDefault();
        
        const name = document.getElementById('senderName').value;
        const email = document.getElementById('senderEmail').value;
        const message = document.getElementById('message').value;
        
        // Validate form
        if (!name || !email || !message) {
            alert('Please fill in all fields');
            return;
        }
        
        // Simulate form submission
        this.showSuccess();
        
        // Reset form
        event.target.reset();
    }
    
    showSuccess() {
        if (this.modal) {
            this.modal.classList.remove('hidden');
            
            // Add some celebration effects
            const successAnimation = document.querySelector('.success-animation');
            if (successAnimation) {
                successAnimation.style.animation = 'sparkle 0.5s ease-in-out infinite';
            }
        }
    }
    
    hideSuccess() {
        if (this.modal) {
            this.modal.classList.add('hidden');
        }
    }
}

// Sound Manager (placeholder for future audio implementation)
class SoundManager {
    constructor() {
        this.enabled = true;
        this.soundToggle = document.getElementById('soundToggle');
    }
    
    toggle() {
        this.enabled = !this.enabled;
        const icon = this.soundToggle ? this.soundToggle.querySelector('.sound-icon') : null;
        if (icon) {
            icon.textContent = this.enabled ? '🔊' : '🔇';
        }
        
        // Update visual state
        if (this.soundToggle) {
            if (this.enabled) {
                this.soundToggle.style.background = 'rgba(var(--color-teal-500-rgb), 0.2)';
            } else {
                this.soundToggle.style.background = 'rgba(var(--color-slate-500-rgb), 0.2)';
            }
        }
    }
    
    // Placeholder methods for future sound effects
    playLevelComplete() {
        if (this.enabled) {
            console.log('Level complete sound');
        }
    }
    
    playButtonClick() {
        if (this.enabled) {
            console.log('Button click sound');
        }
    }
    
    playSkillActivate() {
        if (this.enabled) {
            console.log('Skill activate sound');
        }
    }
    
    playBackSound() {
        if (this.enabled) {
            console.log('Back navigation sound');
        }
    }
}

// Initialize managers
let levelManager;
let skillsManager;
let contactManager;
let soundManager;

// Main initialization function
function initializeApp() {
    try {
        console.log('Initializing Adventure Resume...');
        
        // Initialize managers
        levelManager = new LevelManager();
        skillsManager = new SkillsManager();
        contactManager = new ContactManager();
        soundManager = new SoundManager();
        
        // Initialize progress bar
        gameState.updateProgress();
        
        console.log('Managers initialized successfully');
        
        // Set up event listeners
        setupEventListeners();
        
        console.log('🎮 Debasish Roy\'s Adventure Resume loaded successfully!');
        
    } catch (error) {
        console.error('Initialization error:', error);
    }
}

// Event listener setup
function setupEventListeners() {
    // Start Game Button
    const startGameBtn = document.getElementById('startGameBtn');
    if (startGameBtn) {
        startGameBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Start game clicked');
            
            try {
                soundManager.playButtonClick();
                gameState.nextLevel();
                levelManager.goToLevelByNumber(gameState.currentLevel, 'forward');
            } catch (error) {
                console.error('Start game error:', error);
            }
        });
        console.log('Start game button listener attached');
    } else {
        console.error('Start game button not found');
    }
    
    // Continue Buttons
    const continueButtons = document.querySelectorAll('.continue-btn');
    console.log('Found continue buttons:', continueButtons.length);
    
    continueButtons.forEach((button, index) => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Continue button clicked:', index);
            
            try {
                soundManager.playButtonClick();
                const nextLevel = this.dataset.next;
                console.log('Next level:', nextLevel);
                
                gameState.nextLevel();
                levelManager.transitionToLevel(nextLevel, 'forward');
                soundManager.playLevelComplete();
            } catch (error) {
                console.error('Continue button error:', error);
            }
        });
    });
    
    // Back Buttons
    const backButtons = document.querySelectorAll('.back-btn');
    console.log('Found back buttons:', backButtons.length);
    
    backButtons.forEach((button, index) => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Back button clicked:', index);
            
            try {
                soundManager.playBackSound();
                const prevLevel = this.dataset.prev;
                console.log('Previous level:', prevLevel);
                
                if (gameState.previousLevel()) {
                    levelManager.transitionToLevel(prevLevel, 'backward');
                }
            } catch (error) {
                console.error('Back button error:', error);
            }
        });
    });
    
    // Power-up Button
    const powerUpBtn = document.getElementById('powerUpBtn');
    if (powerUpBtn) {
        powerUpBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Power up clicked');
            
            if (!gameState.skillsActivated) {
                soundManager.playSkillActivate();
                skillsManager.activateSkills();
            }
        });
    }
    
    // Sound Toggle
    const soundToggle = document.getElementById('soundToggle');
    if (soundToggle) {
        soundToggle.addEventListener('click', function(e) {
            e.preventDefault();
            soundManager.toggle();
        });
    }
    
    // Contact Form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            contactManager.handleSubmit(event);
        });
    }
    
    // Close Modal
    const closeModal = document.getElementById('closeModal');
    if (closeModal) {
        closeModal.addEventListener('click', function(e) {
            e.preventDefault();
            contactManager.hideSuccess();
        });
    }
    
    // Download Resume Button
    const downloadResume = document.getElementById('downloadResume');
    if (downloadResume) {
        downloadResume.addEventListener('click', function(e) {
            e.preventDefault();
            soundManager.playButtonClick();
            downloadResumeFile();
        });
    }
    
    // Restart Game Button
    const restartGame = document.getElementById('restartGame');
    if (restartGame) {
        restartGame.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Restart game clicked');
            
            soundManager.playButtonClick();
            gameState.reset();
            levelManager.transitionToLevel('homepage', 'backward');
            skillsManager.resetSkills();
        });
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', function(event) {
        switch(event.key) {
            case 'ArrowRight':
                if (gameState.currentLevel < gameState.totalLevels - 1) {
                    const currentContinueBtn = document.querySelector('.level.active .continue-btn');
                    if (currentContinueBtn) {
                        currentContinueBtn.click();
                    }
                }
                break;
                
            case 'ArrowLeft':
                if (gameState.currentLevel > 0) {
                    const currentBackBtn = document.querySelector('.level.active .back-btn');
                    if (currentBackBtn) {
                        currentBackBtn.click();
                    }
                }
                break;
                
            case ' ':
                if (gameState.currentLevel === 0) {
                    const startBtn = document.getElementById('startGameBtn');
                    if (startBtn) {
                        startBtn.click();
                    }
                }
                event.preventDefault();
                break;
                
            case 'r':
            case 'R':
                if (event.ctrlKey || event.metaKey) {
                    event.preventDefault();
                    const restartBtn = document.getElementById('restartGame');
                    if (restartBtn) {
                        restartBtn.click();
                    }
                }
                break;
                
            case 'Escape':
                if (contactManager && !contactManager.modal.classList.contains('hidden')) {
                    contactManager.hideSuccess();
                }
                break;
        }
    });
    
    // Modal click outside to close
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.addEventListener('click', function(event) {
            if (event.target === modal) {
                contactManager.hideSuccess();
            }
        });
    }
    
    // Touch/swipe support for mobile
    setupTouchNavigation();
    
    console.log('All event listeners set up');
}

// Touch navigation setup
function setupTouchNavigation() {
    let touchStartX = 0;
    let touchEndX = 0;
    
    document.addEventListener('touchstart', function(event) {
        touchStartX = event.changedTouches[0].screenX;
    });
    
    document.addEventListener('touchend', function(event) {
        touchEndX = event.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const swipeDistance = touchEndX - touchStartX;
        
        if (Math.abs(swipeDistance) > swipeThreshold) {
            if (swipeDistance > 0) {
                // Swipe right - go back
                if (gameState.currentLevel > 0) {
                    const currentBackBtn = document.querySelector('.level.active .back-btn');
                    if (currentBackBtn) {
                        currentBackBtn.click();
                    }
                }
            } else {
                // Swipe left - go forward
                if (gameState.currentLevel < gameState.totalLevels - 1) {
                    const currentContinueBtn = document.querySelector('.level.active .continue-btn');
                    if (currentContinueBtn) {
                        currentContinueBtn.click();
                    }
                }
            }
        }
    }
}

// Download resume function
function downloadResumeFile() {
    const resumeContent = `
DEBASISH ROY
Software Engineer
================

CONTACT:
Phone: 918240784122
Email: droy41259@gmail.com
Location: B-4415, Kalyani, Nadia, West Bengal, Pin 741235
LinkedIn: https://www.linkedin.com/in/debasish-roy-306b05174

EDUCATION:
JIS College of Engineering (2022-2026)
Bachelor's in Information Technology
CGPA: 8.04

EXPERIENCE:
Software Development Engineer Intern
- Built responsive IPO dashboard with pixel-perfect UI using Bootstrap 5
- Ensured mobile and desktop consistency with clean, reusable components

PROJECTS:
Responsive Hotel Booking Website
- Full-stack platform inspired by Airbnb
- User authentication, real-time availability, search/book/review system
- Tech Stack: HTML, CSS, JavaScript, Node.js, MongoDB

SKILLS:
HTML5 (95%), CSS3 (90%), JavaScript ES6 (85%), React (80%), Node.js (78%), 
MongoDB (80%), MySQL (70%), RESTful APIs (85%), C (73%), Java (73%)

EXTRA CURRICULAR:
- Web Development Club member
- Contributed to Spotify replica project

Thank you for visiting my Adventure Resume!
    `;
    
    try {
        const blob = new Blob([resumeContent], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Debasish_Roy_Resume.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        setTimeout(() => {
            alert('📋 Resume downloaded successfully! Thank you for playing!');
        }, 500);
    } catch (error) {
        console.error('Download error:', error);
        alert('Sorry, there was an error downloading the resume.');
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

// Global error handling
window.addEventListener('error', function(event) {
    console.error('Application error:', event.error);
});

console.log('🎯 Navigation: Arrow keys, spacebar to start, Ctrl+R to restart');
console.log('↩️ Use BACK buttons or left arrow key to go to previous levels');
console.log('↪️ Use CONTINUE buttons or right arrow key to advance');
console.log('📱 Mobile: Swipe left/right to navigate between levels');