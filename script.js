// Bloated Javascript File let's gooooo

import Grid from "./Grid.js";
import Tile from "./Tile.js";

import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js'
import { getFirestore, collection, getDocs, addDoc } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js'

const gameBoard = document.getElementById("game-board");
const scoreDisplay = document.getElementById("score-amount");
const bestDisplay = document.getElementById("best-amount");
const endScreen = document.getElementById("end-screen");
const newGameButton = document.getElementById("new-game-button");
const curScoreDisplay = document.getElementById("cur-score-display");
const leaderboardParent = document.getElementById("leaderboard");
const dailyLeaderboard = document.getElementById("daily-leaderboard");

var score = 0;

var lowestLb = 1000000;
var lowestAll = 1000000;

var grid = new Grid(gameBoard);

grid.randomEmptyCell().tile = new Tile(gameBoard);
grid.randomEmptyCell().tile = new Tile(gameBoard);

setupInput();
setupSwipeInput();
gameBoard.addEventListener("touchmove", function(e) {
    e.preventDefault();
})

//Sleep function
async function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

//Remove the normal functionality of the 4 direction keys
window.addEventListener("keydown", function(e) {
    if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {
        e.preventDefault();
    }
}, false);

// Can't use env variables so I guess there's this. I'm just trusting y'all.

const firebaseConfig = {

    apiKey: atob("QUl6YVN5REVETUNpTFg5MVpJaG9FY1RrNTRQMFQ2SkJRNThwbkQ4"),
  
    authDomain: "blair-2048.firebaseapp.com",
  
    projectId: "blair-2048",
  
    storageBucket: "blair-2048.appspot.com",
  
    messagingSenderId: "349584625072",
  
    appId: "1:349584625072:web:d11b42354733ff07bc9a75",
  
    measurementId: "G-DSGFTT4F7T"
  
};  

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const scoresCollectionRef = collection(firestore, "leaderboard-data");
const dailyCollectionRef = collection(firestore, "daily-leaderboard");

const getAllData = async () => {
    const allRawdata = await getDocs(scoresCollectionRef);
    const dailyRawData = await getDocs(dailyCollectionRef);

    var allData = allRawdata.docs.map((doc) => ({ name: doc.data().name, score: doc.data().score }));
    var dailyData = dailyRawData.docs.map((doc) => ({ name: doc.data().name, score: doc.data().score }));

    allData.sort((a, b) => b.score - a.score);
    dailyData.sort((a, b) => b.score - a.score);

    if(allData.length > 10) {
        allData = allData.slice(0, 10);
    }

    if(dailyData.length > 10) {
        dailyData = dailyData.slice(0, 10);
    }

    if(dailyData.length > 0) {

        lowestLb = dailyData[dailyData.length - 1].score;

    } else {
        lowestLb = 0;
    }

    lowestAll = allData[allData.length - 1].score;

    leaderboardParent.innerHTML = "";

    allData.forEach((entry) => {
        var leaderBoardEntry = document.createElement("div");
        leaderBoardEntry.classList.add("leaderboard-entry");
        leaderBoardEntry.innerText = `${entry.name} - ${entry.score}`;
        leaderboardParent.appendChild(leaderBoardEntry);
    })

    dailyLeaderboard.innerHTML = "";

    dailyData.forEach((entry) => {
        var leaderBoardEntry = document.createElement("div");
        leaderBoardEntry.classList.add("leaderboard-entry");
        leaderBoardEntry.innerText = `${entry.name} - ${entry.score}`;
        dailyLeaderboard.appendChild(leaderBoardEntry);
    })

}

getAllData();

document.getElementById("refresh-button").addEventListener("click", () => {
    getAllData();
})

function setupInput() {
    updateScore();
    window.addEventListener("keydown", handleInput, {once: true});
}

async function handleInput(e) {
    switch(e.key) {
        case "ArrowUp":
            if(!canMove("up")) {
                setupInput();
                return;
            }
            await moveUp()
            break
        case "ArrowDown":
            if(!canMove("down")) {
                setupInput();
                return;
            }
            await moveDown()
            break
        case "ArrowLeft":
            if(!canMove("left")) {
                setupInput();
                return;
            }
            await moveLeft()
            break
        case "ArrowRight":
            if(!canMove("right")) {
                setupInput();
                return
            }
            await moveRight()
            break
        case "w":
            if(!canMove("up")) {
                setupInput();
                return;
            }
            await moveUp()
            break
        case "s":
            if(!canMove("down")) {
                setupInput();
                return;
            }
            await moveDown()
            break
        case "a":
            if(!canMove("left")) {
                setupInput();
                return;
            }
            await moveLeft()
            break
        case "d":
            if(!canMove("right")) {
                setupInput();
                return
            }
            await moveRight()
            break
        case "r":
            newGame();
            return;
        default:
            setupInput();
            return
    }

    grid.cells.forEach(cell => cell.mergeTiles());

    const newTile = new Tile(gameBoard);
    grid.randomEmptyCell().tile = newTile;

    if(!canMove("up") && !canMove("down") && !canMove("left") && !canMove("right")) {
        newTile.waitForTransition(true).then(() => {
            deathHandle();
        })
        return;
    }

    setupInput()

}

