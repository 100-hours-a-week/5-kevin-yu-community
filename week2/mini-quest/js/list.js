// 1번 퀘스트
// const numbers = [1, 2, 3, 4, 5];
//
// let result = 0;
//
// for (let n of numbers) {
//     result += n;
//     console.log(`현재 합계: ${result} (${n}를 더함)`);
// }
// console.log(`최종 합계: ${result}`);

// 2번 퀘스트
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

let result = 0;

for (let i = 1; i < numbers.length; i += 2) {
    result += numbers[i];
    console.log(`짝수 발견: ${numbers[i]}`);
}
console.log(`짝수 합계: ${result}`);