//Regular board setup
let redPieces = BigInt.asUintN(64, 0b01010101_10101010_01010101_00000000_00000000_00000000_00000000_00000000n)
let blackPieces = BigInt.asUintN(64, 0b00000000_00000000_00000000_00000000_00000000_10101010_01010101_10101010n)
let redKings = BigInt.asUintN(64, 0b00000000_00000000_00000000_00000000_00000000_00000000_00000000_00000000n)
let blackKings = BigInt.asUintN(64, 0b00000000_00000000_00000000_00000000_00000000_00000000_00000000_00000000n)

//bitmask to see if normal move is wrapping around the board
let notLeftCol = BigInt.asUintN(64, 0b01111111_01111111_01111111_01111111_01111111_01111111_01111111_01111111n);
let notRightCol = BigInt.asUintN(64, 0b11111110_11111110_11111110_11111110_11111110_11111110_11111110_11111110n)

//bitmask to see if capture will wrap board on the side
let notLeftColCap = BigInt.asUintN(64, 0b00111111_00111111_00111111_00111111_00111111_00111111_00111111_00111111n) 
let notRightColCap = BigInt.asUintN(64, 0b11111100_11111100_11111100_11111100_11111100_11111100_11111100_11111100n)

//bitmasks for rows(used in eval function)
let row0 = BigInt.asUintN(64, 0b00000000_00000000_00000000_00000000_00000000_00000000_00000000_11111111n)
let row1 = BigInt.asUintN(64, 0b00000000_00000000_00000000_00000000_00000000_00000000_11111111_00000000n)
let row2 = BigInt.asUintN(64, 0b00000000_00000000_00000000_00000000_00000000_11111111_00000000_00000000n)
let row3 = BigInt.asUintN(64, 0b00000000_00000000_00000000_00000000_11111111_00000000_00000000_00000000n)
let row4 = BigInt.asUintN(64, 0b00000000_00000000_00000000_11111111_00000000_00000000_00000000_00000000n)
let row5 = BigInt.asUintN(64, 0b00000000_00000000_11111111_00000000_00000000_00000000_00000000_00000000n)
let row6 = BigInt.asUintN(64, 0b00000000_11111111_00000000_00000000_00000000_00000000_00000000_00000000n)
let row7 = BigInt.asUintN(64, 0b11111111_00000000_00000000_00000000_00000000_00000000_00000000_00000000n)

let playerTurn = true
let depth = 9
let playerPieces = document.querySelectorAll('span')
let selectedPiece = null //last clicked piece
let playerMoves = []
let perms = 0
let followupPiece = -1
let testV = 8
board = boardPreset1
//Hashing these with position to make whose turn it was
turns = new Array(2)
turns[0] = randomInt() //red turn hash
turns[1] = randomInt() //black turn hash
let ZobristTable = new Array(64)
const redTable = new Map() //zobrist key, {depth, alpha, beta, bestMove, } 
const blackTable = new Map() //zobrist key, {depth, alpha, beta, bestMove, }

updateFromArray()
//console.log(genMoves(redPieces, blackPieces, redKings, blackKings, 'r'))
updateHTML()
//console.log(genMoves(blackPieces, redPieces, blackKings, redKings, 'b'))
initTable()
computeHash(redPieces, blackPieces, redKings, blackKings)
/*
let x = computeHash(redPieces, blackPieces, redKings, blackKings, 'b')
console.log(x)
let y = randomInt()
x ^= y
console.log(x)
x ^= y
console.log(x)*/

function changedDepth(){
    if(document.getElementById('depth').value == 9){
		if(depth < 9){
			document.getElementById('roboText').innerHTML = 'I feel dumber now!'
		}
		else{
			document.getElementById('roboText').innerHTML = 'I feel smarter now!'
		}
		depth = 9
    }
    else if(document.getElementById('depth').value == 7){
        document.getElementById('roboText').innerHTML = 'I feel dumber now!'
		depth = 7
    }
	else if(document.getElementById('depth').value == 11){
        document.getElementById('roboText').innerHTML = 'I feel smarter now!'
		depth = 11
    }
}

function setEventListeners(){
    pieces = document.querySelectorAll('span')
    cells = document.querySelectorAll('td')
    for(let i = 0; i < cells.length; i++){
        //cells[i].addEventListener("click", clickCell)
        if(cells[i].innerHTML == '' || cells[i].innerHTML == `<p class="available-move"></p>`){
            cells[i].addEventListener("click", clickCell)
        }
        else{
            cells[i].removeEventListener('click', clickCell)
        }
    }
    for (let i = 0; i < pieces.length; i++) {
        pieces[i].addEventListener("click", clickPiece)
        //console.log(pieces[i])
    }
}

