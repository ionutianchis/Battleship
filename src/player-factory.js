import { gameboard } from './gameboard-factory'

const player = (name) => {
    return {
        name: name,
        gameboard: gameboard(name),
        aiPick: [],
        attack (board, coords) {
            board.receiveAttack(coords)
        },
        aiAttack (enemyBoard) {
            let randomChoice = Math.floor(Math.random() * enemyBoard.board.length)

            if (!(this.aiPick.includes(randomChoice))) {
                this.aiPick.push(randomChoice)
            } else {
                while (this.aiPick.includes(randomChoice)) {
                    randomChoice = Math.floor(Math.random() * enemyBoard.board.length)
                    if (!(this.aiPick.includes(randomChoice))) {
                        this.aiPick.push(randomChoice)
                        break
                    }
                }
            }
            this.attack(enemyBoard, randomChoice)
            /* computer ai
             if (!(enemyBoard.board[99] === enemyBoard.board[randomChoice])) {
                while (enemyBoard.board[randomChoice].hasShip === true) {
                    randomChoice = randomChoice + 1
                    this.attack(enemyBoard, randomChoice)
                    if (enemyBoard.board[randomChoice].hasShip === false) {
                        break
                    }
                }
            } */
        }
    }
}

export { player }
