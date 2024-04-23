import readline from 'readline-sync';

// 1번 퀘스트
let input = readline.question('입력: ');

console.log(`나: ${input}`);
console.log(`앵무새: ${input}`);

// 2번 퀘스트
let isCollect = false;
input = readline.question('입력2: ');
isCollect = input === 'hello, world!';

if (isCollect) {
    console.log('정답입니다.');
} else {
    console.log('실패입니다.');
}