const tileDisplay = document.querySelector(".tile-container");
const keyboard = document.querySelector(".keyboard-container");
const messageDisplay = document.querySelector(".message-container");

let wordle;

const getWordle = () => {
  fetch("http://localhost:8000/word")
    .then((res) => res.json())
    .then((json) => {
      console.log(json);
      wordle = json.toUpperCase();
    })
    .catch((err) => console.log("error is", err.message));
};
getWordle();

const keys = [
  "Q",
  "W",
  "E",
  "R",
  "T",
  "Y",
  "U",
  "I",
  "O",
  "P",
  "A",
  "S",
  "D",
  "F",
  "G",
  "H",
  "J",
  "K",
  "L",
  "ENTER",
  "Z",
  "X",
  "C",
  "V",
  "B",
  "N",
  "M",
  "←",
];

const guessRows = [
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
];
let currentRow = 0;
let currentTile = 0;
let isGameover = false;

guessRows.forEach((Guessrow, guessRowIndex) => {
  const guessRowElement = document.createElement("div");
  guessRowElement.setAttribute("id", "guessRow-" + guessRowIndex);
  Guessrow.forEach((guessTile, guessTileIndex) => {
    const tileElement = document.createElement("div");
    tileElement.setAttribute(
      "id",
      "guessRow-" + guessRowIndex + "-tile-" + guessTileIndex
    );
    tileElement.classList.add("tile");
    guessRowElement.append(tileElement);
  });
  tileDisplay.append(guessRowElement);
});

keys.forEach((key) => {
  const keyElements = document.createElement("button");
  keyElements.textContent = key;
  keyElements.setAttribute("id", key);
  keyElements.addEventListener("click", () => handleCLick(key));
  keyboard.append(keyElements);
});

const handleCLick = (key) => {
  if (!isGameover) {
    if (key === "←") {
      console.log(guessRows);
      deleteLetter();
      return;
    }
    if (key === "ENTER") {
      console.log(guessRows);
      console.log("word is entered");
      checkrow();
      return;
    }
    addLetter(key);
  }
};

const addLetter = (letter) => {
  if (currentTile < 5 && currentRow < 6) {
    const tile = document.getElementById(
      "guessRow-" + currentRow + "-tile-" + currentTile
    );
    guessRows[currentRow][currentTile] = letter;
    tile.innerText = letter;
    tile.setAttribute("data", letter);
    currentTile++;
  }
};

const deleteLetter = () => {
  if (currentTile > 0) {
    currentTile--;
    const tile = document.getElementById(
      "guessRow-" + currentRow + "-tile-" + currentTile
    );
    tile.innerText = "";
    guessRows[currentRow][currentTile] = "";
    tile.setAttribute("data", "");
  }
};

const checkrow = () => {
  const guess = guessRows[currentRow].join("");
  console.log(guess);
  if (currentTile > 4) {
    fetch(`http://localhost:8000/check/?word=${guess}`)
      .then((res) => res.json())
      .then((json) => {
        console.log("word entered", json);
        if (json == "Entry word not found") {
          showMessage("word is not in the list");
          return;
        } else {
          fliptile();
          if (wordle === guess) {
            showMessage("You guessed it 🎉🎉");
            isGameover = true;

            return;
          } else {
            if (currentRow >= 5) {
              isGameover = true;
              showMessage("Game over");
              return;
            }
            if (currentRow < 5) {
              currentRow++;
              currentTile = 0;
            }
          }
        }
      })
      .catch((error) => console.log(error));

    console.log("guess is:", guess, "word is", wordle);
  }
};

const showMessage = (message) => {
  const messageElement = document.createElement("p");
  messageElement.textContent = message;
  messageDisplay.append(messageElement);
  setTimeout(() => messageDisplay.removeChild(messageElement), 2000);
};

const addColortoKey = (keysLetter, color) => {
  const key = document.getElementById(keysLetter);
  key.classList.add(color);
};

const fliptile = () => {
  const rowTiles = document.getElementById("guessRow-" + currentRow).childNodes;
  const guess = [];
  let checkWordle = wordle;

  rowTiles.forEach((tile) => {
    guess.push({ letter: tile.getAttribute("data"), color: "gray-overlay" });
  });

  guess.forEach((guess, index) => {
    if (guess.letter == wordle[index]) {
      guess.color = "green-overlay";
      checkWordle = checkWordle.replace(guess.letter, "");
    }
  });

  guess.forEach((guess) => {
    if (checkWordle.includes(guess.letter)) {
      guess.color = "yellow-overlay";
      checkWordle = checkWordle.replace(guess.letter, "");
    }
  });

  rowTiles.forEach((tile, index) => {
    setTimeout(() => {
      tile.classList.add("flip");
      tile.classList.add(guess[index].color);
      addColortoKey(guess[index].letter, guess[index].color);
    }, 500 * index);
  });
};
