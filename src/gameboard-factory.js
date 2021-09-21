/* eslint-disable no-prototype-builtins */
const gameboard = (player) => {
    return {
        owner: player,
        board: [],
        fleet: [],
        noShips: false,
        createBoard (size) {
            for (let i = 0; i < size; i++) {
                this.board.push({ hasShip: false, hit: false })
            }
        },
        placeShip (ship, coords) {
            this.fleet.push(ship)
            for (let i = 0; i < ship.length; i++) {
                this.board[coords + i].ship = ship
            }
            for (const cell of this.board) {
                if (cell.hasOwnProperty('ship')) { cell.hasShip = true }
            }
        },
        receiveAttack (attackCoords) {
            if (this.board[attackCoords].hasOwnProperty('ship') && this.board[attackCoords].hit !== true) {
                this.board[attackCoords].ship.hit()
                if (this.board[attackCoords].ship.hits === this.board[attackCoords].ship.length) {
                    this.board[attackCoords].ship.sunk = true
                }
                const gameOver = this.fleet.every(ship => ship.sunk === true)
                if (gameOver) this.noShips = true
            }
            this.board[attackCoords].hit = true
        }
    }
}

export { gameboard }
