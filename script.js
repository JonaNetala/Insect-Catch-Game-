// DOM element selections - original elements from base game
const screens = document.querySelectorAll('.screen');
const chooseInsectBtns = document.querySelectorAll('.choose-insect-btn');
const gameContainer = document.getElementById('game-container');
const timeEl = document.getElementById('time');
const scoreEl = document.getElementById('score');
const message = document.getElementById('message');

// New DOM element selections for my custom features
const startCatchBtn = document.getElementById('catch-mode-btn');
const startBattleBtn = document.getElementById('battle-mode-btn');
const instructionsBtn = document.getElementById('instructions-btn');
const closeInstructionsBtn = document.querySelector('.close-instructions-btn');
const instructionsPanel = document.querySelector('.instructions-panel');
const battleArena = document.getElementById('battle-arena');
const battleTimerEl = document.getElementById('battle-timer');
const levelIndicator = document.getElementById('level-indicator');
const gameOverScreen = document.getElementById('game-over');
const finalScoreEl = document.getElementById('final-score');
const highScoreEl = document.getElementById('high-score');
const homeHighScoreValue = document.getElementById('home-high-score-value');
const playAgainBtn = document.getElementById('play-again-btn');
const returnHomeBtn = document.getElementById('return-home-btn');
const switchModeBtn = document.getElementById('switch-mode-btn');

// Battle mode elements
const battleMessage = document.getElementById('battle-message');
const attackBtn = document.getElementById('attack-btn');
const defendBtn = document.getElementById('defend-btn');
const specialBtn = document.getElementById('special-btn');
const playerHealthBar = document.getElementById('player-health');
const enemyHealthBar = document.getElementById('enemy-health');

