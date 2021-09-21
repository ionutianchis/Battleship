import { gameboard } from '../gameboard-factory'
import { ship } from '../ship-factory'

describe('gameboard functions', () => {
    let testShip
    let testBoard
    beforeEach(() => {
        testShip = ship(3)
        testBoard = gameboard('player', 100)
        testBoard.createBoard(100)
    })
    test('ship is placed', () => {
        testBoard.placeShip(testShip, 3)
        expect(testBoard.board[3].hasOwnProperty('ship')).toBe(true)
    })
    test('cells are occupied based on ship length', () => {
        testBoard.placeShip(testShip, 3)
        expect(testBoard.board[3].hasOwnProperty('ship')).toBe(true)
        expect(testBoard.board[4].hasOwnProperty('ship')).toBe(true)
        expect(testBoard.board[5].hasOwnProperty('ship')).toBe(true)
    })
    test('ship is hit if attacks hit it', () => {
        testBoard.placeShip(testShip, 4)
        testBoard.receiveAttack(4)
        expect(testBoard.board[4].ship.hits).toEqual(1)
    })

    test('ship cannot be hit again in same spot', () => {
        testBoard.placeShip(testShip, 4)
        testBoard.receiveAttack(4)
        testBoard.receiveAttack(4)
        expect(testBoard.board[4].ship.hits).toEqual(1)
    })

    test('ship is not hit if attack misses', () => {
        testBoard.placeShip(testShip, 1)
        testBoard.receiveAttack(10)
        expect(testBoard.board[1].ship.hits).toEqual(0)
    })
    test('board registers missed attacks', () => {
        testBoard.placeShip(testShip, 5)
        testBoard.receiveAttack(1)
        expect(testBoard.board[1].hit).toBe(true)
    })

    test('board registers when game is over', () => {
        testBoard.placeShip(testShip, 3)
        testBoard.receiveAttack(3)
        testBoard.receiveAttack(4)
        testBoard.receiveAttack(5)
        expect(testBoard.noShips).toBe(true)
    })
})
