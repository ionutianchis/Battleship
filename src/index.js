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
    for (const square of playerCellArr) {
        if (square.classList.contains('shipHover')) {
            square.classList.remove('shipHover')
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

function hoverShip (cell, ship) {
    let i = 0
    let x = cell.nextElementSibling
    // eslint-disable-next-line no-unmodified-loop-condition
    while (x) {
        i++
        if (i === ship.length) break
        x.classList.toggle('shipHover')
        x = x.nextElementSibling
    }
}

function placeShips () {
    const playerAvailableShips = []
    playerAvailableShips.push(carrier, battleship, cruiser, submarine, destroyer)

    shipAnnouncement.textContent = `Place your ${playerAvailableShips[0].name}, captain`

    const unplaceable = [9, 19, 29, 39, 49, 59, 69, 79, 89, 99]
    const carrierUnplaceable = [6, 7, 8, 16, 17, 18, 26, 27, 28, 36, 37, 38, 46, 47, 48, 56, 57, 58, 66, 67, 68, 76, 77, 78, 86, 87, 88, 96, 97, 98]
    const battleshipUnplaceable = carrierUnplaceable.filter(x => x !== 6 && x !== 16 && x !== 26 && x !== 36 && x !== 46 && x !== 56 && x !== 66 && x !== 76 && x !== 86 && x !== 96)
    const cruiserUnplaceable = battleshipUnplaceable.filter(x => x !== 7 && x !== 17 && x !== 27 && x !== 37 && x !== 47 && x !== 57 && x !== 67 && x !== 77 && x !== 87 && x !== 97)

    for (const playerCell of playerCellArr) {
        playerCell.addEventListener('mouseover', (e) => {
            e.target.classList.toggle('shipHover')
            hoverShip(playerCell, playerAvailableShips[0])
        })
        playerCell.addEventListener('mouseleave', (e) => {
            e.target.classList.toggle('shipHover')
            hoverShip(playerCell, playerAvailableShips[0])
        })
        playerCell.addEventListener('click', () => {
            const index = playerCellArr.indexOf(playerCell)
            if (!(playerAvailableShips.length < 1) && !(unplaceable.includes(index)) && player1.gameboard.board[index + playerAvailableShips[0].length - 1].hasShip === false) {
                if (playerAvailableShips[0].name === 'carrier' && !(carrierUnplaceable.includes(index))) {
                    if (playerAvailableShips[1]) shipAnnouncement.textContent = `Place your ${playerAvailableShips[1].name}, captain`
                    player1.gameboard.placeShip(playerAvailableShips[0], index)
                    playerAvailableShips.shift()
                    displayShips(player1.gameboard.board, playerCellArr)
                } else if (playerAvailableShips[0].name === 'battleship' && !(battleshipUnplaceable.includes(index))) {
                    player1.gameboard.placeShip(playerAvailableShips[0], index)
                    if (playerAvailableShips[1]) shipAnnouncement.textContent = `Place your ${playerAvailableShips[1].name}, captain`
                    playerAvailableShips.shift()
                    displayShips(player1.gameboard.board, playerCellArr)
                } else if ((playerAvailableShips[0].name === 'cruiser' || playerAvailableShips[0].name === 'submarine') && !(cruiserUnplaceable.includes(index))) {
                    player1.gameboard.placeShip(playerAvailableShips[0], index)
                    if (playerAvailableShips[1]) shipAnnouncement.textContent = `Place your ${playerAvailableShips[1].name}, captain`
                    playerAvailableShips.shift()
                    displayShips(player1.gameboard.board, playerCellArr)
                } else if (playerAvailableShips[0].name === 'destroyer') {
                    player1.gameboard.placeShip(playerAvailableShips[0], index)
                    if (playerAvailableShips[1]) shipAnnouncement.textContent = `Place your ${playerAvailableShips[1].name}, captain`
                    playerAvailableShips.shift()
                    displayShips(player1.gameboard.board, playerCellArr)
                }
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

function checkForShip () {
    const lastColumn = []
    lastColumn.push(ai.gameboard.board[9], ai.gameboard.board[19], ai.gameboard.board[29], ai.gameboard.board[39], ai.gameboard.board[49], ai.gameboard.board[59], ai.gameboard.board[69], ai.gameboard.board[79], ai.gameboard.board[89])
    const firstColumn = []
    firstColumn.push(ai.gameboard.board[10], ai.gameboard.board[20], ai.gameboard.board[30], ai.gameboard.board[40], ai.gameboard.board[50], ai.gameboard.board[60], ai.gameboard.board[70], ai.gameboard.board[80], ai.gameboard.board[90])
    for (let i = 0; i < firstColumn.length; i++) {
        if (firstColumn[i].hasOwnProperty('ship') && lastColumn[i].hasOwnProperty('ship')) {
            return false
        }
    }
}

function randomlyPlaceAiShips () {
    const aiAvailableShips = []
    aiAvailableShips.push(aiCarrier, aiBattleship, aiCruiser, aiSubmarine, aiDestroyer)
    let aiChosen
    if (typeof aiChosen === 'undefined') {
        aiChosen = []
    }
    for (let i = 0; i < 5; i++) {
        let randomChoice = Math.floor(Math.random() * ai.gameboard.board.length)
        const shipPlacement = ai.gameboard.board.slice(randomChoice, randomChoice + aiAvailableShips[i].length)
        if (!(aiChosen.includes(randomChoice)) && randomChoice + aiAvailableShips[i].length < ai.gameboard.board.length && ai.gameboard.board[randomChoice].hasShip === false && ai.gameboard.board[randomChoice + aiAvailableShips[i].length].hasShip === false) {
            aiChosen.push(randomChoice)
        } else {
            while (aiChosen.includes(randomChoice) || randomChoice + aiAvailableShips[i].length >= ai.gameboard.board.length || shipPlacement.some(x => x.hasShip === true) || ai.gameboard.board[randomChoice].hasShip === true || ai.gameboard.board[randomChoice + aiAvailableShips[i].length].hasShip === true) {
                randomChoice = Math.floor(Math.random() * ai.gameboard.board.length)
                if (!(aiChosen.includes(randomChoice)) && randomChoice + aiAvailableShips[i].length < ai.gameboard.board.length && ai.gameboard.board[randomChoice].hasShip === false && ai.gameboard.board[randomChoice + aiAvailableShips[i].length].hasShip === false) {
                    aiChosen.push(randomChoice)
                    break
                }
            }
        }
        ai.gameboard.placeShip(aiAvailableShips[i], aiChosen[i])
    }
}

function removeShips () {
    for (const cell of ai.gameboard.board) {
        if (cell.hasOwnProperty('ship')) {
            delete cell.ship
            cell.hasShip = false
        }
    }
}

function replaceShips () {
    while (checkForShip() === false) {
        removeShips()
        randomlyPlaceAiShips()
        if (checkForShip() !== false) {
            break
        }
    }
}

const gameLogic = (() => {
    placeShips()
    randomlyPlaceAiShips()
    replaceShips()
    attackLogic()
    // displayShips(ai.gameboard.board, aiCellArr)
})()
