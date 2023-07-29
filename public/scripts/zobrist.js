/*
    File for functions related to transposition table and zobrist hashing
*/

function randomInt() {
    let min = 0;
    let max = Math.pow(2, 64);
    let res = BigInt(Math.floor(Math.random() * (max - min) + min))
    return res
}

function initTable(){
    for(let i = 0; i < 64; i++){
        ZobristTable[i] = new Array(4);
    }
    for (let i = 0; i < 64; i++){
        //index 0 for red pieces, 1 for black pieces, 2 for red kings, 3 for black kings
        for (let j = 0; j < 4; j++){
            ZobristTable[i][j] = randomInt()
        }
    }
}

// Computes the hash value of a given board, include whos turn in the hash
function computeHash(redP, blackP, redK, blackK){
	//iterate through all bitboards 
    let idx = BigInt.asUintN(64, 1n)
    let h = BigInt.asIntN(64, 0n)
	for(let i = 0; i < 64; i++){
		if(redP & idx){
            h ^= ZobristTable[i][0]
        }
        else if(blackP & idx){
            h ^= ZobristTable[i][1]
        }
        else if(redK & idx){
            h ^= ZobristTable[i][2]
        }
        else if(blackK & idx){
            h ^= ZobristTable[i][3]
        }
        idx = idx << BigInt.asUintN(64, BigInt(1))
		//console.log(h.toString(2))
	}
   
    return h
}