// 1번 퀘스트
import readline from 'readline-sync';

// 숫자 입력 받음
const num = parseInt(readline.question('숫자 입력: '));

if (num < 2) {
    console.log('2 이상의 숫자를 입력하세요');
}

for (let i = 1; i <= 9; i++) {
    console.log(`${num} * ${i} = ${num * i}`);
}

// 2번 퀘스트
for (let i = 0; i < 5; i++) {
    let line = '';
    for (let j = 0; j < 5 - i - 1; j++) {
        line += ' ';
    }
    for (let j = 0; j < 2 * i + 1; j++) {
        line += '*';
    }
    console.log(line);
}