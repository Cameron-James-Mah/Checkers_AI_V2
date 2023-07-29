/*
    minimax related functions
*/

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
	let startTime = Date.now()
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
		let currVal = minimax(newRedP, newBlackP, newRedK, newBlackK, depth, -200000, 200000, false, computeHash(newRedP, newBlackP, newRedK,newBlackK))
		if(currVal > bestValue){
			bestValue = currVal
			bestRed = newRedP
			bestRedK = newRedK
			bestBlack = newBlackP
			bestBlackK = newBlackK
		}
	}
	console.log(`Eval: ${bestValue}`)
	console.log(moves)
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
        document.getElementById('roboText').innerHTML = `I have analyzed ${perms} positions in ${(Date.now()-startTime)/1000}s`
        if(Math.abs(bestValue) < 5){
            document.getElementById('roboText').innerHTML += ` and we are evenly matched!`
        }
        else if(bestValue > 5){
            document.getElementById('roboText').innerHTML += ` and I am winning!`
        }
        else if(bestValue > 10){
            document.getElementById('roboText').innerHTML += ` and I am dominating!`
        }
		else if(bestValue > 20){
            document.getElementById('roboText').innerHTML += ` and you are in big trouble!`
        }
		else if(bestValue > 50){
            document.getElementById('roboText').innerHTML += ` and you are almost lost!`
        }
        else if(bestValue > -9){
            document.getElementById('roboText').innerHTML += ` and I am losing!`
        }
        else if(bestValue > -10){
            document.getElementById('roboText').innerHTML += ` and I am failing!`
        }
		else if(bestValue > -20){
            document.getElementById('roboText').innerHTML += ` and its not looking good for me!`
        }
		else if(bestValue > -50){
            document.getElementById('roboText').innerHTML = ` I'm short-circuiting..`
        }
    }
	removeEventListeners()
	updateHTML()
	redTable.clear()
	blackTable.clear()
	printBoard()
}


