const emojis = ['🎮', '🎯', '🎲', '🎪', '🎨', '🎭', '🎸', '🎤'];
const easyEmojis = ['🎮', '🎯', '🎲', '🎪', '🎨', '🎭', '🎸', '🎤'];
const hardEmojis = ['🎮', '🎯', '🎲', '🎪', '🎨', '🎭', '🎸', '🎤', '🎺', '🎻', '🎬', '🏀'];

let cards = [];
let flipped = [];
let matched = [];
let moves = 0;
let difficulty = 'easy';
let gameActive = true;

function initGame() {
    const gameBoard = document.getElementById('gameBoard');
    gameBoard.innerHTML = '';
    gameBoard.className = 'game-board';
    if (difficulty === 'hard') {
        gameBoard.classList.add('hard');
    }

    cards = [];
    flipped = [];
    matched = [];
    moves = 0;
    gameActive = true;

    updateStats();

    const currentEmojis = difficulty === 'easy' ? easyEmojis : hardEmojis;
    const gameEmojis = [...currentEmojis, ...currentEmojis];
    
    // Shuffle array
    for (let i = gameEmojis.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [gameEmojis[i], gameEmojis[j]] = [gameEmojis[j], gameEmojis[i]];
    }

    gameEmojis.forEach((emoji, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div class="card-inner">
                <div class="card-front"></div>
                <div class="card-back">${emoji}</div>
            </div>
        `;
        card.addEventListener('click', () => flipCard(index, card));
        gameBoard.appendChild(card);
        cards.push({ emoji, flipped: false, matched: false, element: card });
    });

    document.getElementById('winMessage').classList.add('hidden');
}

function flipCard(index, cardElement) {
    if (!gameActive || flipped.length >= 2) return;
    if (flipped.includes(index) || matched.includes(index)) return;

    flipped.push(index);
    cards[index].flipped = true;
    cardElement.classList.add('flipped');

    if (flipped.length === 2) {
        moves++;
        updateStats();
        checkMatch();
    }
}

function checkMatch() {
    const [index1, index2] = flipped;
    const match = cards[index1].emoji === cards[index2].emoji;

    if (match) {
        matched.push(index1, index2);
        cards[index1].matched = true;
        cards[index2].matched = true;
        cards[index1].element.classList.add('matched');
        cards[index2].element.classList.add('matched');
        cards[index1].element.classList.add('disabled');
        cards[index2].element.classList.add('disabled');
        flipped = [];
        updateStats();

        if (matched.length === cards.length) {
            endGame();
        }
    } else {
        setTimeout(() => {
            cards[index1].flipped = false;
            cards[index2].flipped = false;
            cards[index1].element.classList.remove('flipped');
            cards[index2].element.classList.remove('flipped');
            flipped = [];
        }, 1000);
    }
}

function updateStats() {
    document.getElementById('moves').textContent = moves;
    const totalPairs = difficulty === 'easy' ? 8 : 12;
    document.getElementById('pairs').textContent = `${matched.length / 2}/${totalPairs}`;
}

function resetGame() {
    initGame();
}

function toggleDifficulty() {
    difficulty = difficulty === 'easy' ? 'hard' : 'easy';
    document.getElementById('difficultyLabel').textContent = difficulty === 'easy' ? 'Easy' : 'Hard';
    initGame();
}

function endGame() {
    gameActive = false;
    const winMessage = document.getElementById('winMessage');
    const totalPairs = difficulty === 'easy' ? 8 : 12;
    const difficultyText = difficulty === 'easy' ? 'Easy Mode' : 'Hard Mode';
    
    document.getElementById('winStats').textContent = 
        `🎊 Congratulations!\n${difficultyText} - ${moves} Moves - ${totalPairs} Pairs Found`;
    
    winMessage.classList.remove('hidden');
}

// Initialize game on page load
window.addEventListener('DOMContentLoaded', initGame);
