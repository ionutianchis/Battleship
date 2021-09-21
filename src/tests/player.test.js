import { player}  from '../player-factory'
import { ship } from '../ship-factory'
import { gameboard } from '../gameboard-factory'

describe('player tests', () => {
    let testShip
    let player1
    let ai
    beforeEach(() => {
        testShip = ship(3)
        player1 = player('player1')
        player1.gameboard.createBoard(10)
        player1.gameboard.placeShip(testShip, 0)
        ai = player('ai')
        ai.gameboard.createBoard(10)
        ai.gameboard.placeShip(testShip, 5)
    })
    test('player1 can attack ai', () => {
        player1.attack(ai.gameboard, 5)
        expect(ai.gameboard.board[5].hasOwnProperty('hit')).toBe(true)
    })
    test('AI attacks player', () => {
        ai.aiAttack(player1.gameboard)
        expect(player1.gameboard.board.some(x => x.hit)).toBe(true)
    })
})

/* test('AI attacks neighbouring cell if previous attack hit', () => {
    const testShip = ship(2)
    const player1 = player('player1')
    player1.gameboard.createBoard(3)
    player1.gameboard.placeShip(testShip, 0)
    const ai = player('ai')
    ai.aiAttack(player1.gameboard)
    expect(player1.gameboard.board[1].hit).toBe(true)
    expect(player1.gameboard.board[2].hit).toBe(true)
}) */