function minimax(redPieces, blackPieces, redKings, blackKings, depth, alpha, beta, maximizing, hashValue){
	perms++
	if(depth == 0){
		return evalBoard(redPieces, blackPieces, redKings, blackKings)
	}
	if(maximizing){
		if(redTable.has(hashValue) && redTable.get(hashValue).depth >= depth){
			//WHY DOES USING THE TRUE VALUE SOMETIMES CHANGE AI DECISION?
			if(redTable.get(hashValue).trueValue != null){
				return redTable.get(hashValue).trueValue
			}
			alpha = Math.max(alpha, redTable.get(hashValue).alpha)
			/*
			if(redKings != table.get(hashValue).rk || blackKings != table.get(hashValue).bk || redPieces != table.get(hashValue).r || blackPieces != table.get(hashValue).b){
				console.log('bad collision')
			}*/
			if(beta <= alpha){
				return alpha
			}

		}
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
			let h = hashValue
			if(move.capture.length > 0){ //if captures in current move then update black boards before minimax
				for(let cap of move.capture){
					if(newBlackP & (BigInt.asUintN(64, 1n) << BigInt(cap))){
						newBlackP = newBlackP ^ (BigInt.asUintN(64, 1n) << BigInt(cap))
						h ^= ZobristTable[cap][1]
					}
					else if(newBlackK & (BigInt.asUintN(64, 1n) << BigInt(cap))){
						newBlackK = newBlackK ^ (BigInt.asUintN(64, 1n) << BigInt(cap))
						h ^= ZobristTable[cap][3]
					}
				}
			}
			//update red (ai) boards
			//red piece moving
			if(newRedP & (BigInt.asUintN(64, 1n) << BigInt(move.source))){
				newRedP = newRedP ^ (BigInt.asUintN(64, 1n) << BigInt(move.source))
				h ^= ZobristTable[move.source][0]
				if(move.destination <= 7){ //check if promoting move
					newRedK = newRedK | (BigInt.asUintN(64, 1n) << BigInt(move.destination))
					h ^= ZobristTable[move.destination][2]
				}
				else{
					newRedP = newRedP | (BigInt.asUintN(64, 1n) << BigInt(move.destination))
					h ^= ZobristTable[move.destination][0]
				}
				
			}
			//red king moving
			else if(newRedK & (BigInt.asUintN(64, 1n) << BigInt(move.source))){
				newRedK = newRedK ^ (BigInt.asUintN(64, 1n) << BigInt(move.source))
				newRedK = newRedK | (BigInt.asUintN(64, 1n) << BigInt(move.destination))
				h ^= ZobristTable[move.source][2]
				h ^= ZobristTable[move.destination][2]
			}
			let currVal = minimax(newRedP, newBlackP, newRedK, newBlackK, depth-1, alpha, beta, false, h) 
			maxEval = Math.max(currVal, maxEval)
			alpha = Math.max(alpha, currVal)
			if(beta <= alpha){
				if(!redTable.has(hashValue) || redTable.get(hashValue).depth < depth){
					//table.set(hashValue, {alpha: alpha, depth: depth, r: redPieces, b: blackPieces, rk: redKings, bk: blackKings, h: h})
					redTable.set(hashValue, {alpha, depth, trueValue: null})
				}
				break
			}
		}
		//if reached here then alpha is the ture value of this node
		//WHY DOES USING NODES TRUE VALUE SOMETIMES CHANGE AI DECISION
		redTable.set(hashValue, {alpha, depth, trueValue: alpha})
		return alpha
	}
	else{
		if(blackTable.has(hashValue) && blackTable.get(hashValue).depth >= depth){
			if(blackTable.get(hashValue).trueValue != null){
				return blackTable.get(hashValue).trueValue
			}
			beta = Math.min(beta, blackTable.get(hashValue).beta)
			if(beta <= alpha){
				return alpha
			}

		}
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
			let h = hashValue
			if(move.capture.length > 0){ //if captures in current move then update red boards before minimax
				for(let cap of move.capture){
					if(newRedP & (BigInt.asUintN(64, 1n) << BigInt(cap))){
						newRedP = newRedP ^ (BigInt.asUintN(64, 1n) << BigInt(cap))
						h ^= ZobristTable[cap][0]
					}
					else if(newRedK & (BigInt.asUintN(64, 1n) << BigInt(cap))){
						newRedK = newRedK ^ (BigInt.asUintN(64, 1n) << BigInt(cap))
						h ^= ZobristTable[cap][2]
					}
				}
			}
			//update black boards
			if(newBlackP & (BigInt.asUintN(64, 1n) << BigInt(move.source))){
				newBlackP = newBlackP ^ (BigInt.asUintN(64, 1n) << BigInt(move.source))
				h ^= ZobristTable[move.source][1]
				if(move.destination >= 56){ //check if promoting move
					newBlackK = newBlackK | (BigInt.asUintN(64, 1n) << BigInt(move.destination))
					h ^= ZobristTable[move.destination][3]
				}
				else{
					newBlackP = newBlackP | (BigInt.asUintN(64, 1n) << BigInt(move.destination))
					h ^= ZobristTable[move.destination][1]
				}
				
			}
			else if(newBlackK & (BigInt.asUintN(64, 1n) << BigInt(move.source))){
				newBlackK = newBlackK ^ (BigInt.asUintN(64, 1n) << BigInt(move.source))
				h ^= ZobristTable[move.source][3]
				newBlackK = newBlackK | (BigInt.asUintN(64, 1n) << BigInt(move.destination))
				h ^= ZobristTable[move.destination][3]
			}
			let currVal = minimax(newRedP, newBlackP, newRedK, newBlackK, depth-1, alpha, beta, true, h) 
			minEval = Math.min(currVal, minEval)
			beta = Math.min(beta, currVal)
			if(beta <= alpha){
				if(!blackTable.has(hashValue) || blackTable.get(hashValue).depth < depth){
					//table.set(hashValue, {alpha: alpha, depth: depth, r: redPieces, b: blackPieces, rk: redKings, bk: blackKings, h: h})
					blackTable.set(hashValue, {beta, depth})
				}
				break
			}
		}
		blackTable.set(hashValue, {beta, depth, trueValue: beta})
		return beta
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
	while(piecesCopy != BigInt(0)){ //check captures first
		let source = trailingZeros(piecesCopy)
		generatePossibleCaptures(possibleCaptures, source, allEnemy, false, color, allPieces, [], source)
		piecesCopy = piecesCopy & (piecesCopy - BigInt.asUintN(64, 1n));
		//console.log(piecesCopy.toString(2))
	}
	while(kingsCopy != BigInt(0)){
		let source = trailingZeros(kingsCopy)
		generatePossibleCaptures(possibleCaptures, source, allEnemy, true, color, allPieces, [], source)
		kingsCopy = kingsCopy & (kingsCopy - BigInt.asUintN(64, 1n));
	}
	
	if(possibleCaptures.length == 0){ //if no captures consider moves
		piecesCopy = myPieces
		while(piecesCopy != BigInt(0)){
			let source = trailingZeros(piecesCopy)
			generatePossibleMoves(source, myKings, color, allPieces, moves)
			piecesCopy = piecesCopy & (piecesCopy - BigInt.asUintN(64, 1n));
			//console.log(piecesCopy.toString(2))
		}
		kingsCopy = myKings
		while(kingsCopy != BigInt(0)){
			let source = trailingZeros(kingsCopy)
			generatePossibleMoves(source, myKings, color, allPieces, moves)
			kingsCopy = kingsCopy & (kingsCopy - BigInt.asUintN(64, 1n));
		}
	}
	
	
	//console.log(possibleCaptures)
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
function generatePossibleMoves(source, kings, color, allPieces, possibleMoves){
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