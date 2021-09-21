const ship = (length, name) => {
    return {
        name: name,
        length: length,
        hits: 0,
        sunk: false,
        hit () {
            this.hits++
        },
        isSunk () {
            if (this.length === this.hits) {
                this.sunk = true
            }
        }
    }
}
export { ship }
