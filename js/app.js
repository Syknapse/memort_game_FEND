const array = ['diamond', 'paper-plane-o', 'anchor', 'bolt', 'cube', 'leaf', 'bicycle', 'bomb']
const symbols = array.concat(array)
const deck = document.querySelector('[data-select=deck]')
const movesNumber = document.querySelector('[data-select=moves]')
const matchedNumber = document.querySelector('[data-select=matched]')
const ratingDisplay = document.querySelector('[data-select=rating]')
const resetButton = document.querySelector('[data-select=reset]')
let isStart = true
let selectedCards = []
let matchedCards = []
const star = `<i class="fa fa-star"></i>`

// Reset
function resetGame() {
     deck.innerHTML = ''
     selectedCards = []
     matchedCards = []
     moves = 0
     matched = 0
     movesNumber.innerHTML = '0'
     matchedNumber.innerHTML = '0'
     ratingDisplay.innerHTML = `${star} Your Rating ${star}`
     resetTimer()
     isStart = true
     initialize()
}

//Reset Button
resetButton.addEventListener('click', () => {
    stopTimer()
    resetGame()
})

// Start game
function initialize() {
    shuffle(symbols)

    symbols.forEach( symbol => {
        const card = document.createElement('div')
        card.classList.add('card')
        card.innerHTML = `<i class="fa fa-${symbol}"></i>`

        deck.appendChild(card)
        addClick(card)
    })
}

function addClick(card) {
    card.addEventListener('click', (e) => {
        if (isStart) {
            isStart = false
            startTimer()
        }

        const previousCard = selectedCards[0]
        const currentCard = e.currentTarget

        if (selectedCards.length === 1) {
            card.classList.add('open', 'show', 'disabled')
            selectedCards.push(currentCard)
            addMove()
            compareCards(currentCard, previousCard)
        } else {
            card.classList.add('open', 'show', 'disabled')
            selectedCards.push(currentCard)
        }
    })
}

function compareCards(currentCard, previousCard) {
    if (currentCard.innerHTML === previousCard.innerHTML) {
        currentCard.classList.add('match')
        previousCard.classList.add('match')
        matchedCards.push(currentCard, previousCard)
        addMatched()
        rating()
        selectedCards = []
        gameOver()
    } else {
        setTimeout( () => {
            currentCard.classList.remove('open', 'show', 'disabled')
            previousCard.classList.remove('open', 'show', 'disabled')
        }, 600)
        selectedCards = []
    }
}

// Increase number of moves
let moves = 0
function addMove() {
    moves++
    movesNumber.innerHTML = moves
}

// Number of matched cards
let matched = 0
function addMatched() {
    matched++
    matchedNumber.innerHTML = matched
}

// Rating
function rating() {
    if (moves < 8) {
        ratingDisplay.innerHTML = `Super Ace ${star}${star}${star}${star}${star}`
    } else if (moves < 16) {
        ratingDisplay.innerHTML = `Ace ${star}${star}${star}${star}`

    } else if (moves < 22) {
        ratingDisplay.innerHTML = `Amazing ${star}${star}${star}`

    } else if (moves < 30) {
        ratingDisplay.innerHTML = `Great ${star}${star}`

    } else if (moves < 40) {
        ratingDisplay.innerHTML = `Not bad ${star}`

    } else if (moves > 40) {
        ratingDisplay.innerHTML = `Well ... <i class="fa fa-star-o"></i>`

    }
}

// Timer (based on https://stackoverflow.com/questions/5517597/plain-count-up-timer-in-javascript)
let sec = 0
let timer
const secondsDisplay = document.getElementById('seconds')
const minutesDisplay = document.getElementById('minutes')

function pad(val) {
    return val > 9 ? val : `0${val}`
}
function setTimer() {
    secondsDisplay.innerHTML = pad(++sec%60)
    minutesDisplay.innerHTML = pad(parseInt(sec/60,10))
}

function startTimer() {
    timer = setInterval(setTimer, 1000)
}

function stopTimer() {
    clearInterval(timer)
}

function resetTimer() {
    secondsDisplay.innerHTML = '00'
    minutesDisplay.innerHTML = '00'
    sec = 0
}


 // Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex)
        currentIndex -= 1
        temporaryValue = array[currentIndex]
        array[currentIndex] = array[randomIndex]
        array[randomIndex] = temporaryValue
    }

    return array
}

function gameOver() {
    if (matchedCards.length === symbols.length) {
        stopTimer()
        endGame()
    }
}

// End Game modal
const endGameContainer = document.querySelector('[data-select=end-game-container]')
const message = document.querySelector('[data-select=message]')
const backdrop = document.querySelector('[data-select=backdrop]')
const playAgainButton = document.querySelector('[data-select=play-again]')

function endGame() {
    let finalRating = ratingDisplay.innerHTML
    let minutes = minutesDisplay.innerText
    let seconds = secondsDisplay.innerText
    endGameContainer.classList.remove('hide')
    message.innerHTML = `
    <p>Round complete after <strong>${moves}</strong> moves</p>
    <p>You did it in <strong>${minutes}:${seconds}</strong></p>
    <p>Your rating was <strong>${finalRating}</strong></p>
    `
}

playAgainButton.addEventListener('click', ()=> {
    resetGame()
    hideModal()
})

backdrop.addEventListener('click', () => {
    hideModal()
})

function hideModal(){
    endGameContainer.classList.add('hide')
}

initialize()