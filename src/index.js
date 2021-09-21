/* eslint-disable no-undef */
/* eslint-disable no-prototype-builtins */
/* eslint-disable no-unused-vars */
import { ship } from './ship-factory'
import { gameboard } from './gameboard-factory'
import { player } from './player-factory'

const boards = document.querySelector('#boards')
const playerBoard = document.querySelector('#playerBoard')
const aiBoard = document.querySelector('#aiBoard')
const popupContainer = document.querySelector('#popupContainer')
const popup = document.querySelector('#popup')
const shipAnnouncement = document.querySelector('#shipTurn')

function createGrid (board, size) {
    board.style.gridTemplateColumns = `repeat(${size}, 1fr)`
    board.style.gridTemplateRows = `repeat(${size}, 1fr)`
    for (let i = 0; i < size * size; i++) {
        const cell = document.createElement('div')
        cell.classList.add('cell')
        board.appendChild(cell)
    }
}

const player1 = player('player1')
player1.gameboard.createBoard(100)
createGrid(playerBoard, 10)

const carrier = ship(5, 'carrier')
const battleship = ship(4, 'battleship')
const cruiser = ship(3, 'cruiser')
const submarine = ship(3, 'submarine')
const destroyer = ship(2, 'destroyer')
const playerAvailableShips = []
playerAvailableShips.push(carrier, battleship, cruiser, submarine, destroyer)

const aiCarrier = ship(5, 'carrier')
const aiBattleship = ship(4, 'battleship')
const aiCruiser = ship(3, 'cruiser')
const aiSubmarine = ship(3, 'submarine')
const aiDestroyer = ship(2, 'destroyer')

const playerCellArr = [...playerBoard.querySelectorAll('.cell')]
const ai = player('AI')
ai.gameboard.createBoard(100)
createGrid(aiBoard, 10)

const aiCellArr = [...aiBoard.querySelectorAll('.cell')]

function displayShips (board, cellArr) {
    for (const cell of board) {
        if (cell.hasOwnProperty('ship')) {
            const index = board.indexOf(cell)
            cellArr[index].classList.add('hasShip')
        }
    }
}

function displayAiAttacks () {
    for (const cell of player1.gameboard.board) {
        if (cell.hit === true) {
            const index = player1.gameboard.board.indexOf(cell)
            playerCellArr[index].classList.add('hit')
            if (playerCellArr[index].classList.contains('hasShip')) {
                playerCellArr[index].classList.remove('hasShip')
            }
        }
    }
}

function attackLogic () {
    for (const cell of aiCellArr) {
        cell.addEventListener('click', () => {
            const index = aiCellArr.indexOf(cell)

            if (ai.gameboard.board[index].hasShip) {
                cell.classList.add('hasShip')
            } else {
                cell.classList.add('hit')
            }
            ai.gameboard.receiveAttack(index)

            ai.aiAttack(player1.gameboard)
            displayAiAttacks()
            console.log(player1.gameboard)
            if (ai.gameboard.noShips === true) {
                alert('Game over, you won !')
                playerBoard.style.pointerEvents = 'none'
                aiBoard.style.pointerEvents = 'none'
            } else if (player1.gameboard.noShips === true) {
                alert('Game over, you lost :(')
                playerBoard.style.pointerEvents = 'none'
                aiBoard.style.pointerEvents = 'none'
            }
        })
    }
}

function placeShips () {
    shipAnnouncement.textContent = `Place your ${playerAvailableShips[0].name}, captain`
    for (const playerCell of playerCellArr) {
        playerCell.addEventListener('click', () => {
            if (!(playerAvailableShips.length < 1)) {
                const index = playerCellArr.indexOf(playerCell)
                player1.gameboard.placeShip(playerAvailableShips[0], index)
                if (playerAvailableShips[1]) shipAnnouncement.textContent = `Place your ${playerAvailableShips[1].name}, captain`
                playerAvailableShips.shift()
                displayShips(player1.gameboard.board, playerCellArr)
            }
            if (playerAvailableShips.length < 1) {
                popupContainer.style.display = 'none'
                popup.removeChild(playerBoard)
                boards.insertBefore(playerBoard, aiBoard)
                playerBoard.style.pointerEvents = 'none'
            }
        })
    }
}

function randomlyPlaceAiShips () {
    const aiAvailableShips = []
    aiAvailableShips.push(aiCarrier, aiBattleship, aiCruiser, aiSubmarine, aiDestroyer)
    let aiChosen
    if (typeof aiChosen === 'undefined') {
        aiChosen = []
    }
    let randomChoice = Math.floor(Math.random() * ai.gameboard.board.length)
    for (let i = 0; i < 5; i++) {
        if (!(aiChosen.includes(randomChoice)) && randomChoice + aiAvailableShips[i].length <= 99 && ai.gameboard.board[randomChoice].hasShip === false) {
            aiChosen.push(randomChoice)
            ai.gameboard.placeShip(aiAvailableShips[i], aiChosen[i])
        } else {
            while (aiChosen.includes(randomChoice) || randomChoice + aiAvailableShips[i].length > 99 || ai.gameboard.board[randomChoice].hasShip === true) {
                randomChoice = Math.floor(Math.random() * ai.gameboard.board.length)
                if (!(aiChosen.includes(randomChoice)) && !(randomChoice + aiAvailableShips[i].length > 99)) {
                    aiChosen.push(randomChoice)
                    break
                }
            }
        }
        ai.gameboard.placeShip(aiAvailableShips[i], aiChosen[i])
    }
}

const gameLogic = (() => {
    placeShips()
    randomlyPlaceAiShips()
    attackLogic()
    displayShips(ai.gameboard.board, aiCellArr)
})()
