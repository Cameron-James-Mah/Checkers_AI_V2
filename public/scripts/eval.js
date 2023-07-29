/*
    evaluation functions
*/

//considering pieces, promoted pieces, how far up the board a normal piece is, center squares for promoted pieces
function evalBoard(redPieces, blackPieces, redKings, blackKings){
	let aiEval = 0, playerEval = 0
	let pieceWeight = 4
	let promotedWeight = 14
	let middleWeight = 0.01
	let idx = BigInt.asUintN(64, 1n)
	for(let i = 0; i < 64; i++){
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
		idx = idx << BigInt.asUintN(64, BigInt(1))
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