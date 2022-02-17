
const deckCards = ["15964.jpg", "15964.jpg", "bat.png", "bat.png", "death.png", "death.png", "bones.jpg", "bones.jpg", "pumpkin-14.webp", "pumpkin-14.webp", "11052.jpg", "11052.jpg"];


// Ánh xạ biến từ html
const deck = document.querySelector(".deck");
const imgModel = document.querySelector(".modal-img")
let opened = [];
let matched = [];
const endGame = document.querySelector(".end-game");
const endTitle = document.querySelector(".end-title");
const modal = document.getElementById("modal");
const reset = document.querySelector(".reset-btn");
const playAgain = document.querySelector(".play-again-btn");
const movesCount = document.querySelector(".moves-counter");
let moves = 0
const timeCounter = document.querySelector(".timer");
let time;
let isWin = true;
let maxTime = 119;
let minutes = 1;
let seconds = 60;
let timeStart = false;

// Hàm xáo trộn mảng
function shuffle(array) {
  let currentIndex = array.length, temporaryValue, randomIndex;

  while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
  }
  return array;
}


// Hàm chuyển đổi giây thành phút và giây
function secondsToHms(d) {
    d = Number(d);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);
 
    var mDisplay = m > 0 ? m + (m == 1 ? " Mins, " : " Mins, ") : "";
    var sDisplay = s > 0 ? s + (s == 1 ? " Secs" : " Secs") : "";
    return  mDisplay + sDisplay; 
}

// Hàm render toàn bộ thẻ
function startGame() {

	const shuffledDeck = shuffle(deckCards); 

    let tagStr = "";
    for (let i = 0; i < shuffledDeck.length; i++) {
        tagStr += `
            <li class="card"><img src="./images/${shuffledDeck[i]}" alt="image of vault boy from fallout"></li>
        `
    }
    deck.innerHTML = tagStr
	console.log('Check',deck.firstChild);
}


startGame();



function removeCard() {
	while (deck.hasChildNodes()) {
		deck.removeChild(deck.firstChild);
	}
}

// Đếm ngược thời gian
function timer() {
	time = setInterval(function() {
		
			if(maxTime === 0){
				isWin = false;
				winGame();
			}
			else if (seconds === 0 && maxTime > 0) {
				minutes--;
				seconds = 59;
			}else{
				seconds--;
				maxTime--;
			}
		timeCounter.innerHTML = " Timer: " + minutes + " Mins " + seconds + " Secs" ;
	}, 1000);
}


function stopTime() {
	
	maxTime = 119;
	clearInterval(time);
}



function resetEverything() {
	// Stop time, reset the minutes and seconds update the time inner HTML
	document.body.style.pointerEvents = "auto";
	stopTime();
	timeStart = false;
	seconds = 60;
	maxTime = 119;
	minutes = 1;
	timeCounter.innerHTML =  " Timer: 2 Mins  0 Secs";
	starCount = 3;
	moves = 0;
	movesCount.innerHTML = 0;
	matched = [];
	opened = [];
	removeCard();
	startGame();
}


// Tăng số lật thẻ
function movesCounter() {
	movesCount.innerHTML ++;
	moves ++;
}



// So sánh 2 thẻ vừa lật
function compareTwo() {
	if (opened.length === 2) {
  		document.body.style.pointerEvents = "none";
  }
	if (opened.length === 2 && opened[0].src === opened[1].src) {
		match();
	} else if (opened.length === 2 && opened[0].src != opened[1].src) {
		noMatch();
	}
}

// Hàm xử lí nếu 2 thẻ match nhau
function match() {
	setTimeout(function() {
		opened[0].parentElement.classList.add("match");
		opened[1].parentElement.classList.add("match");
		matched.push(...opened);
		document.body.style.pointerEvents = "auto";
		if(matched.length === deckCards.length){
			isWin = true;
			winGame();
		}
		
		opened = [];
	}, 600);
	movesCounter();
}

// Hàm xử lí nếu 2 thẻ không match nhau
function noMatch() {

	setTimeout(function() {
		opened[0].parentElement.classList.remove("flip");
		opened[1].parentElement.classList.remove("flip");
		document.body.style.pointerEvents = "auto";
		opened = [];
	}, 700);
	movesCounter();
}


// Thêm toàn bộ thông số lên model
function AddStats() {
	const stats = document.querySelector(".modal-content");
	for (let i = 1; i <= 3; i++) {
		const statsElement = document.createElement("p");
		statsElement.classList.add("stats");
		stats.appendChild(statsElement);
	}
	let p = stats.querySelectorAll("p.stats");
		p[0].innerHTML = "Time: " +  secondsToHms((119 - Number(maxTime)))
		p[1].innerHTML = "Moves Taken: " + moves;
}

// Hàm hiển thị model
function displayModal() {
const modalClose = document.getElementsByClassName("close")[0];
	modal.style.display= "block";
	if(isWin){
		endGame.innerHTML = 'Congratulations!'
		endTitle.innerHTML = 'You have won the game and found all pairs of cards.'
		imgModel.src = "./images/Success.jpg"
	}else{
		endGame.innerHTML = 'Game over!'
		endTitle.innerHTML = 'You have not won the game and found all pairs of cards.'
		imgModel.src = "./images/game-over.jpg"
	}
	
	modalClose.onclick = function() {
		modal.style.display = "none";
	};
	window.onclick = function(event) {
		if (event.target == modal) {
			modal.style.display = "none";
		}
	};
}


function winGame() {
	AddStats();
	stopTime();
	displayModal();
}


// Hàm lắng nghe sự kiện chính khi mở các thẻ
deck.addEventListener("click", function(evt) {
	if (evt.target.nodeName === "LI") {
		if (timeStart === false) {
			timeStart = true; 
			timer();
		}
		flipCard();
	}

	function flipCard() {
		evt.target.classList.add("flip");
		addToOpened();
	}
	 
	function addToOpened() {

		if (opened.length === 0 || opened.length === 1) {
			opened.push(evt.target.firstElementChild);
		}
		compareTwo();
	}
});

// Restart Buttons

reset.addEventListener('click', resetEverything);

// Play again button
playAgain.addEventListener('click',function() {
	modal.style.display = "none";
	resetEverything();
});