function removeEventListeners(){
    pieces = document.querySelectorAll('span')
    for (let i = 0; i < pieces.length; i++) {
        pieces[i].removeEventListener("click", clickPiece)
        //console.log(pieces[i])
    }
}

function clickPiece(e){
	let source = parseInt(e.srcElement.offsetParent.id)
	if(!playerTurn || followupPiece != -1 && followupPiece != source){
		return
	}
	resetSelected()
	//console.log(e.srcElement.offsetParent.id)
	e.target.style.border = "3px solid green";
	let moves = []
	let allPieces = blackPieces | redPieces | blackKings | redKings
	let allEnemy = redPieces | redKings
	//check for captures first
	if(blackPieces & (BigInt.asUintN(64, 1n) << BigInt(source))){
		checkPlayerJumps(source, allPieces, allEnemy, false, moves)
	}
	else if(blackKings & (BigInt.asUintN(64, 1n) << BigInt(source))){
		checkPlayerJumps(source, allPieces, allEnemy, true, moves)
	}
	if(moves.length == 0){ //if no captures then look for normal moves
		generatePossibleMoves(source, blackKings, 'b', allPieces, moves)
	}
	for(let move of moves){ //highlight moves
		document.getElementById(`${move.destination}`).innerHTML = `<p class="available-move"></p>`
		playerMoves.push(move.destination)
	}
	selectedPiece = source
}

//ALSO MAKE SURE TO CHECK FOR FORCED CAPTURE BEFORE ACCEPTING NON CAPTURE MOVES
//PLAYER JUMPS MUST BE HANDLED DIFFERENTLY, ONE JUMP AT A TIME
function clickCell(e){
	if(!playerTurn){
		return
	}
	let allPieces = blackPieces | redPieces | blackKings | redKings
	let allEnemy = redPieces | redKings
	let moves = []
	let id = parseInt(e.target.id)
	let madeMove = false
	let madeCapture = false
	let kingMove = false
	for(let i = 0; i < 64; i++){//iterate over player pieces and check forced jump 
		if(blackPieces & (BigInt.asUintN(64, 1n) << BigInt(i))){
			checkPlayerJumps(i, allPieces, allEnemy, false, moves)
		}
		else if(blackKings & (BigInt.asUintN(64, 1n) << BigInt(i))){
			checkPlayerJumps(i, allPieces, allEnemy, true, moves)
			kingMove = true
		}
	}
	if(moves.length > 0){//forced capture
		for(let move of moves){
			if(move.destination == id){
				madeMove = true
				if(blackPieces & (BigInt.asUintN(64, 1n) << BigInt(selectedPiece))){
					blackPieces = blackPieces ^ (BigInt.asUintN(64, 1n) << BigInt(selectedPiece))
					if(id >= 56){//promoted
						blackKings = blackKings | (BigInt.asUintN(64, 1n) << BigInt(id))
					}
					else{
						blackPieces = blackPieces | (BigInt.asUintN(64, 1n) << BigInt(id))
					}
					
				}
				else if(blackKings & (BigInt.asUintN(64, 1n) << BigInt(selectedPiece))){
					blackKings = blackKings ^ (BigInt.asUintN(64, 1n) << BigInt(selectedPiece))
					blackKings = blackKings | (BigInt.asUintN(64, 1n) << BigInt(id))
				}
				if(redKings & (BigInt.asUintN(64, 1n) << BigInt(move.captured))){
					redKings = redKings ^ (BigInt.asUintN(64, 1n) << BigInt(move.captured))
				}
				else if(redPieces & (BigInt.asUintN(64, 1n) << BigInt(move.captured))){
					redPieces = redPieces ^ (BigInt.asUintN(64, 1n) << BigInt(move.captured))
				}
				madeCapture = true
			}
		}
		if(!madeCapture){ //forced cap msg
			alert('Forced capture available')
			return
		}
	}
	else{ //no forced capture
		if(playerMoves.includes(id)){
			madeMove = true
			if(blackPieces & (BigInt.asUintN(64, 1n) << BigInt(selectedPiece))){
				blackPieces = blackPieces ^ (BigInt.asUintN(64, 1n) << BigInt(selectedPiece))
				if(id >= 56){//promoted
					blackKings = blackKings | (BigInt.asUintN(64, 1n) << BigInt(id))
				}
				else{
					blackPieces = blackPieces | (BigInt.asUintN(64, 1n) << BigInt(id))
				}
			}
			else if(blackKings & (BigInt.asUintN(64, 1n) << BigInt(selectedPiece))){
				blackKings = blackKings ^ (BigInt.asUintN(64, 1n) << BigInt(selectedPiece))
				blackKings = blackKings | (BigInt.asUintN(64, 1n) << BigInt(id))
			}
		}
	}
	if(!madeMove){
		return
	}
	allPieces = blackPieces | redPieces | blackKings | redKings
	allEnemy = redPieces | redKings
	let temp = []
	checkPlayerJumps(id, allPieces, allEnemy, kingMove, temp) //checking for followup captures
	if(madeCapture && temp.length > 0){ //has followup captures
		followupPiece = id
	}
	else{
		console.log('Ai moving...')
		document.getElementById('roboText').innerHTML = `Computing... Am i taking too long? Try reducing my depth`
		setTimeout(()=>{
			minimaxHelper()
		}, 61)
	}
	
	resetSelected()
	updateHTML()
	//check win ehre
}

