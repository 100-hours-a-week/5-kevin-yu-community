const firstNumber = 10; // 첫 번째 수 변수 초기화
const secondNumber = 5; // 두 번째 수 변수 초기화
const operator = '+'; // 연산자 변수 초기화

let result; // 결과 저장 변수 선언

switch (operator) { // 연산자에 따라 다른 연산 수행
    case '+':
        result = firstNumber + secondNumber;
        break;
    case '-':
        result = firstNumber - secondNumber;
        break;
    case '*':
        result = firstNumber * secondNumber;
        break;
    case '/':
        result = firstNumber / secondNumber;
        break;
    default:
        result = '유효하지 않은 연산자입니다.'; // 만약 유효한 연산자가 아닐 경우
}

console.log(`결과: ${result}`); // 템플릿 리터럴로 결과 출력