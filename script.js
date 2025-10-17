const diceBtn = document.getElementById('dice');
const clearBtn = document.getElementById('clear-btn');
const numDisplays = document.querySelectorAll('.num-display');

// Game state - stores values for each position
const gameState = {
  '1,1': null,
  '1,2': null,
  '2,1': null,
  '2,2': null,
  '3,1': null,
  '3,2': null
};

let currentPosition = null;
let waitingForNumberSelection = false;

// Dice face patterns
const diceFaces = {
  1: '<div class="dot center"></div>',
  2: '<div class="dot top-left"></div><div class="dot bottom-right"></div>',
  3: '<div class="dot top-left"></div><div class="dot center"></div><div class="dot bottom-right"></div>',
  4: '<div class="dot top-left"></div><div class="dot top-right"></div><div class="dot bottom-left"></div><div class="dot bottom-right"></div>',
  5: '<div class="dot top-left"></div><div class="dot top-right"></div><div class="dot center"></div><div class="dot bottom-left"></div><div class="dot bottom-right"></div>',
  6: '<div class="dot top-left"></div><div class="dot top-right"></div><div class="dot middle-left"></div><div class="dot middle-right"></div><div class="dot bottom-left"></div><div class="dot bottom-right"></div>'
};

// Set initial dice face to 1
function setDiceFace(number) {
  const diceFace = diceBtn.querySelector('.dice-face');
  diceFace.innerHTML = diceFaces[number];
}

// Show keypad popup
function showKeypad(position) {
  currentPosition = position;
  document.getElementById('current-position').textContent = `(${position})`;
  document.getElementById('keypad-popup').classList.add('show');
}

// Set number for current position
function setNumber(number) {
  if (currentPosition && waitingForNumberSelection) {
    gameState[currentPosition] = number;
    updateDisplay(currentPosition, number);
    
    // Enable dice again and disable keypad
    waitingForNumberSelection = false;
    document.getElementById('dice').classList.remove('disabled');
    disableKeypad();
  }
}

// Enable keypad buttons
function enableKeypad() {
  const keypadBtns = document.querySelectorAll('.keypad-btn');
  keypadBtns.forEach(btn => btn.classList.remove('disabled'));
}

// Disable keypad buttons
function disableKeypad() {
  const keypadBtns = document.querySelectorAll('.keypad-btn');
  keypadBtns.forEach(btn => btn.classList.add('disabled'));
}

// Update display for a position
function updateDisplay(position, value) {
  const display = document.querySelector(`[data-position="${position}"]`);
  const diceFace = display.querySelector('.dice-face');
  
  if (value === null) {
    diceFace.innerHTML = '-';
    display.classList.remove('has-value');
  } else {
    diceFace.innerHTML = getSmallDiceFace(value);
    display.classList.add('has-value');
  }
}

// Generate dice face for small displays (different from main dice)
function getSmallDiceFace(number) {
  const diceFaces = {
    1: '<div class="dot center"></div>',
    2: '<div class="dot top-left"></div><div class="dot bottom-right"></div>',
    3: '<div class="dot top-left"></div><div class="dot center"></div><div class="dot bottom-right"></div>',
    4: '<div class="dot top-left"></div><div class="dot top-right"></div><div class="dot bottom-left"></div><div class="dot bottom-right"></div>',
    5: '<div class="dot top-left"></div><div class="dot top-right"></div><div class="dot center"></div><div class="dot bottom-left"></div><div class="dot bottom-right"></div>',
    6: '<div class="dot top-left"></div><div class="dot top-right"></div><div class="dot middle-left"></div><div class="dot middle-right"></div><div class="dot bottom-left"></div><div class="dot bottom-right"></div>'
  };
  return diceFaces[number];
}

