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

//0 is empty, 1 is red piece, 2 is black piece, 11 is promoted red, 12 is promoted black
/*
//empty board
let board = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0]
]*/

//standard board setup
let board = [
    [0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [2, 0, 2, 0, 2, 0, 2, 0],
    [0, 2, 0, 2, 0, 2, 0, 2],
    [2, 0, 2, 0, 2, 0, 2, 0]
]

//check player double jumps
/*
let board = [
    [0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 0, 0],
    [0, 1, 0, 0, 0, 1, 0, 1],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 0, 0, 0, 0],
    [2, 0, 2, 0, 2, 0, 2, 0],
    [0, 2, 0, 2, 0, 2, 0, 2],
    [2, 0, 2, 0, 2, 0, 2, 0]
]*/
/*
let board = [
    [0, 0, 0, 0, 0, 0, 0, 1],
    [0, 0, 0, 0, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 2, 0, 0, 0],
    [0, 11, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 11, 0]
]*/
//check promotion, also 1v1 endgame
/*
let board = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 2, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [11, 0, 0, 0, 0, 0, 0, 0]
]*/

/*
let board = [
    [0, 0, 0, 0, 0, 0, 0, 12],
    [0, 0, 2, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 2, 0, 0, 0, 0, 0],
    [0, 2, 0, 11, 0, 0, 0, 0],
    [11, 0, 11, 0, 0, 0, 0, 0]
]*/
/*
//check player win
let board = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 0, 0, 0],
    [0, 0, 0, 2, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0]
]*/

/*
//bitmask to stop pieces to stop pieces from leaving top of board(and check for promotion)
let notTopRow = BigInt.asUintN(64, 0b11111111_00000000_00000000_00000000_00000000_00000000_00000000_00000000n)

//bitmask to stop pieces to stop pieces from leaving bottom of board(and check for promotion)
let notBottomRow = BigInt.asUintN(64, 0b00000000_00000000_00000000_00000000_00000000_00000000_00000000_11111111n)

//bitmask to see if capture will wrap board on top
let notTopRowCap = BigInt.asUintN(64, 0b11111111_11111111_00000000_00000000_00000000_00000000_00000000_00000000n)

//bitmask to see if captur will wrap board on bottom
let notBottomRowCap = BigInt.asUintN(64, 0b00000000_00000000_00000000_00000000_00000000_00000000_11111111_11111111n)*/

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
let depth = 11
let playerPieces = document.querySelectorAll('span')
let selectedPiece = null //last clicked piece
let playerMoves = []
let perms = 0
let followupPiece = -1

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
		moves = generatePossibleMoves(source, blackKings, 'b', allPieces)
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
	removeEventListeners()
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

function trailingZeros(bitboard) {
	let index = 0;
	while (bitboard % BigInt.asUintN(64, 2n) !== BigInt.asUintN(64, 1n)) {
		bitboard = bitboard >> BigInt.asUintN(64, 1n);
		index++;
	}
	return index;
}

function minimaxHelper(){
	playerTurn = false
	let bestValue = -200000
	perms = 0
	let moves = []
	moves = genMoves(redPieces, blackPieces, redKings, blackKings, 'r')
	if(moves.length == 0){
		console.log('Player Won')
		document.getElementById('roboText').innerHTML = 'Good Game! You got me! Please give me feedback on how to improve'
		return
	}
	let bestRed = BigInt.asUintN(64, 0n)
	let bestRedK = BigInt.asUintN(64, 0n)
	let bestBlack = BigInt.asUintN(64, 0n)
	let bestBlackK = BigInt.asUintN(64, 0n)
	//console.log(moves)
	for(let move of moves){
		let newBlackP = blackPieces
		let newRedP = redPieces
		let newBlackK = blackKings
		let newRedK = redKings
		if(move.capture.length > 0){ //if captures in current move then update black boards before minimax
			for(let cap of move.capture){
				if(newBlackP & (BigInt.asUintN(64, 1n) << BigInt(cap))){
					newBlackP = newBlackP ^ (BigInt.asUintN(64, 1n) << BigInt(cap))
				}
				else if(newBlackK & (BigInt.asUintN(64, 1n) << BigInt(cap))){
					newBlackK = newBlackK ^ (BigInt.asUintN(64, 1n) << BigInt(cap))
				}
			}
		}
		//update red (ai) boards
		if(newRedP & (BigInt.asUintN(64, 1n) << BigInt(move.source))){
			newRedP = newRedP ^ (BigInt.asUintN(64, 1n) << BigInt(move.source))
			if(move.destination <= 7){ //check if promoting move
				newRedK = newRedK | (BigInt.asUintN(64, 1n) << BigInt(move.destination))
			}
			else{
				newRedP = newRedP | (BigInt.asUintN(64, 1n) << BigInt(move.destination))
			}
		}
		else if(newRedK & (BigInt.asUintN(64, 1n) << BigInt(move.source))){
			newRedK = newRedK ^ (BigInt.asUintN(64, 1n) << BigInt(move.source))
			newRedK = newRedK | (BigInt.asUintN(64, 1n) << BigInt(move.destination))
		}
		let currVal = minimax(newRedP, newBlackP, newRedK, newBlackK, depth, -200000, 200000, false)
		if(currVal > bestValue){
			bestValue = currVal
			bestRed = newRedP
			bestRedK = newRedK
			bestBlack = newBlackP
			bestBlackK = newBlackK
		}
	}
	console.log(`Eval: ${bestValue}`)
	//DOWN HERE UPDATE BITBOARDS AND HTML TO BE NEXT MOVE
	redPieces = bestRed
	redKings = bestRedK
	blackPieces = bestBlack
	blackKings = bestBlackK
	playerTurn = true
	followupPiece = -1
	console.log(`Permuatations: ${perms}`)
	if(genMoves(blackPieces, redPieces, blackKings, redKings, 'b').length == 0){ //ai won
		console.log('ai won')
		document.getElementById('roboText').innerHTML = 'Good game! Feel free to play me again whenever :)'
	}
	else if(bestValue <= -1000){ //calculated loss for ai with best play
        document.getElementById('roboText').innerHTML = 'I have a bad feeling about this...'
    }
    else if(bestValue >= 1000){ //calculated win for ai with best play
        document.getElementById('roboText').innerHTML = 'Your loss is certain...'
    }
    else{
        document.getElementById('roboText').innerHTML = `I have analyzed ${perms} positions`
        if(Math.abs(bestValue) < 10){
            document.getElementById('roboText').innerHTML += ` and we are evenly matched!`
        }
        else if(bestValue > 10){
            document.getElementById('roboText').innerHTML += ` and I am winning!`
        }
        else if(bestValue > 30){
            document.getElementById('roboText').innerHTML += ` and I am dominating!`
        }
		else if(bestValue > 50){
            document.getElementById('roboText').innerHTML += ` and you are in big trouble!`
        }
		else if(bestValue > 100){
            document.getElementById('roboText').innerHTML += ` and you are almost lost!`
        }
        else if(bestValue < -10){
            document.getElementById('roboText').innerHTML += ` and I am losing!`
        }
        else if(bestValue < -30){
            document.getElementById('roboText').innerHTML += ` and I am failing!`
        }
		else if(bestValue < -50){
            document.getElementById('roboText').innerHTML += ` and its not looking good for me!`
        }
		else if(bestValue < -100){
            document.getElementById('roboText').innerHTML = ` I'm short-circuiting..`
        }
    }
	removeEventListeners()
	updateHTML()
}


function minimax(redPieces, blackPieces, redKings, blackKings, depth, alpha, beta, maximizing){
	perms++
	if(depth == 0){
		return evalBoard(redPieces, blackPieces, redKings, blackKings)
	}
	if(maximizing){
		let moves = genMoves(redPieces, blackPieces, redKings, blackKings, 'r')
		if(moves.length == 0){ //no moves to make, multiply by depth so as to prioritize faster win
			return -2000 * depth
		}
		let maxEval = -200000
		for(let move of moves){
			let newBlackP = blackPieces
			let newRedP = redPieces
			let newBlackK = blackKings
			let newRedK = redKings
			if(move.capture.length > 0){ //if captures in current move then update black boards before minimax
				for(let cap of move.capture){
					if(newBlackP & (BigInt.asUintN(64, 1n) << BigInt(cap))){
						newBlackP = newBlackP ^ (BigInt.asUintN(64, 1n) << BigInt(cap))
					}
					else if(newBlackK & (BigInt.asUintN(64, 1n) << BigInt(cap))){
						newBlackK = newBlackK ^ (BigInt.asUintN(64, 1n) << BigInt(cap))
					}
				}
			}
			//update red (ai) boards
			if(newRedP & (BigInt.asUintN(64, 1n) << BigInt(move.source))){
				newRedP = newRedP ^ (BigInt.asUintN(64, 1n) << BigInt(move.source))
				if(move.destination <= 7){ //check if promoting move
					newRedK = newRedK | (BigInt.asUintN(64, 1n) << BigInt(move.destination))
				}
				else{
					newRedP = newRedP | (BigInt.asUintN(64, 1n) << BigInt(move.destination))
				}
				
			}
			else if(newRedK & (BigInt.asUintN(64, 1n) << BigInt(move.source))){
				newRedK = newRedK ^ (BigInt.asUintN(64, 1n) << BigInt(move.source))
				newRedK = newRedK | (BigInt.asUintN(64, 1n) << BigInt(move.destination))
			}
			let currVal = minimax(newRedP, newBlackP, newRedK, newBlackK, depth-1, alpha, beta, false) 
			maxEval = Math.max(currVal, maxEval)
			alpha = Math.max(alpha, currVal)
			if(beta <= alpha){
				break
			}
		}
		return maxEval
	}
	else{
		let moves = genMoves(blackPieces, redPieces, blackKings, redKings, 'b')
		if(moves.length == 0){ //no moves to make, multiply by depth so as to prioritize faster win
			return 2000 * depth
		}
		let minEval = 200000
		for(let move of moves){
			let newBlackP = blackPieces
			let newRedP = redPieces
			let newBlackK = blackKings
			let newRedK = redKings
			if(move.capture.length > 0){ //if captures in current move then update red boards before minimax
				for(let cap of move.capture){
					if(newRedP & (BigInt.asUintN(64, 1n) << BigInt(cap))){
						newRedP = newRedP ^ (BigInt.asUintN(64, 1n) << BigInt(cap))
					}
					else if(newRedK & (BigInt.asUintN(64, 1n) << BigInt(cap))){
						newRedK = newRedK ^ (BigInt.asUintN(64, 1n) << BigInt(cap))
					}
				}
			}
			//update black boards
			if(newBlackP & (BigInt.asUintN(64, 1n) << BigInt(move.source))){
				newBlackP = newBlackP ^ (BigInt.asUintN(64, 1n) << BigInt(move.source))
				if(move.destination >= 56){ //check if promoting move
					newBlackK = newBlackK | (BigInt.asUintN(64, 1n) << BigInt(move.destination))
				}
				else{
					newBlackP = newBlackP | (BigInt.asUintN(64, 1n) << BigInt(move.destination))
				}
				
			}
			else if(newBlackK & (BigInt.asUintN(64, 1n) << BigInt(move.source))){
				newBlackK = newBlackK ^ (BigInt.asUintN(64, 1n) << BigInt(move.source))
				newBlackK = newBlackK | (BigInt.asUintN(64, 1n) << BigInt(move.destination))
			}
			let currVal = minimax(newRedP, newBlackP, newRedK, newBlackK, depth-1, alpha, beta, true) 
			minEval = Math.min(currVal, minEval)
			beta = Math.min(beta, currVal)
			if(beta <= alpha){
				break
			}
		}
		return minEval
	}
}
//return list of moves for specified player
function genMoves(myPieces, enemyPieces, myKings, enemyKings, color){
	let moves = []
	let piecesCopy = myPieces
	let kingsCopy = myKings
	let allPieces = myPieces | enemyPieces | myKings | enemyKings
	let allEnemy = enemyPieces | enemyKings
	let possibleCaptures = []
	while(piecesCopy != BigInt(0)){
		let source = trailingZeros(piecesCopy)
		moves = moves.concat(generatePossibleMoves(source, myKings, color, allPieces));
		generatePossibleCaptures(possibleCaptures, source, allEnemy, false, color, allPieces, [], source)
		piecesCopy = piecesCopy & (piecesCopy - BigInt.asUintN(64, 1n));
		//console.log(piecesCopy.toString(2))
	}
	
	while(kingsCopy != BigInt(0)){
		let source = trailingZeros(kingsCopy)
		moves = moves.concat(generatePossibleMoves(source, myKings, color, allPieces))
		generatePossibleCaptures(possibleCaptures, source, allEnemy, true, color, allPieces, [], source)
		kingsCopy = kingsCopy & (kingsCopy - BigInt.asUintN(64, 1n));
	}
	if(possibleCaptures.length > 0){
		return possibleCaptures
	}
	return moves
}

function isOccupied(square, allPieces) { //is occupied by any piece
	let bitMask = BigInt.asUintN(64, 1n) << BigInt(square);
	return (allPieces & bitMask) !== BigInt(0);
}

function moveInBoundary(source, destination){ //specifically checking only top and bottom boundary for non capture moves, returns true if in boundary
	if(destination > source){ //moving upward so check top boundary
		if(source >= 56){
			return false
		}
	}
	else{ //moving downward so check bottom boundary
		if(source <= 7){
			return false
		}
	}
	return true
}

function capInBoundary(source, destination){ //specifically checking only top and bottom boundary for non capture moves, returns true if in boundary
	if(destination > source){ //moving upward so check top boundary
		if(source >= 48){
			return false
		}
	}
	else{ //moving downward so check bottom boundary
		if(source <= 15){
			return false
		}
	}
	return true
}
//returns array of possible non capture moves for given piece
function generatePossibleMoves(source, kings, color, allPieces) {
    let possibleMoves = [];
	//red offsets
	let leftMove = source - 7;
	let rightMove = source - 9;
	let backwardLeftMove = source + 9;
	let backwardRightMove = source + 7;
	if(color == 'b'){//black offsets
		leftMove = source + 9;
	  	rightMove = source + 7;
		backwardLeftMove = source - 7;
		backwardRightMove = source - 9;
	}
    if(kings & (BigInt.asUintN(64, 1n) << BigInt(source))) {
		// For kings, add backward moves as well
		if(notLeftCol & (BigInt.asUintN(64, 1n) << BigInt(source)) && !isOccupied(backwardLeftMove, allPieces) && moveInBoundary(source, backwardLeftMove)){
			possibleMoves.push({ source, destination: backwardLeftMove, capture: [] });
		}
		if(notRightCol & (BigInt.asUintN(64, 1n) << BigInt(source)) && !isOccupied(backwardRightMove, allPieces) && moveInBoundary(source, backwardRightMove)){
			possibleMoves.push({ source, destination: backwardRightMove, capture: [] });
		}
	}
	if(notLeftCol & (BigInt.asUintN(64, 1n) << BigInt(source)) && !isOccupied(leftMove, allPieces) && moveInBoundary(source, leftMove)){ 
		possibleMoves.push({ source, destination: leftMove, capture: [] });
	}
	if(notRightCol & (BigInt.asUintN(64, 1n) << BigInt(source)) && !isOccupied(rightMove, allPieces) && moveInBoundary(source, rightMove)){
		possibleMoves.push({ source, destination: rightMove, capture: [] });
	}
	return possibleMoves;
}

//make sure to check this again after every move for multi captures
function generatePossibleCaptures(possibleMoves, source, enemyBoard, king, color, allPieces, captured, originalSource){
	let leftCapMove = source - 14
	let rightCapMove = source - 18
	let backwardLeftCapMove = source + 18
	let backwardRightCapMove = source + 14
	let leftCap = source - 7;
	let rightCap = source - 9;
	let backwardLeftCap = source + 9;
	let backwardRightCap = source + 7;
	if(color == 'b'){
		leftCapMove = source + 18
		rightCapMove = source + 14
		backwardLeftCapMove = source -14
		backwardRightCapMove = source - 18
		leftCap = source + 9
		rightCap = source + 7
		backwardLeftCap = source - 7
		backwardRightCap = source - 9
	}
	let didCap = false
	if(king){
		if(notLeftColCap & (BigInt.asUintN(64, 1n) << BigInt(source)) && enemyBoard & (BigInt.asUintN(64, 1n) << BigInt(backwardLeftCap)) && !isOccupied(backwardLeftCapMove, allPieces)  && capInBoundary(source, backwardLeftCapMove)){
			let newEnemyBoard = enemyBoard ^ (BigInt.asUintN(64, 1n) << BigInt(backwardLeftCap))
			let temp = [...captured]
			temp.push(backwardLeftCap)
			generatePossibleCaptures(possibleMoves, backwardLeftCapMove, newEnemyBoard, king, color, allPieces, temp, originalSource)
			didCap = true
		}
		if(notRightColCap & (BigInt.asUintN(64, 1n) << BigInt(source)) && enemyBoard & (BigInt.asUintN(64, 1n) << BigInt(backwardRightCap)) && !isOccupied(backwardRightCapMove, allPieces)  && capInBoundary(source, backwardRightCapMove)){
			let newEnemyBoard = enemyBoard ^ (BigInt.asUintN(64, 1n) << BigInt(backwardRightCap))
			let temp = [...captured]
			temp.push(backwardRightCap)
			generatePossibleCaptures(possibleMoves, backwardRightCapMove, newEnemyBoard, king, color, allPieces, temp, originalSource)
			didCap = true
		}
	}
	if(notLeftColCap & (BigInt.asUintN(64, 1n) << BigInt(source)) && enemyBoard & (BigInt.asUintN(64, 1n) << BigInt(leftCap)) && !isOccupied(leftCapMove, allPieces) && capInBoundary(source, leftCapMove)){
		let newEnemyBoard = enemyBoard ^ (BigInt.asUintN(64, 1n) << BigInt(leftCap))
		let temp = [...captured]
		temp.push(leftCap)
		generatePossibleCaptures(possibleMoves, leftCapMove, newEnemyBoard, king, color, allPieces, temp, originalSource)
		didCap = true
	}
	if(notRightColCap & (BigInt.asUintN(64, 1n) << BigInt(source)) && enemyBoard & (BigInt.asUintN(64, 1n) << BigInt(rightCap)) && !isOccupied(rightCapMove, allPieces) && capInBoundary(source, rightCapMove)){
		let newEnemyBoard = enemyBoard ^ (BigInt.asUintN(64, 1n) << BigInt(rightCap))
		let temp = [...captured]
		temp.push(rightCap)
		generatePossibleCaptures(possibleMoves, rightCapMove, newEnemyBoard, king, color, allPieces, temp, originalSource)
		didCap = true
	}
	if(!didCap && source != originalSource){
		//reached end of line, push to moves
		possibleMoves.push({source: originalSource, destination: source, capture: captured})
	}

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

//considering pieces, promoted pieces, how far up the board a normal piece is, center squares for promoted pieces
function evalBoard(redPieces, blackPieces, redKings, blackKings){
	let aiEval = 0, playerEval = 0
	let pieceWeight = 4
	let promotedWeight = 14
	let middleWeight = 0.01
	let idx = BigInt.asUintN(64, 1n)
	for(let i = 0; i < 64; i++){
		idx = idx << BigInt.asUintN(64, BigInt(1))
		if(redPieces & idx){
			aiEval += pieceWeight + (7-findRow(idx))
		}
		else if(redKings & idx){
			//34 25 16 07
			aiEval += promotedWeight 
			let row = findRow(idx)
			if(row == 3 || row == 4){
				aiEval += middleWeight * 4
			}
			else if(row == 2 || row == 5){
				aiEval += middleWeight * 3
			}
			else if(row == 1 || row == 6){
				aiEval += middleWeight * 2
			}
			else if(row == 0 || row == 7){
				aiEval += middleWeight
			}
		}
		else if(blackPieces & idx){
			playerEval += pieceWeight + findRow(idx)
		}
		else if(blackKings & idx){
			playerEval += promotedWeight
			let row = findRow(idx)
			if(row == 3 || row == 4){
				playerEval += middleWeight * 4
			}
			else if(row == 2 || row == 5){
				playerEval += middleWeight * 3
			}
			else if(row == 1 || row == 6){
				playerEval += middleWeight * 2
			}
			else if(row == 0 || row == 7){
				playerEval += middleWeight
			}
		}	
	}
	return aiEval - playerEval
}

function findRow(idx){ 
	if(idx & row0){
		return 0
	}
	if(idx & row1){
		return 1
	}
	if(idx & row2){
		return 2
	}
	if(idx & row3){
		return 3
	}
	if(idx & row4){
		return 4
	}
	if(idx & row5){
		return 5
	}
	if(idx & row6){
		return 6
	}
	if(idx & row7){
		return 7
	}
}

//for testing purposes only, convinient way to generate test positions
//0 is empty, 1 is red piece, 2 is black piece, 11 is promoted red, 12 is promoted black
function updateFromArray(){
	let idx = 0
	redPieces = BigInt.asUintN(64, 0n)
	redKings = BigInt.asUintN(64, 0n)
	blackPieces = BigInt.asUintN(64, 0n)
	blackKings = BigInt.asUintN(64, 0n)
	for(let i = 7; i >= 0; i--){
		for(let j = 7; j >= 0; j--){
			if(board[i][j] == 1){
				redPieces = redPieces | BigInt.asUintN(64, 1n) << BigInt(idx)
			}
			else if(board[i][j] == 2){
				blackPieces = blackPieces | BigInt.asUintN(64, 1n) << BigInt(idx)
			}
			else if(board[i][j] == 11){
				redKings = redKings | BigInt.asUintN(64, 1n) << BigInt(idx)
			}
			else if(board[i][j] == 12){
				blackKings = blackKings | BigInt.asUintN(64, 1n) << BigInt(idx)
			}
			idx++
		}
	}
}
updateFromArray()
//console.log(genMoves(redPieces, blackPieces, redKings, blackKings, 'r'))
updateHTML()
