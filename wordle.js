
var height = 6; 
var width = 5; 

var row = 0; 
var col = 0; 

var gameOver = false;
var NameMap = new Map();
var modal;
var nameInput;
var animalsList = ["лось","лисса","волк","заяц","конь",];
var eatList = ["пицца","суши","лук", "груша", "рис", "сыр"];
var Namelist;

var word;

window.onload = function(){
    word = animalsList[Math.floor(Math.random()*animalsList.length)].toUpperCase();
    console.log(word);
    intialize();
}

function handleCategoryChange() {
    var category = document.getElementById("category").value;

    var resultElement = document.getElementById("result");

    if (category === "animals") {
        word = animalsList[Math.floor(Math.random()*animalsList.length)].toUpperCase();
        console.log(word);
        var element = document.getElementById("board");
        element.innerHTML = "";
        var element1 = document.getElementById("keyboarall");
        element1.remove();
        var element = document.getElementById("answer");
        element.innerHTML = "";
        var list = document.getElementById("map-items");
        while (list.firstChild) {
        list.removeChild(list.firstChild);
        }
        intialize();
        gameOver = false;
        row = 0; 
        col = 0; 
    }  
    else if (category === "food") {
        word = eatList[Math.floor(Math.random()*eatList.length)].toUpperCase();
        console.log(word);
        var element = document.getElementById("board");
        element.innerHTML = "";
        var element1 = document.getElementById("keyboarall");
        element1.remove();
        var element = document.getElementById("answer");
        element.innerHTML = "";
        var list = document.getElementById("map-items");
        while (list.firstChild) {
        list.removeChild(list.firstChild);
        }
        intialize();
        gameOver = false;
    row = 0; 
    col = 0; 
    }
}

function LukLocal(){
let keys=Object.keys(localStorage);
for(let key of keys){
    NameMap.set(key,localStorage.getItem(key))
}
var mapItems = document.getElementById("map-items");
for (let [key, value] of NameMap) {
    var listItem = document.createElement("li");
    listItem.innerHTML = key + ": " + value;
    mapItems.appendChild(listItem);
}
}

function intialize() {
    LukLocal()

    for (let r = 0; r < height; r++) {
        for (let c = 0; c < width; c++) {
            let tile = document.createElement("span");
            tile.id = r.toString() + "-" + c.toString();
            tile.classList.add("tile");
            tile.innerText = "";
            document.getElementById("board").appendChild(tile);
        }
    }

    // let keyboard = [
    //     ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    //     ["A", "S", "D", "F", "G", "H", "J", "K", "L", " "],
    //     ["Enter", "Z", "X", "C", "V", "B", "N", "M", "⌫" ]
    // ]

    let keyboard = [
        ["Й", "Ц", "У", "К", "Е", "Н", "Г", "Ш", "Щ", "З", "Х", "Ъ"],
        ["Ф", "Ы", "В", "А", "П", "Р", "О", "Л", "Д", "Ж", "Э","",],
        ["Enter", "Я", "Ч", "С", "М", "И", "Т", "Ь", "Б", "Ю","⌫" ]
    ]

    let keyboarall = document.createElement("div");
    keyboarall.id="keyboarall";
    for (let i = 0; i < keyboard.length; i++) {
        let currRow = keyboard[i];
        let keyboardRow = document.createElement("div");
        keyboardRow.classList.add("keyboard-row");

        for (let j = 0; j < currRow.length; j++) {
            let keyTile = document.createElement("div");

            let key = currRow[j];
            keyTile.innerText = key;
            if (key == "Enter") {
                keyTile.id = "Enter";
            }
            else if (key == "⌫") {
                keyTile.id = "Backspace";
            }
            else if ("А" <= key && key <= "Я") {
                keyTile.id = "Key" + key; 
            } 

            keyTile.addEventListener("click", processKey);

            if (key == "Enter") {
                keyTile.classList.add("enter-key-tile");
            } else {
                keyTile.classList.add("key-tile");
            }
            keyboardRow.appendChild(keyTile);
        }
        keyboarall.appendChild(keyboardRow);
    }
    if(modal==undefined){
        modal = document.getElementById("myModal");
        nameInput = document.getElementById("nameInput");
        modal.style.display = "block";
    }
    document.body.appendChild(keyboarall);
}