async function deathHandle() {
    timeout(500).then(() => {
        endScreen.style.display = "flex";
        
        var endScreenText = endScreen.children;

        for(let i = 0; i < endScreenText.length; i++) {
            endScreenText[i].style.display = "block";
        }

        if(score > lowestLb) {
            var newName = prompt("You made the leaderboard! What's your name?");

            while(newName.length > 30) {
                newName = prompt("That's too long! Try again.");
            }

            newDoc(newName, score);
            document.getElementById("leaderboards-text").scrollIntoView();
            
            timeout(500).then(() => getAllData())

        }

    })
}

function setupSwipeInput() {
    updateScore();
    gameBoard.addEventListener('swiped', handleSwipe, {once: true});
}

async function handleSwipe(e) {
    var swipeNode = e.target;
    e.preventDefault();
    switch(e.detail.dir) {
        case "up":
            if(!canMove("up")) {
                setupSwipeInput();
                return;
            }
            await moveUp()
            break
        case "down":
            if(!canMove("down")) {
                setupSwipeInput();
                return;
            }
            await moveDown()
            break
        case "left":
            if(!canMove("left")) {
                setupSwipeInput();
                return;
            }
            await moveLeft()
            break
        case "right":
            if(!canMove("right")) {
                setupSwipeInput();
                return
            }
            await moveRight()
            break
        default:
            setupSwipeInput();
            return
    }

    grid.cells.forEach(cell => cell.mergeTiles());

    const newTile = new Tile(gameBoard);
    grid.randomEmptyCell().tile = newTile;

    if(!canMove("up") && !canMove("down") && !canMove("left") && !canMove("right")) {
        newTile.waitForTransition(true).then(() => {
            deathHandle();
        })
        return;
    }

    setupSwipeInput();


}

const newDoc = async (name, score) => {
    if(score >= lowestAll) await addDoc(scoresCollectionRef, { name: name, score: score });
    await addDoc(dailyCollectionRef, { name: name, score: score });
}

const newGame = () => {
    (Array.from(gameBoard.children)).forEach((child) => {
        if(child.id != "end-screen") {
            child.remove();
        }
    })
    grid = new Grid(gameBoard);
    grid.randomEmptyCell().tile = new Tile(gameBoard);
    grid.randomEmptyCell().tile = new Tile(gameBoard);
    endScreen.style.display = "none";
    setupInput();
    setupSwipeInput();
}

newGameButton.addEventListener("click", () => {
    newGame();
})

function moveUp() {
    return slideTiles(grid.cellsByColumn)
}

function moveDown() {
    return slideTiles(grid.cellsByColumn.map(column => [...column].reverse()))
}

function moveLeft() {
    return slideTiles(grid.cellsByRow)
}

function moveRight() {
    return slideTiles(grid.cellsByRow.map(row => [...row].reverse()))
}

function slideTiles(cells) {
    return Promise.all(
    cells.flatMap(column => {
        const promises = [];
        for(let i = 1; i < column.length; i++) {
            const cell = column[i];
            if(cell.tile == null) continue;
            let lastValidTile;
            for(let j = i - 1; j >= 0; j--) {
                const moveToCell = column[j];
                if(!moveToCell.canAccept(cell.tile)) break;

                lastValidTile = moveToCell;
            }
            if(lastValidTile != null) {
                promises.push(cell.tile.waitForTransition());
                if(lastValidTile.tile != null) {
                    lastValidTile.mergeTile = cell.tile;
                } else {
                    lastValidTile.tile = cell.tile;
                }
                cell.tile = null;
            }
        }   
        return promises;
    }))
}

function canMove(direction) {
    switch(direction) {
        case "up":
            return canMoveCells(grid.cellsByColumn);
        case "down":
            return canMoveCells(grid.cellsByColumn.map(column => [...column].reverse()));
        case "left":
            return canMoveCells(grid.cellsByRow);
        case "right":
            return canMoveCells(grid.cellsByRow.map(row => [...row].reverse()));
    }
}

function canMoveCells(cells) {
    return cells.some(group => {
        return group.some((cell, index) => {
            if(index === 0) return false;
            if (cell.tile == null) return false;
            const moveToCell = group[index - 1]
            return moveToCell.canAccept(cell.tile);
        })
    })
}

function updateScore() {
    var newScore = 0;
    grid.cells.forEach(cell => {
        if(cell.tile != null) {
            newScore += cell.tile.value;
        }
    })

    scoreDisplay.innerText = newScore;
    if(newScore > parseInt(bestDisplay.innerText)) {
        bestDisplay.innerText = newScore;
        document.cookie = `best=${newScore};Secure;expires=Fri, 31 Dec 9999 23:59:59 GMT`;
    }

    var scoreChange = newScore - score;

    if(scoreChange > 0) {
        var scoreChangeText = document.createElement("h1");
        scoreChangeText.innerText = `+${scoreChange}`;
        scoreChangeText.classList.add("score-add");
        curScoreDisplay.appendChild(scoreChangeText);

        scoreChangeText.onanimationend = () => {
            scoreChangeText.remove();
        }
    }

    score = newScore;

}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }

bestDisplay.innerText = getCookie("best") || 0;
