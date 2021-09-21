import { ship } from '../ship-factory'

describe('ship functions', () => {
    let testShip
    beforeEach(() => {
        testShip = ship(3)
    })
    test('ship takes a hit', () => {
        testShip.hit()
        expect(testShip.hits).toEqual(1)
    })

    test('ship takes multiple hits', () => {
        testShip.hit()
        testShip.hit()
        expect(testShip.hits).toEqual(2)
    })

    test('ship sinks', () => {
        testShip.hit()
        testShip.hit()
        testShip.hit()
        testShip.isSunk()
        expect(testShip.sunk).toBe(true)
    })

    test('ship does not sink if all positions are not hit', () => {
        testShip.hit()
        testShip.isSunk()
        expect(testShip.sunk).toBe(false)
    })
})