function addrezult(){
    var username=document.getElementById("username").innerText;
    var countet = Number(localStorage.getItem(username));
    countet++;
    localStorage.setItem(username, countet);
}


function saveName() {
    var name = nameInput.value;
    console.log("Имя: " + name);
    var username=document.getElementById("username");
    var savedName = localStorage.getItem(name);
    if (!savedName) {
        console.log("Сохраненное имя: " + savedName);
        username.innerHTML=name;
        localStorage.setItem(name, '0');
        modal.style.display = "none";
        document.addEventListener("keyup", (e) => {
            processInput(e);
        })
    }
    else{
        alert("Такое име существует");
    }
}

function processKey() {
    e = { "code" : this.id };
    processInput(e);
}

function processInput(e) {
    if (gameOver) return; 

    if ("KeyА" <= e.code && e.code <= "KeyЯ") {
        if (col < width) {
            let currTile = document.getElementById(row.toString() + '-' + col.toString());
            if (currTile.innerText == "") {
                currTile.innerText = e.code[3];
                col += 1;
            }
        }
    }
    else if (e.code == "Backspace") {
        if (0 < col && col <= width) {
            col -=1;
        }
        let currTile = document.getElementById(row.toString() + '-' + col.toString());
        currTile.innerText = "";
    }

    else if (e.code == "Enter") {
        if(col!=0){
            update();
        }
    }

    if (!gameOver && row == height) {
        gameOver = true;
        document.getElementById("answer").innerText = "Загадонное слово : "+ word+"\n Выберите категорию" ;
    }
}

function update() { //проверка угаданости слова и обновление состояния 
    let guess = "";
    document.getElementById("answer").innerText = "";

    for (let c = 0; c < width; c++) {
        let currTile = document.getElementById(row.toString() + '-' + c.toString());
        let letter = currTile.innerText;
        guess += letter;
    }

    guess = guess.toLowerCase();
    console.log(guess);
    if (category === "animals") {
        if (!animalsList.includes(guess)) {
            document.getElementById("answer").innerText = "Not in word list";
            return;
        }
    }  
    else if (category === "food") {
        if (!eatList.includes(guess)) {
            document.getElementById("answer").innerText = "Not in word list";
            return;
        }
    }

    
    let correct = 0; // проверка угаданых букв

    let letterCount = {}; 
    for (let i = 0; i < word.length; i++) {
        let letter = word[i];

        if (letterCount[letter]) {
           letterCount[letter] += 1;
        } 
        else {
           letterCount[letter] = 1;
        }
    }

    console.log(letterCount);

    for (let c = 0; c < col; c++) {
        let currTile = document.getElementById(row.toString() + '-' + c.toString());
        let letter = currTile.innerText;

        if (word[c] == letter) {
            currTile.classList.add("correct");

            let keyTile = document.getElementById("Key" + letter);
            keyTile.classList.remove("present");
            keyTile.classList.add("correct");

            correct += 1;
            letterCount[letter] -= 1; 
        }

        if (correct == col&& col!=0) {
            gameOver = true;
            addrezult();
            document.getElementById("answer").innerText = "Вы угадали слово "+ word+"\n Выберите категорию" ;
        }
    }

    console.log(letterCount);//тута
    for (let c = 0; c < col; c++) {
        let currTile = document.getElementById(row.toString() + '-' + c.toString());
        let letter = currTile.innerText;


        if (!currTile.classList.contains("correct")) {

            if (word.includes(letter) && letterCount[letter] > 0) { //примерно подходит
                currTile.classList.add("present");
                
                let keyTile = document.getElementById("Key" + letter);
                if (!keyTile.classList.contains("correct")) {
                    keyTile.classList.add("present");
                }
                letterCount[letter] -= 1;
            } 
            else {
                currTile.classList.add("absent");
                let keyTile = document.getElementById("Key" + letter); //отсутствует 
                keyTile.classList.add("absent")
            }
        }
    }

    row += 1; 
    col = 0; 
}