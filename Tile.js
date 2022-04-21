export default class Tile {
    #tileElement
    #imageElement
    #x
    #y
    #value

    constructor(tileContainer, value = Math.random() > 0.9 ? 4 : 2) {
        this.#tileElement = document.createElement("div");
        this.#tileElement.classList.add("tile");
        tileContainer.appendChild(this.#tileElement);
        this.#imageElement = document.createElement("img");
        this.#imageElement.src = `./images/${value}.jpg`;
        this.#imageElement.alt = value;
        this.#tileElement.appendChild(this.#imageElement);
        this.value = value;
    }

    get value() {
        return this.#value;
    }

    set value(v) {
        this.#value = v;
        this.#imageElement.src = `./images/${v}.jpg`;
        this.#imageElement.alt = v;
    }

    set x(value) {
        this.#x = value;
        this.#tileElement.style.setProperty("--x", value);
    }

    set y(value) {
        this.#y = value;
        this.#tileElement.style.setProperty("--y", value);
    }

    remove() {
        this.#tileElement.remove();
    }

    waitForTransition(animation = false) {
        return new Promise(resolve => {
            this.#tileElement.addEventListener(animation ? "animationend": "transitionend", resolve, {
                once: true,
            });
        })
    }

}