//fills passed array with only single jumps, for user convinience players will do multi jumps one at a time for a single cell
function checkPlayerJumps(source, allPieces, enemyBoard, king, moves){
	leftCapMove = source + 18
	rightCapMove = source + 14
	backwardLeftCapMove = source -14
	backwardRightCapMove = source - 18
	leftCap = source + 9
	rightCap = source + 7
	backwardLeftCap = source - 7
	backwardRightCap = source - 9
	if(king){
		if(notLeftColCap & (BigInt.asUintN(64, 1n) << BigInt(source)) && enemyBoard & (BigInt.asUintN(64, 1n) << BigInt(backwardLeftCap)) && !isOccupied(backwardLeftCapMove, allPieces)  && capInBoundary(source, backwardLeftCapMove)){
			moves.push({destination: backwardLeftCapMove, captured: backwardLeftCap})
		}
		if(notRightColCap & (BigInt.asUintN(64, 1n) << BigInt(source)) && enemyBoard & (BigInt.asUintN(64, 1n) << BigInt(backwardRightCap)) && !isOccupied(backwardRightCapMove, allPieces)  && capInBoundary(source, backwardRightCapMove)){
			moves.push({destination: backwardRightCapMove, captured: backwardRightCap})
		}
	}
	if(notLeftColCap & (BigInt.asUintN(64, 1n) << BigInt(source)) && enemyBoard & (BigInt.asUintN(64, 1n) << BigInt(leftCap)) && !isOccupied(leftCapMove, allPieces) && capInBoundary(source, leftCapMove)){
		moves.push({destination: leftCapMove, captured: leftCap})
	}
	if(notRightColCap & (BigInt.asUintN(64, 1n) << BigInt(source)) && enemyBoard & (BigInt.asUintN(64, 1n) << BigInt(rightCap)) && !isOccupied(rightCapMove, allPieces) && capInBoundary(source, rightCapMove)){
		moves.push({destination: rightCapMove, captured: rightCap})
	}
	return moves
}

function resetSelected(){
	let playerPieces = document.querySelectorAll('span')
    for (let i = 0; i < playerPieces.length; i++) {
        playerPieces[i].style.border = "none";
    }
	for(let i = 0; i < 64; i++){
		if(document.getElementById(`${i}`).innerHTML == `<p class="available-move"></p>`){
			document.getElementById(`${i}`).innerHTML = ''
		}
	}
	selectedPiece = null
	playerMoves = []
}
/*
console.log(genMoves(redPieces, blackPieces, redKings, blackKings, 'r'))*/
//console.log(genMoves(blackPieces, redPieces, blackKings, redKings, 'b'))

//maybe change ids to cell number
function updateHTML(){
	for(let i = 0; i < 64; i++){
		if(redPieces & BigInt.asUintN(64, 1n) << BigInt(i)){
			document.getElementById(`${i}`).innerHTML = `<p class="red-piece"></p>`
		}
		else if(redKings & BigInt.asUintN(64, 1n) << BigInt(i)){
			document.getElementById(`${i}`).innerHTML = `<p class="red-piece king"></p>`
		}
		else if(blackPieces & BigInt.asUintN(64, 1n) << BigInt(i)){
			document.getElementById(`${i}`).innerHTML = `<span class="black-piece"></span>`
		}
		else if(blackKings & BigInt.asUintN(64, 1n) << BigInt(i)){
			document.getElementById(`${i}`).innerHTML = `<span class="black-piece king"></span>`
		}
		else{
			document.getElementById(`${i}`).innerHTML = ''
		}
	}
	setEventListeners()
}
