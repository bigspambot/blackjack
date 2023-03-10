let cards = []
let dealerCards = []
let sum = 0
let dealerSum = 0
let hasBlackjack = false
let isAlive = false
let roundIsActive = false
let isWinner = false
let isDealerBust = false

let player = {
    name: "",
    chips: 0
}

let messageEl = document.getElementById("message-el")
// you can use querySelector instead of getElementById
// the # is for an id, . for classes
let cardsEl = document.querySelector("#cards-el")
let sumEl = document.querySelector("#sum-el")
let playerEl = document.querySelector("#player-el")
let dealerCardsEl = document.querySelector("#dealerCards-el")
let dealerSumEl = document.querySelector("#dealerSum-el")

function displayPlayer() {
    cardsEl.textContent = "Your hand: " + cards.join(' - ')
    sumEl.textContent = "Your score: " + sum
    playerEl.textContent = player.name + ": £" + player.chips
}

function displayDealer() {
    dealerCardsEl.textContent = "Dealer's hand: " + dealerCards
    dealerSumEl.textContent = "Dealer's score: " + dealerSum
}

function newGame() {
    // if no player name is set (default state), start a new game
    if (player.name === "") {

        while (player.name === "") {
            player.name = prompt("Enter your name: ")
        }
                
        // set to alive, round active, give you chips to begin minus first bet
        isAlive = true
        roundIsActive = true

        hasBlackjack = false

        player.chips = 150
        // get your cards and the dealer's first
        let firstCard = getRandomCard()
        let secondCard = getRandomCard()
        let dealerFirstCard = getRandomCard()
        // store your cards, the dealer's, and the sums
        cards = [firstCard, secondCard]
        sum = firstCard + secondCard
        dealerCards = [dealerFirstCard]
        dealerSum = dealerFirstCard
        
        player.chips -= 10
        displayGame()
    // if you already have chips, deal a new round
    } else if (player.chips > 0 && !roundIsActive) {

        isAlive = true
        roundIsActive = true

        hasBlackjack = false

        // get your cards and the dealer's first
        let firstCard = getRandomCard()
        let secondCard = getRandomCard()
        let dealerFirstCard = getRandomCard()
        // store your cards, the dealer's, and the sums
        cards = [firstCard, secondCard]
        sum = firstCard + secondCard
        dealerCards = [dealerFirstCard]
        dealerSum = dealerFirstCard

        player.chips -= 10
        displayGame()
        
    } else if (roundIsActive && isAlive && !hasBlackjack) {
        alert("Twist or Stick?")
    } else {
        alert("GAME OVER!")
    }
}

function displayGame() {

    displayPlayer()
    displayDealer()
    
    // generate message
    if (sum < 21 && roundIsActive) {
        message = "Twist or Stick?"
    } else if (sum === 21) {
        message = "You've got Blackjack! +25"
        hasBlackjack = true
        roundIsActive = false
        player.chips += 25
        displayPlayer()
    } else {
        message = "You're bust!"
        isAlive = false
        roundIsActive = false
    }
    messageEl.textContent = message
}

function twist() {
    // if you aren't bust, don't have blackjack, and the round is still active
    if (isAlive && !hasBlackjack && roundIsActive) {
        let newCard = getRandomCard()
        sum += newCard
        cards.push(newCard)
        checkWinner()
        displayGame()
    } else {
        alert("Deal")
    }
}

function getRandomCard() {
    let randomNumber = Math.floor(Math.random() * 13) + 1
    // change JACK (11), QUEEN (12), KING (13) to 10
    if (randomNumber >= 11) {
        return 10
    // this game always treats an ACE as 11
    } else if (randomNumber === 1) {
        return 11
    } else {
        return randomNumber
    }
}

function stick() {
    if (!roundIsActive) {
        alert("Deal")
    // if you have more than or equal to 16 and are not bust and don't have blackjack, you can stick
    } else if (sum >= 17 && isAlive && !hasBlackjack) {
        roundIsActive = false
        getDealerScore()
        
        isWinner = checkWinner()
        if (isWinner === true) {
            messageEl.textContent = "You win! +20"
            player.chips += 20
        } else if (isWinner === "push") {
            messageEl.textContent = "Push +10"
            player.chips += 10
        } else if (isWinner === false) {
            messageEl.textContent = "Dealer wins!"
        }
        displayPlayer()
    } else if (sum <= 16) {
        alert("Minimum to stick on is 17")
    } else if (!roundIsActive) {
        alert("Cannot stick because this round is over. DEAL a new hand")
    }
}

function getDealerScore() {
    while (dealerSum < 17) {
        let dealerCard = getRandomCard()
        dealerSum += dealerCard
        dealerCards.push(dealerCard)
    }
    displayDealer()
    return dealerSum
}

function checkWinner() {
    isDealerBust = checkDealer()
    // if you are alive and the dealer is bust
    if (isAlive && isDealerBust) {
        isWinner = true
    } else if (sum === dealerSum) {
        isWinner = "push"
    // if you have more than the dealer
    } else if (sum > dealerSum) {
        isWinner = true
    } else {
        isWinner = false
    }
    return isWinner
}

function checkDealer() {
    if (dealerSum > 21) {
        return true
    } else {
        return false
    }
}