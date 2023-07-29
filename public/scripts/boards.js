/*
    File for board presets for testing specific positions
*/

//0 is empty, 1 is red piece, 2 is black piece, 11 is promoted red, 12 is promoted black
//standard board setup
let boardPreset1 = [
    [0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [2, 0, 2, 0, 2, 0, 2, 0],
    [0, 2, 0, 2, 0, 2, 0, 2],
    [2, 0, 2, 0, 2, 0, 2, 0]
]

//empty board
let boardPreset2 = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0]
]

//check player jumps
let boardPreset3 = [
    [0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 0, 0],
    [0, 1, 0, 0, 0, 1, 0, 1],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 0, 0, 0, 0],
    [2, 0, 2, 0, 2, 0, 2, 0],
    [0, 2, 0, 2, 0, 2, 0, 2],
    [2, 0, 2, 0, 2, 0, 2, 0]
]

//check promotion, also 1v1 endgame
let boardPreset4 = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 2, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [11, 0, 0, 0, 0, 0, 0, 0]
]

let boardPreset5 = [
    [0, 0, 0, 0, 0, 0, 0, 12],
    [0, 0, 2, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 2, 0, 0, 0, 0, 0],
    [0, 2, 0, 11, 0, 0, 0, 0],
    [11, 0, 11, 0, 0, 0, 0, 0]
]

//check player win
let boardPreset6 = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 0, 0, 0],
    [0, 0, 0, 2, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0]
]

let boardPreset7 = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 12, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 11, 0, 12, 0, 0, 0, 0],
    [11, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0]
]

//2v2 endgame
let boardPreset8 = [
    [0, 0, 0, 0, 0, 12, 0, 12],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [11, 0, 11, 0, 0, 0, 0, 0]
]

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
//0 is empty, 1 is red piece, 2 is black piece, 3 is promoted red, 4 is promoted black
function printBoard(){
    let idx = 0
    let currentBoard = []
    for(let i = 0; i < 8; i++){
        let temp = []
        for(let j = 0; j < 8; j++){
            if(redPieces & BigInt.asUintN(64, 1n) << BigInt(idx)){
                temp.push(1)
            }
            else if(blackPieces & BigInt.asUintN(64, 1n) << BigInt(idx)){
                temp.push(2)
            }
            else if(redKings & BigInt.asUintN(64, 1n) << BigInt(idx)){
                temp.push(3)
            }
            else if(redKings & BigInt.asUintN(64, 1n) << BigInt(idx)){
                temp.push(4)
            }
            else{
                temp.push(0)
            }
            idx++
        }
        currentBoard.push(temp)
    }
    console.log(currentBoard)
}