// 1번 퀘스트
import readline from 'readline-sync';

function gugudan(num) {
    if (num < 2) {
        console.log('2 이상의 숫자를 입력하세요');
        return;
    }

    for (let i = 1; i <= 9; i++) {
        console.log(`${num} * ${i} = ${num * i}`);
    }
}

const number = parseInt(readline.question('숫자 입력: '));
gugudan(number);

// 2번 퀘스트
function calculator(number1, operator, number2) {
    let result;

    switch (operator) {
        case '+':
            result = number1 + number2;
            break;
        case '-':
            result = number1 - number2;
            break;
        case '*':
            result = number1 * number2;
            break;
        case '/':
            if (number2 === 0) {
                console.log('0으로는 나눌 수 없습니다.');
                return;
            }
            result = number1 / number2;
            break;
        default:
            console.log('올바르지 않은 연산자입니다.');
    }
    console.log(`${number1} ${operator} ${number2} = ${result}`);
}

const number1 = parseInt(readline.question('첫 번째 숫자: '));
const operator = readline.question('연산자: ');
const number2 = parseInt(readline.question('두 번째 숫자: '));
calculator(number1, operator, number2);