// Show result in side panel
function showResult(diceResult) {
  // Map dice result to corresponding position
  let targetPosition;
  let targetValue = null;
  
  // Map dice result to position - using correct mapping
  switch(diceResult) {
    case 1: targetPosition = '1,1'; targetValue = gameState['1,1']; break;
    case 2: targetPosition = '2,1'; targetValue = gameState['2,1']; break;
    case 3: targetPosition = '3,1'; targetValue = gameState['3,1']; break;
    case 4: targetPosition = '1,2'; targetValue = gameState['1,2']; break;
    case 5: targetPosition = '2,2'; targetValue = gameState['2,2']; break;
    case 6: targetPosition = '3,2'; targetValue = gameState['3,2']; break;
  }
  
  // Set current position for keypad
  currentPosition = targetPosition;
  
  // Random funny messages
  const safeMessages = [
    '恭喜安全了! 🎉',
    '逃過一劫! 😅',
    '今天運氣不錯! ✨',
    '躲過了! 太幸運了! 🍀',
    '安全通關! 👍',
    '免喝一輪! 😎'
  ];
  
  const penaltyMessages = [
    `中獎! ${targetValue} 杯啤酒! 🍺`,
    `天啊! ${targetValue} 杯下肚! 🤢`,
    `完蛋了! ${targetValue} 杯等著你! 😵`,
    `哭哭! ${targetValue} 杯啤酒! 😭`,
    `倒霉! ${targetValue} 杯乾杯! 🍻`,
    `命苦啊! ${targetValue} 杯走起! 🥴`
  ];
  
  let message;
  if (targetValue === null) {
    message = safeMessages[Math.floor(Math.random() * safeMessages.length)];
  } else {
    message = penaltyMessages[Math.floor(Math.random() * penaltyMessages.length)];
  }
  
  document.getElementById('result-title').textContent = `骰子結果: ${diceResult}`;
  document.getElementById('result-message').textContent = message;
  
  // Add shake effect if penalty hit
  if (targetValue !== null) {
    const keypadSection = document.querySelector('.keypad-section');
    keypadSection.classList.add('shake');
    // Remove shake class after animation completes
    setTimeout(() => {
      keypadSection.classList.remove('shake');
    }, 600);
  }
  
  // Disable dice and enable keypad for number selection
  waitingForNumberSelection = true;
  document.getElementById('dice').classList.add('disabled');
  enableKeypad();
}

// Close result popup
function closePopup() {
  document.getElementById('result-popup').classList.remove('show');
}

// Roll dice on click
let rolling = false;
diceBtn.addEventListener('click', () => {
  if (rolling || waitingForNumberSelection) return;
  rolling = true;
  
  // Show rolling message
  document.getElementById('result-title').textContent = '擲骰中....';
  document.getElementById('result-message').textContent = '';
  
  // Add rolling animation class
  diceBtn.classList.add('rolling');
  
  let rollCount = 0;
  const rollAnim = setInterval(() => {
    const randomFace = Math.floor(Math.random() * 6) + 1;
    setDiceFace(randomFace);
    rollCount++;
    if (rollCount > 12) {
      clearInterval(rollAnim);
      const finalResult = Math.floor(Math.random() * 6) + 1;
      setDiceFace(finalResult);
      
      // Remove rolling animation after a short delay
      setTimeout(() => {
        diceBtn.classList.remove('rolling');
        rolling = false;
        showResult(finalResult);
      }, 200);
    }
  }, 100);
});

// Clear all values
clearBtn.addEventListener('click', () => {
  Object.keys(gameState).forEach(position => {
    gameState[position] = null;
    updateDisplay(position, null);
  });
  
  // Reset game state
  waitingForNumberSelection = false;
  currentPosition = null;
  document.getElementById('dice').classList.remove('disabled');
  disableKeypad();
  document.getElementById('result-title').textContent = '擲骰子!';
  document.getElementById('result-message').textContent = '點擊骰子開始遊戲';
});

// Initialize dice with face 1 and disable keypad
setDiceFace(1);
disableKeypad();
