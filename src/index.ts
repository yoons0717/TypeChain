import * as CryptoJS from 'crypto-js';

class Block{
   
// 함수를 static으로 선언하여서 Block을 생성하지 않아도 동작
    static calculateBlockHash = (
        index:number, 
        previousHash:string, 
        timestamp:number, 
        data:string
        ):string => 
        CryptoJS.SHA256(index + previousHash + timestamp + data).toString();
    
    static validateStructure = (aBlock: Block) : boolean => 
        typeof aBlock.index == "number" && 
        typeof aBlock.hash === "string" && 
        typeof aBlock.previousHash === "string" &&
        typeof aBlock.timestamp === "number" &&
        typeof aBlock.data ==="string";
    
    public index:number;
    public hash:string;
    public previousHash: string;
    public data: string;
    public timestamp: number;

    
    constructor(
        index:number,
        hash:string,
        previousHash: string,
        data: string,
        timestamp: number
    ){
        this.index = index;
        this.hash = hash;
        this.previousHash = previousHash;
        this.data = data;
        this.timestamp = timestamp;
    }
}

const genesisBlock:Block = new Block(0,"2020202020","","Hello",123456);

let blockchain: Block[] = [genesisBlock];

const getBlockchain = () : Block[] => blockchain;

const getLatestBlock = () : Block=> blockchain[blockchain.length-1];

const getNewTimeStamp = () : number => Math.round(new Date().getTime() / 1000);

const createNewBlock =(data:string) : Block => {
    const previousBlock : Block = getLatestBlock();
    const newIndex : number = previousBlock.index + 1;
    const newTimestamp : number = getNewTimeStamp();
    const newtHash: string = Block.calculateBlockHash(
        newIndex, 
        previousBlock.hash, 
        newTimestamp,
        data
    );

    const newBlock : Block = new Block(
        newIndex,
        newtHash,
        previousBlock.hash,
        data,
        newTimestamp
    );
    addBlock(newBlock);
    return newBlock;
};

// 블록의 해쉬 얻기
const getHashforBlock = (aBlock:Block):string => Block.calculateBlockHash(aBlock.index,aBlock.previousHash, aBlock.timestamp, aBlock.data);


// 블록이 유효한지 검사
// 블록체인의 기반은 블록들이 자신의 전 블록으로의 링크가 있다
const isBlockValid = (
    candidateBlock : Block, 
    previousBlock :Block
) : boolean =>{
    // 블록의 구조가 유효한지
    if(!Block.validateStructure(candidateBlock)){
        return false;
    }
    else if(previousBlock.index+1 !== candidateBlock.index){
        return false;
    }
    else if(previousBlock.hash !== candidateBlock.previousHash){
        return false;
    }
    else if(getHashforBlock(candidateBlock)!== candidateBlock.hash){
        return false;
    }
    else{
        return true;
    }
};

const addBlock = (candidateBlock : Block): void =>{
    if(isBlockValid(candidateBlock,getLatestBlock())){
        blockchain.push(candidateBlock);
    }
}

createNewBlock("second block");
createNewBlock("third block");
createNewBlock("fourth block");

console.log(blockchain)
export {};