// Game state variables
let seconds = 0;
let score = 0;
let level = 1;
let selectedInsect = {};
// Show attack animation with insect-specific effects
function showAttackAnimation(attacker) {
  const attackerEl = battleArena.querySelector(attacker === 'player' ? '.player-battle-insect' : '.enemy-battle-insect');
  const targetEl = battleArena.querySelector(attacker === 'player' ? '.enemy-battle-insect' : '.player-battle-insect');
  
  if (!attackerEl || !targetEl) return;
  
  // Stores original position
  const originalLeft = attackerEl.style.left;
  const originalTop = attackerEl.style.top;
  
  // Moves attacker toward target
  const targetRect = targetEl.getBoundingClientRect();
  const attackerRect = attackerEl.getBoundingClientRect();
  
  const midpointLeft = (parseFloat(originalLeft) + (attacker === 'player' ? 15 : -15)) + '%';
  
  // Add attack animation
  attackerEl.style.transition = 'all 0.3s ease-in-out';
  attackerEl.style.left = midpointLeft;
  attackerEl.style.transform = 'rotate(20deg)';
  
  // Create hit effect
  setTimeout(() => {
    const hitEffect = document.createElement('div');
    hitEffect.innerHTML = '<i class="fas fa-bolt"></i>';
    hitEffect.style.position = 'absolute';
    hitEffect.style.left = `${targetRect.left + targetRect.width/2}px`;
    hitEffect.style.top = `${targetRect.top + targetRect.height/2}px`;
    hitEffect.style.fontSize = '40px';
    hitEffect.style.color = attacker === 'player' ? '#2196f3' : '#f44336';
    hitEffect.style.transform = 'translate(-50%, -50%)';
    hitEffect.style.zIndex = '100';
    hitEffect.style.animation = 'hitEffect 0.5s forwards';
    
    document.body.appendChild(hitEffect);
    
    // Define animation
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes hitEffect {
        0% { transform: translate(-50%, -50%) scale(0.5); opacity: 1; }
        100% { transform: translate(-50%, -50%) scale(2); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
    
    // Shake target
    targetEl.style.animation = 'shake 0.5s';
    
    // Define shake animation if not already defined
    if (!document.getElementById('shake-animation')) {
      const shakeStyle = document.createElement('style');
      shakeStyle.id = 'shake-animation';
      shakeStyle.innerHTML = `
        @keyframes shake {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          10%, 30%, 50%, 70%, 90% { transform: translate(-5px, 0) rotate(-5deg); }
          20%, 40%, 60%, 80% { transform: translate(5px, 0) rotate(5deg); }
        }
      `;
      document.head.appendChild(shakeStyle);
    }
    
    // Remove after animation
    setTimeout(() => {
      hitEffect.remove();
      style.remove();
      targetEl.style.animation = '';
    }, 500);
    
    // Return attacker to original position
    setTimeout(() => {
      attackerEl.style.left = originalLeft;
      attackerEl.style.transform = 'rotate(0deg)';
    }, 100);
  }, 200);
}

// Show defend animation
function showDefendAnimation(defender) {
  const defenderEl = battleArena.querySelector(defender === 'player' ? '.player-battle-insect' : '.enemy-battle-insect');
  
  if (!defenderEl) return;
  
  // Create shield effect
  const shield = document.createElement('div');
  shield.innerHTML = '<i class="fas fa-shield-alt"></i>';
  shield.style.position = 'absolute';
  shield.style.top = '50%';
  shield.style.left = defender === 'player' ? '25%' : '75%';
  shield.style.transform = 'translate(-50%, -50%)';
  shield.style.fontSize = '60px';
  shield.style.color = '#64b5f6';
  shield.style.zIndex = '99';
  shield.style.opacity = '0';
  shield.style.animation = 'shield 1.5s forwards';
  
  battleArena.appendChild(shield);
  
  // Define animation
  const style = document.createElement('style');
  style.innerHTML = `
    @keyframes shield {
      0% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
      20% { opacity: 0.8; transform: translate(-50%, -50%) scale(1.2); }
      80% { opacity: 0.8; transform: translate(-50%, -50%) scale(1.2); }
      100% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
    }
  `;
  document.head.appendChild(style);
  
  // Add pulse effect to insect
  defenderEl.style.animation = 'pulse 1.5s';
  
  // Define pulse animation if not already defined
  if (!document.getElementById('pulse-animation')) {
    const pulseStyle = document.createElement('style');
    pulseStyle.id = 'pulse-animation';
    pulseStyle.innerHTML = `
      @keyframes pulse {
        0% { box-shadow: 0 0 0 0 rgba(100, 181, 246, 0.7); }
        70% { box-shadow: 0 0 0 20px rgba(100, 181, 246, 0); }
        100% { box-shadow: 0 0 0 0 rgba(100, 181, 246, 0); }
      }
    `;
    document.head.appendChild(pulseStyle);
  }
  
  // Remove after animation
  setTimeout(() => {
    shield.remove();
    style.remove();
    defenderEl.style.animation = '';
  }, 1500);
}

// Show special attack animation
function showSpecialAnimation(attacker, insectType) {
  const attackerEl = battleArena.querySelector(attacker === 'player' ? '.player-battle-insect' : '.enemy-battle-insect');
  const targetEl = battleArena.querySelector(attacker === 'player' ? '.enemy-battle-insect' : '.player-battle-insect');
  
  if (!attackerEl || !targetEl) return;
  
  // Add glow to attacker
  attackerEl.style.animation = 'glow 2s';
  
  // Define glow animation if not already defined
  if (!document.getElementById('glow-animation')) {
    const glowStyle = document.createElement('style');
    glowStyle.id = 'glow-animation';
    glowStyle.innerHTML = `
      @keyframes glow {
        0% { filter: brightness(1); }
        50% { filter: brightness(1.5) drop-shadow(0 0 10px gold); }
        100% { filter: brightness(1); }
      }
    `;
    document.head.appendChild(glowStyle);
  }
  
  // Create special effect based on insect type
  setTimeout(() => {
    // Different effect for each insect
    let effectHtml = '';
    let effectColor = '';
    let effectAnimation = '';
    
    switch(insectType) {
      case 'fly':
        effectHtml = '<i class="fas fa-wind"></i>';
        effectColor = '#90caf9';
        effectAnimation = 'flySpecial';
        break;
      case 'mosquito':
        effectHtml = '<i class="fas fa-tint"></i>';
        effectColor = '#b71c1c';
        effectAnimation = 'mosquitoSpecial';
        break;
      case 'spider':
        effectHtml = '<i class="fas fa-spider"></i>';
        effectColor = '#7e57c2';
        effectAnimation = 'spiderSpecial';
        break;
      case 'roach':
        effectHtml = '<i class="fas fa-radiation"></i>';
        effectColor = '#4e342e';
        effectAnimation = 'roachSpecial';
        break;
      default:
        effectHtml = '<i class="fas fa-star"></i>';
        effectColor = '#ffd600';
        effectAnimation = 'defaultSpecial';
    }
    
    // Create multiple effect elements for more visual impact
    for (let i = 0; i < 5; i++) {
      const effect = document.createElement('div');
      effect.innerHTML = effectHtml;
      effect.style.position = 'absolute';
      effect.style.fontSize = '30px';
      effect.style.color = effectColor;
      effect.style.zIndex = '100';
      effect.style.opacity = '0';
      
      // Position randomly around target
      const targetRect = targetEl.getBoundingClientRect();
      const offsetX = (Math.random() - 0.5) * 100;
      const offsetY = (Math.random() - 0.5) * 100;
      
      effect.style.left = `${targetRect.left + targetRect.width/2 + offsetX}px`;
      effect.style.top = `${targetRect.top + targetRect.height/2 + offsetY}px`;
      
      effect.style.animation = `${effectAnimation} 1.5s forwards ${i * 0.2}s`;
      
      document.body.appendChild(effect);
      
      // Remove after animation
      setTimeout(() => {
        effect.remove();
      }, 1500 + (i * 200));
    }
    
    // Define animation styles
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes flySpecial {
        0% { opacity: 0; transform: scale(0.5) rotate(0deg); }
        20% { opacity: 1; }
        100% { opacity: 0; transform: scale(2) rotate(360deg); }
      }
      @keyframes mosquitoSpecial {
        0% { opacity: 0; transform: scale(0.5); }
        20% { opacity: 1; }
        100% { opacity: 0; transform: scale(2) translate(50px, 50px); }
      }
      @keyframes spiderSpecial {
        0% { opacity: 0; transform: translate(0, 0) scale(0.5); }
        20% { opacity: 1; }
        100% { opacity: 0; transform: translate(-30px, 30px) scale(2); }
      }
      @keyframes roachSpecial {
        0% { opacity: 0; transform: scale(0.5) rotate(0deg); }
        20% { opacity: 1; }
        100% { opacity: 0; transform: scale(2.5) rotate(180deg); }
      }
      @keyframes defaultSpecial {
        0% { opacity: 0; transform: scale(0.5); }
        20% { opacity: 1; }
        100% { opacity: 0; transform: scale(2); }
      }
    `;
    document.head.appendChild(style);
    
    // Shake target
    targetEl.style.animation = 'shake 1s';
    
    // Remove style after animations complete
    setTimeout(() => {
      style.remove();
      targetEl.style.animation = '';
    }, 2000);
  }, 500);
}

// End battle and show results
function endBattle(winner) {
  // Clear game timer
  clearAllIntervals();
  
  // Update battle message
  if (winner === 'player') {
    updateBattleMessage(`You won! Your ${selectedInsect.alt} defeated the enemy ${battleState.enemyInsect.alt}!`);
    
    // Add victory points to score
    const victoryPoints = 50 * level;
    increaseScore(victoryPoints);
    
    // Show victory points popup
    const pointPopup = document.createElement('div');
    pointPopup.textContent = `+${victoryPoints} Victory Bonus!`;
    pointPopup.classList.add('point-popup', 'victory-popup');
    pointPopup.style.position = 'fixed';
    pointPopup.style.left = '50%';
    pointPopup.style.top = '40%';
    pointPopup.style.transform = 'translate(-50%, -50%)';
    pointPopup.style.fontSize = '24px';
    pointPopup.style.color = 'gold';
    pointPopup.style.textShadow = '0 0 10px rgba(0,0,0,0.5)';
    document.body.appendChild(pointPopup);
    
    // Remove popup after animation
    setTimeout(() => pointPopup.remove(), 2000);
  } else {
    updateBattleMessage(`You lost! The enemy ${battleState.enemyInsect.alt} defeated your ${selectedInsect.alt}!`);
  }
  
  // Disable battle buttons
  disableBattleButtons(true);
  
  // Show game over options after delay
  setTimeout(() => {
    // Show game over panel
    if (gameOverScreen) {
      // Update final score
      if (finalScoreEl) finalScoreEl.textContent = score;
      if (highScoreEl) highScoreEl.textContent = highScore;
      
      gameOverScreen.style.display = 'flex';
    } else {
      // Create game over options if no dedicated screen
      const gameOverOptions = document.createElement('div');
      gameOverOptions.classList.add('game-over-options');
      gameOverOptions.style.marginTop = '30px';
      
      const playAgainBtn = document.createElement('button');
      playAgainBtn.textContent = 'Play Again';
      playAgainBtn.className = 'btn';
      playAgainBtn.onclick = resetGame;
      
      const menuBtn = document.createElement('button');
      menuBtn.textContent = 'Main Menu';
      menuBtn.className = 'btn';
      menuBtn.style.marginLeft = '10px';
      menuBtn.onclick = returnToHome;
      
      gameOverOptions.appendChild(playAgainBtn);
      gameOverOptions.appendChild(menuBtn);
      
      battleArena.appendChild(gameOverOptions);
    }
  }, 3000);
}

// Reset game and play again
function resetGame() {
  // Reset game variables
  score = 0;
  seconds = 0;
  level = 1;
  
  // Hide game over screen
  if (gameOverScreen) {
    gameOverScreen.style.display = 'none';
  }
  
  // Restart based on current mode
  if (gameMode === 'catch') {
    resetCatchMode();
  } else {
    resetBattleMode();
  }
}

// Reset catch mode
function resetCatchMode() {
  // Reset score and timer display
  if (scoreEl) scoreEl.innerHTML = 'Score: 0';
  if (timeEl) timeEl.innerHTML = 'Time: 00:00';
  
  // Remove all insects
  const insects = gameContainer.querySelectorAll('.insect');
  insects.forEach(insect => insect.remove());
  
  // Remove message
  if (message) message.classList.remove('visible');
  
  // Start fresh with new insects
  setTimeout(createInsect, 1000);
  startGame();
}

// Reset battle mode
function resetBattleMode() {
  // Initialize a new battle
  initBattle();
}

// Switch between game modes
function switchGameMode(newMode) {
  // Set new mode
  gameMode = newMode;
  
  // Clear timers
  clearAllIntervals();
  
  // Reset score for new mode
  score = 0;
  seconds = 0;
  level = 1;
  
  // Hide game over screen if visible
  if (gameOverScreen) {
    gameOverScreen.style.display = 'none';
  }
  
  if (newMode === 'catch') {
    // Switch to catch mode
    if (battleArena) battleArena.style.display = 'none';
    gameContainer.style.display = 'flex';
    
    createInGameControls(gameContainer, 'catch');
    
    // Reset displays
    if (scoreEl) scoreEl.innerHTML = 'Score: 0';
    if (timeEl) timeEl.innerHTML = 'Time: 00:00';
    
    // Remove message
    if (message) message.classList.remove('visible');
    
    // Start fresh with new insects
    setTimeout(createInsect, 1000);
    startGame();
  } else {
    // Switch to battle mode
    gameContainer.style.display = 'none';
    if (battleArena) battleArena.style.display = 'flex';
    
    createInGameControls(battleArena, 'battle');
    
    // Initialize battle
    initBattle();
  }
}

// Convenience functions to switch modes
function switchFromCatchToBattle() {
  switchGameMode('battle');
}

function switchFromBattleToCatch() {
  switchGameMode('catch');
}

// Confirm before returning to main menu
function confirmReturnToMenu() {
  const confirmed = confirm('Return to main menu? Your progress will be lost.');
  if (confirmed) {
    returnToHome();
  }
}

// Return to home/start screen
function returnToHome() {
  // Reset game variables
  score = 0;
  seconds = 0;
  level = 1;
  
  // Clear all intervals
  clearAllIntervals();
  
  // Remove all insects
  const catchInsects = gameContainer.querySelectorAll('.insect');
  catchInsects.forEach(insect => insect.remove());
  
  // Remove battle insects
  if (battleArena) {
    const battleInsects = battleArena.querySelectorAll('.insect');
    battleInsects.forEach(insect => insect.remove());
  }
  
  // Remove message visibility
  if (message) message.classList.remove('visible');
  
  // Hide game over screen
  if (gameOverScreen) {
    gameOverScreen.style.display = 'none';
  }
  
  // Remove any dynamically created game over options
  const gameOverOptions = document.querySelector('.game-over-options');
  if (gameOverOptions) gameOverOptions.remove();
  
  // Reset screens
  screens.forEach(screen => screen.classList.remove('up'));
  
  // Update high score display if element exists
  if (homeHighScoreValue) {
    homeHighScoreValue.textContent = highScore;
  }
  
  // Clear existing controls
  clearExistingControls();
}
let gameMode = ''; // 'catch' or 'battle'
let battleState = {
  playerHealth: 100,
  enemyHealth: 100,
  playerInsect: {},
  enemyInsect: {},
  playerDefending: false,
  enemyDefending: false,
  turn: 'player', // 'player' or 'enemy'
  specialUsed: false
};

// Store interval ID to clear later
let gameIntervalId = null;

// Get high score from local storage
let highScore = localStorage.getItem('insectGameHighScore') || 0;
// Update high score display if element exists
if (homeHighScoreValue) {
  homeHighScoreValue.textContent = highScore;
}

// Clear any existing in-game controls to prevent duplicates
function clearExistingControls() {
  // Find all control elements by class
  const existingControls = document.querySelectorAll('.in-game-controls');
  existingControls.forEach(control => control.remove());
  
  // Find standalone control buttons that might be orphaned
  const standaloneButtons = document.querySelectorAll('.control-btn');
  standaloneButtons.forEach(button => {
    // Only remove if it's not inside a proper container
    if (!button.closest('.in-game-controls')) {
      button.remove();
    }
  });
}

// Create in-game controls dynamically when needed
function createInGameControls(parent, mode) {
  // Clear any existing controls first
  clearExistingControls();
  
  // Only create controls if we're in an active game
  if (!parent || !mode || !gameMode) {
    return; // Don't create controls if we don't have needed context
  }
  
  // Create controls container
  const controlsContainer = document.createElement('div');
  controlsContainer.className = 'in-game-controls';
  
  // Set position based on mode
  if (mode === 'catch') {
    controlsContainer.style.top = '80px';
  } else {
    controlsContainer.style.top = '55px';
  }
  
  // Create buttons
  const resetBtn = document.createElement('button');
  resetBtn.className = 'control-btn';
  resetBtn.innerHTML = '<i class="fas fa-redo"></i> Reset';
  resetBtn.onclick = mode === 'catch' ? resetCatchMode : resetBattleMode;
  
  const switchModeBtn = document.createElement('button');
  switchModeBtn.className = 'control-btn';
  switchModeBtn.innerHTML = mode === 'catch' ? 
    '<i class="fas fa-exchange-alt"></i> Battle Mode' : 
    '<i class="fas fa-exchange-alt"></i> Catch Mode';
  switchModeBtn.onclick = mode === 'catch' ? switchFromCatchToBattle : switchFromBattleToCatch;
  
  const menuBtn = document.createElement('button');
  menuBtn.className = 'control-btn';
  menuBtn.innerHTML = '<i class="fas fa-home"></i> Main Menu';
  menuBtn.onclick = () => confirmReturnToMenu();
  
  // Add buttons to container
  controlsContainer.appendChild(resetBtn);
  controlsContainer.appendChild(switchModeBtn);
  controlsContainer.appendChild(menuBtn);
  
  // Add container to parent
  parent.appendChild(controlsContainer);
}

// Event listener for catch mode button
if (startCatchBtn) {
  startCatchBtn.addEventListener('click', () => {
    gameMode = 'catch';
    screens[0].classList.add('up');
    console.log('Catch mode selected');
  });
}

// Event listener for battle mode button
if (startBattleBtn) {
  startBattleBtn.addEventListener('click', () => {
    gameMode = 'battle';
    screens[0].classList.add('up');
    console.log('Battle mode selected');
  });
}

// Event listener for instructions button
if (instructionsBtn) {
  instructionsBtn.addEventListener('click', () => {
    if (instructionsPanel) {
      instructionsPanel.classList.add('visible');
    }
  });
}

// Event listener for close instructions button
if (closeInstructionsBtn && instructionsPanel) {
  closeInstructionsBtn.addEventListener('click', () => {
    instructionsPanel.classList.remove('visible');
  });

  // Close instructions when clicking outside
  instructionsPanel.addEventListener('click', function(event) {
    if (event.target === instructionsPanel) {
      instructionsPanel.classList.remove('visible');
    }
  });
}

// Enhanced insect selection event listeners
chooseInsectBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Get insect data including battle stats
    const img = btn.querySelector('img');
    const src = img.getAttribute('src');
    const alt = img.getAttribute('alt');
    const power = btn.getAttribute('data-power') || 5; // Default if not specified
    const speed = btn.getAttribute('data-speed') || 5; // Default if not specified
    
    // Store selected insect with enhanced properties
    selectedInsect = { 
      src, 
      alt, 
      power: parseInt(power), 
      speed: parseInt(speed)
    };
    
    // Move to appropriate game screen based on mode
    screens[1].classList.add('up');
    
    if (gameMode === 'catch') {
      // Hide battle arena and show catch game
      if (battleArena) battleArena.style.display = 'none';
      gameContainer.style.display = 'flex';
      
      // Create in-game controls
      createInGameControls(gameContainer, 'catch');
      
      // Start catch mode with original game mechanics
      setTimeout(createInsect, 1000);
      startGame();
      console.log(`Selected ${alt} for catch mode`);
    } else if (gameMode === 'battle') {
      // Hide catch game and show battle arena
      gameContainer.style.display = 'none';
      if (battleArena) battleArena.style.display = 'flex';
      
      // Create in-game controls
      createInGameControls(battleArena, 'battle');
      
      // Initialize battle mode
      initBattle();
      console.log(`Selected ${alt} for battle mode`);
    }
  });
});

// Event listeners for battle controls
if (attackBtn) attackBtn.addEventListener('click', () => playerAttack());
if (defendBtn) defendBtn.addEventListener('click', () => playerDefend());
if (specialBtn) specialBtn.addEventListener('click', () => playerSpecialMove());

// Game over event listeners
if (playAgainBtn) playAgainBtn.addEventListener('click', resetGame);
if (returnHomeBtn) returnHomeBtn.addEventListener('click', returnToHome);
if (switchModeBtn) {
  switchModeBtn.addEventListener('click', () => {
    const newMode = gameMode === 'catch' ? 'battle' : 'catch';
    switchGameMode(newMode);
  });
}

// Helper function to clear all intervals
function clearAllIntervals() {
  if (gameIntervalId) {
    clearInterval(gameIntervalId);
    gameIntervalId = null;
  }
}

// Start the game timer
function startGame() {
  // Clear any existing intervals first
  clearAllIntervals();
  
  // Reset seconds counter
  seconds = 0;
  
  // Store the interval ID so we can clear it later
  gameIntervalId = setInterval(increaseTime, 1000);
}

// Update timer - enhanced with level progression
function increaseTime() {
  let m = Math.floor(seconds / 60);
  let s = seconds % 60;
  
  // Format with leading zeros
  m = m < 10 ? `0${m}` : m;
  s = s < 10 ? `0${s}` : s;
  
  // Update both timer displays
  if (timeEl) timeEl.innerHTML = `Time: ${m}:${s}`;
  if (battleTimerEl) battleTimerEl.innerHTML = `Time: ${m}:${s}`;
  seconds++;
  
  // Increase difficulty every 30 seconds in catch mode
  if (seconds % 30 === 0 && gameMode === 'catch') {
    increaseLevel();
  }
}

// Function to increase difficulty level
function increaseLevel() {
  level++;
  if (levelIndicator) levelIndicator.textContent = `Level: ${level}`;
  
  // Add visual feedback for level up
  const levelUpMessage = document.createElement('div');
  levelUpMessage.classList.add('level-up-message');
  levelUpMessage.textContent = `Level ${level}!`;
  gameContainer.appendChild(levelUpMessage);
  
  // Remove message after animation
  setTimeout(() => levelUpMessage.remove(), 2000);
  console.log(`Level increased to ${level}`);
}

// Create insects - enhanced with type-specific properties
function createInsect() {
  const insect = document.createElement('div');
  insect.classList.add('insect');
  
  // Add insect type class for specific animations
  insect.classList.add(selectedInsect.alt);
  
  // Position randomly
  const { x, y } = getRandomLocation();
  insect.style.top = `${y}px`;
  insect.style.left = `${x}px`;
  
  // Add image with random rotation
  insect.innerHTML = `<img src="${selectedInsect.src}" alt="${selectedInsect.alt}" style="transform: rotate(${Math.random() * 360}deg)" />`;
  
  // Add click handler
  insect.addEventListener('click', catchInsect);
  
  // Add insect to game container
  gameContainer.appendChild(insect);
  
  // Make insects move at higher levels
  if (level > 1) {
    moveInsectRandomly(insect);
  }
}

// Function to make insects move randomly
function moveInsectRandomly(insect) {
  // Movement speed based on level
  const speed = 2000 - (level * 200);
  
  const moveInterval = setInterval(() => {
    // Stop if insect is caught or removed
    if (!insect || insect.classList.contains('caught') || !gameContainer.contains(insect)) {
      clearInterval(moveInterval);
      return;
    }
    
    // Get new random position
    const { x, y } = getRandomLocation();
    
    // Animate movement
    insect.style.transition = `top ${speed/1000}s ease, left ${speed/1000}s ease`;
    insect.style.top = `${y}px`;
    insect.style.left = `${x}px`;
  }, speed);
}

// Get random coordinates for insect positioning
function getRandomLocation() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  
  const x = Math.random() * (width - 200) + 100;
  const y = Math.random() * (height - 200) + 100;
  
  return { x, y };
}

// Enhanced catch insect function with custom animations
function catchInsect() {
  // Get insect type for custom scoring and animation
  const insectType = this.classList[1]; // fly, mosquito, spider, or roach
  
  // Different points based on insect and level
  const basePoints = {
    'fly': 1,
    'mosquito': 2,
    'spider': 3,
    'roach': 4
  };
  
  // Calculate points with level multiplier
  const points = basePoints[insectType] * level || 1;
  increaseScore(points);
  
  // Add caught class for animation
  this.classList.add('caught');
  
  // Create catch effect animation
  createCatchEffect(this, insectType);
  
  // Remove after animation completes
  setTimeout(() => this.remove(), 2000);
  
  // Add more insects
  addInsects();
  
  console.log(`Caught a ${insectType} for ${points} points`);
}

// Function to create catch effect based on insect type
function createCatchEffect(insect, insectType) {
  const rect = insect.getBoundingClientRect();
  const effect = document.createElement('div');
  
  // Customize effect based on insect type
  switch(insectType) {
    case 'fly':
      effect.innerHTML = '<i class="fas fa-bullseye"></i>';
      effect.style.color = 'red';
      break;
    case 'mosquito':
      effect.innerHTML = '<i class="fas fa-tint"></i>';
      effect.style.color = 'darkred';
      break;
    case 'spider':
      effect.innerHTML = '<i class="fas fa-spider"></i>';
      effect.style.color = 'purple';
      break;
    case 'roach':
      effect.innerHTML = '<i class="fas fa-shoe-prints"></i>';
      effect.style.color = 'brown';
      break;
    default:
      effect.innerHTML = '<i class="fas fa-check"></i>';
      effect.style.color = 'green';
  }
  
  // Position and style the effect
  effect.style.position = 'absolute';
  effect.style.left = `${rect.left + rect.width/2}px`;
  effect.style.top = `${rect.top + rect.height/2}px`;
  effect.style.fontSize = '40px';
  effect.style.transform = 'translate(-50%, -50%)';
  effect.style.zIndex = '100';
  effect.style.animation = 'effectFade 1s forwards';
  
  document.body.appendChild(effect);
  
  // Define animation in JS
  const style = document.createElement('style');
  style.innerHTML = `
    @keyframes effectFade {
      0% { transform: translate(-50%, -50%) scale(0.5); opacity: 1; }
      100% { transform: translate(-50%, -50%) scale(2); opacity: 0; }
    }
  `;
  document.head.appendChild(style);
  
  // Remove effect after animation
  setTimeout(() => {
    effect.remove();
    style.remove();
  }, 1000);
}

// Add more insects - modified to scale with level
function addInsects() {
  // Number of insects to add increases with level
  const insectCount = Math.min(4, level);
  
  for (let i = 0; i < insectCount; i++) {
    // Stagger creation for smoother gameplay
    setTimeout(createInsect, 500 * i);
  }
}

// Increase score - enhanced with point popup
function increaseScore(points = 1) {
  score += points;
  
  // Update high score if needed
  if (score > highScore) {
    highScore = score;
    localStorage.setItem('insectGameHighScore', highScore);
    if (homeHighScoreValue) {
      homeHighScoreValue.textContent = highScore;
    }
  }
  
  // Show point popup for multi-point catches
  if (points > 1) {
    const pointPopup = document.createElement('div');
    pointPopup.textContent = `+${points}`;
    pointPopup.classList.add('point-popup');
    pointPopup.style.position = 'fixed';
    pointPopup.style.right = '15px';
    pointPopup.style.top = '60px';
    document.body.appendChild(pointPopup);
    
    // Remove popup after animation
    setTimeout(() => pointPopup.remove(), 1000);
  }
  
  // Show message at high score
  if (score > 19) {
    message.classList.add('visible');
  }
  
  // Update score display
  if (scoreEl) scoreEl.innerHTML = `Score: ${score}`;
}

// BATTLE MODE FUNCTIONS

// Initialize battle mode
function initBattle() {
  // Reset battle state
  battleState = {
    playerHealth: 100,
    enemyHealth: 100,
    playerInsect: selectedInsect,
    playerDefending: false,
    enemyDefending: false,
    turn: 'player',
    specialUsed: false
  };
  
  // Select random enemy insect (different from player's)
  const enemyOptions = Array.from(chooseInsectBtns)
    .map(btn => {
      const img = btn.querySelector('img');
      return {
        src: img.getAttribute('src'),
        alt: img.getAttribute('alt'),
        power: parseInt(btn.getAttribute('data-power') || 5),
        speed: parseInt(btn.getAttribute('data-speed') || 5)
      };
    })
    .filter(insect => insect.alt !== selectedInsect.alt);
  
  // If no other insects available, just use any insect
  if (enemyOptions.length === 0) {
    battleState.enemyInsect = {
      src: selectedInsect.src,
      alt: selectedInsect.alt,
      power: selectedInsect.power,
      speed: selectedInsect.speed
    };
  } else {
    battleState.enemyInsect = enemyOptions[Math.floor(Math.random() * enemyOptions.length)];
  }
  
  // Display insects in arena
  displayBattleInsects();
  
  // Update health bars
  updateHealthBars();
  
  // Enable all battle buttons
  disableBattleButtons(false);
  
  // Reset special button
  if (specialBtn) {
    specialBtn.disabled = false;
    specialBtn.style.opacity = '1';
  }
  
  // Update battle message
  updateBattleMessage(`Battle begins! Your ${selectedInsect.alt} vs enemy ${battleState.enemyInsect.alt}`);
  
  // Start battle timer
  startGame();
}

// Display player and enemy insects in battle arena
function displayBattleInsects() {
  if (!battleArena) return;
  
  // Remove any existing insects
  const existingInsects = battleArena.querySelectorAll('.insect');
  existingInsects.forEach(insect => insect.remove());
  
  // Create player insect
  const playerInsectEl = document.createElement('div');
  playerInsectEl.classList.add('insect', 'player-battle-insect');
  playerInsectEl.innerHTML = `<img src="${selectedInsect.src}" alt="${selectedInsect.alt}">`;
  playerInsectEl.style.left = '25%';
  playerInsectEl.style.top = '50%';
  
  // Create enemy insect
  const enemyInsectEl = document.createElement('div');
  enemyInsectEl.classList.add('insect', 'enemy-battle-insect');
  enemyInsectEl.innerHTML = `<img src="${battleState.enemyInsect.src}" alt="${battleState.enemyInsect.alt}">`;
  enemyInsectEl.style.left = '75%';
  enemyInsectEl.style.top = '50%';
  
  // Add to battle arena
  battleArena.appendChild(playerInsectEl);
  battleArena.appendChild(enemyInsectEl);
}

// Enhanced battle feedback function
function updateBattleMessage(message) {
  // Fade out current message
  if (battleMessage) {
    battleMessage.style.opacity = '0';
    
    // Update message after fade
    setTimeout(() => {
      battleMessage.textContent = message;
      battleMessage.style.opacity = '1';
    }, 300);
  }
}

// Function to disable battle buttons during opponent's turn
function disableBattleButtons(disabled) {
  if (attackBtn) attackBtn.disabled = disabled;
  if (defendBtn) defendBtn.disabled = disabled;
  if (specialBtn && !battleState.specialUsed) specialBtn.disabled = disabled;
}

// Enhanced player attack function
function playerAttack() {
  if (battleState.turn !== 'player') return;
  
  // Calculate damage based on player insect power
  const baseDamage = battleState.playerInsect.power;
  
  // Add some randomness to damage
  const variance = Math.floor(Math.random() * 4) - 1; // -1 to +2
  let damage = baseDamage + variance;
  
  // Critical hit chance (10%)
  let isCritical = Math.random() < 0.1;
  if (isCritical) {
    damage = Math.floor(damage * 1.5);
  }
  
  // Reduce damage if enemy is defending
  if (battleState.enemyDefending) {
    damage = Math.max(1, Math.floor(damage / 2));
    battleState.enemyDefending = false;
  }
  
  // Apply damage to enemy health
  battleState.enemyHealth = Math.max(0, battleState.enemyHealth - damage);
  
  // Update health bars
  updateHealthBars();
  
  // Show attack animation
  showAttackAnimation('player');
  
  // Update battle message with attack info
  if (isCritical) {
    updateBattleMessage(`Critical hit! You attack for ${damage} damage!`);
    
    // Add critical hit visual effect
    const criticalText = document.createElement('div');
    criticalText.textContent = 'CRITICAL!';
    criticalText.style.position = 'absolute';
    criticalText.style.color = 'gold';
    criticalText.style.fontWeight = 'bold';
    criticalText.style.fontSize = '1.5em';
    criticalText.style.top = '40%';
    criticalText.style.left = '50%';
    criticalText.style.transform = 'translate(-50%, -50%)';
    criticalText.style.textShadow = '0 0 10px red';
    criticalText.style.zIndex = '100';
    criticalText.style.animation = 'criticalText 1.5s forwards';
    
    if (battleArena) battleArena.appendChild(criticalText);
    
    // Remove critical text after animation
    setTimeout(() => {
      criticalText.remove();
    }, 1500);
  } else {
    updateBattleMessage(`You attack for ${damage} damage!`);
  }
  
  // Check for battle end
  if (battleState.enemyHealth <= 0) {
    endBattle('player');
    return;
  }
  
  // Switch turn
  battleState.turn = 'enemy';
  disableBattleButtons(true);
  
  // Enemy takes turn after delay
  setTimeout(enemyTurn, 1500);
}

// Player defend action
function playerDefend() {
  if (battleState.turn !== 'player') return;
  
  // Set defending state
  battleState.playerDefending = true;
  
  // Show defend animation
  showDefendAnimation('player');
  
  // Update battle message
  updateBattleMessage('You prepare to defend!');
  
  // Switch turn
  battleState.turn = 'enemy';
  disableBattleButtons(true);
  
  // Enemy takes turn after delay
  setTimeout(enemyTurn, 1500);
}

// Player special move
function playerSpecialMove() {
  if (battleState.turn !== 'player' || battleState.specialUsed) return;
  
  // Mark special move as used (only once per battle)
  battleState.specialUsed = true;
  
  // Calculate special damage based on insect type
  let specialDamage;
  let specialMessage;
  
  switch(selectedInsect.alt) {
    case 'fly':
      specialDamage = 15;
      specialMessage = 'Buzz Bomb! Your fly delivers a swift aerial attack!';
      break;
    case 'mosquito':
      specialDamage = 20;
      specialMessage = 'Blood Drain! Your mosquito sucks the enemy\'s health!';
      break;
    case 'spider':
      specialDamage = 25;
      specialMessage = 'Web Trap! Your spider entangles the enemy!';
      break;
    case 'roach':
      specialDamage = 30;
      specialMessage = 'Survival Surge! Your roach unleashes unstoppable power!';
      break;
    default:
      specialDamage = 15;
      specialMessage = 'Special attack!';
  }
  
  // Apply damage to enemy health
  battleState.enemyHealth = Math.max(0, battleState.enemyHealth - specialDamage);
  
  // Update health bars
  updateHealthBars();
  
  // Show special animation
  showSpecialAnimation('player', selectedInsect.alt);
  
  // Update battle message
  updateBattleMessage(specialMessage);
  
  // Disable special button for rest of battle
  if (specialBtn) {
    specialBtn.disabled = true;
    specialBtn.style.opacity = '0.5';
  }
  
  // Check for battle end
  if (battleState.enemyHealth <= 0) {
    endBattle('player');
    return;
  }
  
  // Switch turn
  battleState.turn = 'enemy';
  disableBattleButtons(true);
  
  // Enemy takes turn after delay
  setTimeout(enemyTurn, 2000);
}

// Enhanced enemy AI decision logic
function enemyTurn() {
  // Enemy AI decision with improved logic
  let decision;
  
  // When low on health, more likely to defend
  if (battleState.enemyHealth < 30) {
    if (Math.random() < 0.4) {
      decision = 'defend';
    } else if (Math.random() < 0.7) {
      decision = 'attack';
    } else {
      decision = 'special';
    }
  } 
  // When player health is low, more likely to attack
  else if (battleState.playerHealth < 30) {
    if (Math.random() < 0.7) {
      decision = 'attack';
    } else if (Math.random() < 0.9) {
      decision = 'special';
    } else {
      decision = 'defend';
    }
  } 
  // Normal condition
  else {
    if (Math.random() < 0.6) {
      decision = 'attack';
    } else if (Math.random() < 0.9) {
      decision = 'defend';
    } else {
      decision = 'special';
    }
  }
  
  // Execute decision
  switch (decision) {
    case 'attack':
      enemyAttack();
      break;
    case 'defend':
      enemyDefend();
      break;
    case 'special':
      enemySpecial();
      break;
  }
}

// Enemy attack action
function enemyAttack() {
  // Calculate damage based on enemy insect power
  const baseDamage = battleState.enemyInsect.power;
  let damage = baseDamage + Math.floor(Math.random() * 3);
  
  // Critical hit chance (5% for enemy)
  let isCritical = Math.random() < 0.05;
  if (isCritical) {
    damage = Math.floor(damage * 1.5);
  }
  
  // Reduce damage if player is defending
  if (battleState.playerDefending) {
    damage = Math.max(1, Math.floor(damage / 2));
    battleState.playerDefending = false;
  }
  
  // Apply damage to player health
  battleState.playerHealth = Math.max(0, battleState.playerHealth - damage);
  
  // Update health bars
  updateHealthBars();
  
  // Show attack animation
  showAttackAnimation('enemy');
  
  // Update battle message
  if (isCritical) {
    updateBattleMessage(`Critical hit! Enemy ${battleState.enemyInsect.alt} attacks for ${damage} damage!`);
  } else {
    updateBattleMessage(`Enemy ${battleState.enemyInsect.alt} attacks for ${damage} damage!`);
  }
  
  // Check for battle end
  if (battleState.playerHealth <= 0) {
    endBattle('enemy');
    return;
  }
  
  // Return turn to player
  setTimeout(() => {
    battleState.turn = 'player';
    disableBattleButtons(false);
    updateBattleMessage('Your turn!');
  }, 1500);
}

// Enemy defend action
function enemyDefend() {
  // Set defending state
  battleState.enemyDefending = true;
  
  // Show defend animation
  showDefendAnimation('enemy');
  
  // Update battle message
  updateBattleMessage(`Enemy ${battleState.enemyInsect.alt} prepares to defend!`);
  
  // Return turn to player
  setTimeout(() => {
    battleState.turn = 'player';
    disableBattleButtons(false);
    updateBattleMessage('Your turn!');
  }, 1500);
}

// Enemy special move
function enemySpecial() {
  // Calculate special damage
  const specialDamage = battleState.enemyInsect.power * 2;
  
  // Apply damage to player health
  battleState.playerHealth = Math.max(0, battleState.playerHealth - specialDamage);
  
  // Update health bars
  updateHealthBars();
  
  // Show special animation
  showSpecialAnimation('enemy', battleState.enemyInsect.alt);
  
  // Update battle message
  updateBattleMessage(`Enemy ${battleState.enemyInsect.alt} unleashes a special attack for ${specialDamage} damage!`);
  
  // Check for battle end
  if (battleState.playerHealth <= 0) {
    endBattle('enemy');
    return;
  }
  
  // Return turn to player
  setTimeout(() => {
    battleState.turn = 'player';
    disableBattleButtons(false);
    updateBattleMessage('Your turn!');
  }, 2000);
}

// Update health bars in battle
function updateHealthBars() {
  if (playerHealthBar) playerHealthBar.style.width = `${battleState.playerHealth}%`;
  if (enemyHealthBar) enemyHealthBar.style.width = `${battleState.enemyHealth}%`;
  
  // Change color based on health level
  if (playerHealthBar) {
    if (battleState.playerHealth < 30) {
      playerHealthBar.style.backgroundColor = '#f44336';
    } else if (battleState.playerHealth < 60) {
      playerHealthBar.style.backgroundColor = '#ff9800';
    } else {
      playerHealthBar.style.backgroundColor = '#2196f3';
    }
  }
  
  if (enemyHealthBar) {
    if (battleState.enemyHealth < 30) {
      enemyHealthBar.style.backgroundColor = '#f44336';
    } else if (battleState.enemyHealth < 60) {
      enemyHealthBar.style.backgroundColor = '#ff9800';
    } else {
      enemyHealthBar.style.backgroundColor = '#f44336';
    }
  }
}

// This function will run once when the document loads to clear any UI elements that shouldn't be there
document.addEventListener('DOMContentLoaded', function() {
  // Clear any existing controls that might have been created inadvertently
  clearExistingControls();
  
  // Hide battle arena on initial load if it exists
  if (battleArena) {
    battleArena.style.display = 'none';
  }
  
  // Make sure no screens have the 'up' class initially
  screens.forEach(screen => screen.classList.remove('up'));
  
  // Update high score display if element exists
  if (homeHighScoreValue) {
    highScoreValue = localStorage.getItem('insectGameHighScore') || 0;
    homeHighScoreValue.textContent = highScoreValue;
  }
});
