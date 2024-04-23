// 2번 퀘스트
const hour = 12; // 시간 변수 초기화


if (7 <= hour && hour <= 9) { // 7시부터 9시까지는 아침
    console.log('아침 식사 시간');
} else if (12 <= hour && hour <= 14) { // 12시부터 14시까지는 점심
    console.log('점심 식사 시간');
} else if (18 <= hour && hour <= 20) { // 18시부터 20시까지는 저녁
    console.log('저녁 식사 시간');
} else { // 그 외 나머지는 식사 금지
    console.log('식사 금지');
}


// 3번 퀘스트
const operator = '*'; // 연산자 변수 초기화

switch (operator) { // 입력된 연산자에 따라 다른 결과 출력
    case '+':
        console.log('더하기');
        break;
    case '-':
        console.log('빼기');
        break;
    case '*':
        console.log('곱하기');
        break;
    case '/':
        console.log('나누기');
        break;
    default:
        console.log('연산기호가 아님'); // 만약 유효한 연산자가 아닐 경우
}