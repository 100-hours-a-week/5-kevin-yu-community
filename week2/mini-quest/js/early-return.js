const applyDiscount = (age) => {
    if (age <= 0) {
        return '올바른 나이를 입력해주세요.';
    }

    if (age < 20) {
        // 할인 로직
        return '20% 미성년자 할인이 적용됩니다.';
    } else {
        return '할인이 적용되지 않습니다.';
    }
};

console.log(applyDiscount(0));
console.log(applyDiscount(19));
console.log(applyDiscount(30));