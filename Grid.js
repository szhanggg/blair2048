const GRID_SIZE = 4;
const CELL_SIZE = 15;
const CELL_GAP = 1.5;

export default class Grid {
    #cells

    constructor(gridElement) {
        gridElement.style.setProperty("--grid-size", GRID_SIZE);
        gridElement.style.setProperty("--cell-size", `${CELL_SIZE}vmin`);
        gridElement.style.setProperty("--cell-gap", `${CELL_GAP}vmin`);
        this.#cells = createCellElements(gridElement).map((cellElement, index) => {
            return new Cell(cellElement, index % GRID_SIZE, Math.floor(index / GRID_SIZE));
        });
    }

    get cells() {
        return this.#cells;
    }

    get cellsByColumn() {
        return this.#cells.reduce((acc, cell) => {
            acc[cell.x] = acc[cell.x] || [];
            acc[cell.x].push(cell);
            return acc;
        }, []);
    }

    get cellsByRow() {
        return this.#cells.reduce((acc, cell) => {
            acc[cell.y] = acc[cell.y] || [];
            acc[cell.y].push(cell);
            return acc;
        }, []);
    }

    get #emptyCells() {
        return this.#cells.filter(cell => cell.tile == null)
    }

    randomEmptyCell() {
        const randomIndex = Math.floor(Math.random() * this.#emptyCells.length);
        return this.#emptyCells[randomIndex];
    }
}

class Cell {
    #cellElement
    #x
    #y
    #tile
    #mergeTile

    constructor(cellElement, x, y) {
        this.#cellElement = cellElement;
        this.#x = x;
        this.#y = y;
    }

    get tile() {
        return this.#tile;
    }

    get x() {
        return this.#x;
    }

    get y() {
        return this.#y;
    }

    get mergeTile() {
        return this.#mergeTile;
    }

    set mergeTile(value) {
        this.#mergeTile = value;
        if(value == null) return;
        this.#mergeTile.x = this.#x;
        this.#mergeTile.y = this.#y;
    }

    set tile(value) {
        this.#tile = value;
        if(value == null) return;
        this.#tile.x = this.#x;
        this.#tile.y = this.#y;
    }

    canAccept(tile) {
        return this.tile == null || (this.tile.value === tile.value && this.mergeTile == null);
    }

    mergeTiles() {
        if(this.tile == null || this.mergeTile == null) return;
        this.tile.value *= 2;
        this.mergeTile.remove();
        this.mergeTile = null;
    }

}

function createCellElements(gridElement) {
    const cells = []
    for(let i = 0; i < GRID_SIZE*GRID_SIZE; i++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        gridElement.appendChild(cell);
        cells.push(cell);
    }
    return cells;
}