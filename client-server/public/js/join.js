// 헤더
// 뒤로 가기 버튼
document.querySelector('.back').addEventListener('click', () => {
    window.location.href = '/users/login';
});

// 본문
const profileButton = document.querySelector('.add');
const emailInput = document.querySelector('#email');
const passwordInput = document.querySelector('#password');
const passwordCheckInput = document.querySelector('#password-check');
const nicknameInput = document.querySelector('#nickname');
const joinButton = document.querySelector('.button');

// 처음엔 확인하지 않았으므로 false로 초기화
let isUploaded = false; // 사진을 업로드 했는가
let isCollectEmail = false; // 이메일 양식이 올바른가
let isCollectPassword = false; // 비밀번호 양식이 올바른가
let isSameWithPasswordCheck = false; // 비밀번호가 비밀번호 확인과 동일한가
let isSameWithPassword = false; // 비밀번호 확인이 비밀번호와 동일한가
let isCollectNickname = false; // 닉네임 양식이 올바른가

// 도움말을 보여주는 함수
function showHelperText(helper, text) {
    helper.textContent = text;
    helper.style.visibility = 'visible';
}

// 모든 입력란의 유효성 검사를 통과했다면,
// 버튼의 색상과 커서의 모양을 변경해서 사용자가 클릭할 수 있음을 알림
function changeButtonState() {
    joinButton.style.backgroundColor =
        isUploaded && isCollectEmail && isCollectPassword && isSameWithPasswordCheck
        && isSameWithPassword && isCollectNickname ? '#7f6aee' : '#aca0eb';

    joinButton.style.cursor =
        isUploaded && isCollectEmail && isCollectPassword && isSameWithPasswordCheck
        && isSameWithPassword && isCollectNickname ?
            'pointer' : 'default';
}

// 사용자가 사진을 업로드하거나 제거했을 때
let image;
profileButton.addEventListener('change', (e) => {
    const defaultImage = document.querySelector('.add'); // 기본 회색 배경
    const plusImage = document.querySelector('.add img'); // 플러스 모양 이미지
    // 프로필 이미지 도움말
    const helper = document.querySelector('.profile-helper');

    // e.target.files !== undefined 
    // -> 유효성 검사를 통과하지 않고 버튼을 누르면 이벤트를 강제로 터트리는데, 이때 체크를 안해주면 안내문이 나오지 않음
    if (e.target.files !== undefined && e.target.files.length > 0) { // 만약 이미지를 업로드 했다면(업로드하면 1이 나옴)
        image = e.target.files[0]; // 사용자가 업로드한 파일
        let reader = new FileReader();
        // onloadend -> 파일 읽기 작업이 끝났을 때
        reader.onloadend = () => {
            // 배경 이미지를 사용자가 업로드한 사진으로 변경
            defaultImage.style.setProperty('background-image', `url("${reader.result}")`);
            defaultImage.style.setProperty('background-size', 'cover');
            defaultImage.style.setProperty('background-repeat', 'round');
            plusImage.style.display = 'none';
            isUploaded = true; // 이미지 업로드 상태 변경
            helper.style.visibility = 'hidden'; // 도움말 숨김

            changeButtonState();
        };
        reader.readAsDataURL(image);
    } else {
        // 덮어씌워져 있던 이미지를 제거 -> 원래 이미지로 돌아옴
        defaultImage.style.removeProperty('background-image');
        defaultImage.style.removeProperty('background-size');
        defaultImage.style.removeProperty('background-repeat');
        plusImage.style.display = 'block';
        isUploaded = false; // 이미지 업로드 상태 변경
        helper.style.visibility = 'visible'; // 도움말 표시

        image = null;
    }
});

// 이메일을 입력하고 포커스가 빠져나갔을 때
emailInput.addEventListener('change', () => {
    const email = emailInput.value;
    // 이메일 정규 표현식
    const emailRegExp = /^[a-zA-Z0-9._-]+@[a-z]+\.[a-z]{2,3}$/;
    // 이메일 도움말
    const helper = document.querySelector('.email-helper');
    // 사용자가 입력한 이메일이 조건에 부합하는지 확인
    isCollectEmail = emailRegExp.test(email);

    // 안내문을 위한 추가 조건 검증
    if (email === '') {
        showHelperText(helper, '*이메일을 입력해주세요.');
    } else if (!isCollectEmail) {
        showHelperText(helper, '*올바른 이메일 주소 형식을 입력해주세요. (예: example@example.com)');
    } else {
        helper.style.visibility = 'hidden';
    }

    changeButtonState();
});

// 비밀번호를 입력하고 포커스가 빠져나갔을 때
passwordInput.addEventListener('change', () => {
    const password = passwordInput.value;
    const passwordCheck = passwordCheckInput.value;
    // 비밀번호 조건
    // 1. 8자 이상, 20자 이하여야 한다.
    // 2. 대문자, 소문자, 숫자, 특수문자가 각각 최소 1개 포함되어야 한다.
    const passwordRegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,20}$/;
    // 비밀번호 도움말
    const helper = document.querySelector('.password-helper')
    // 사용자가 입력한 비밀번호가 조건에 부합하는지 확인
    isCollectPassword = passwordRegExp.test(password);
    // 비밀번호와 비밀번호 확인의 입력값이 동일한지 확인
    isSameWithPasswordCheck = password === passwordCheck;

    // 안내문을 위한 추가 조건 검증
    if (password === '') {
        showHelperText(helper, '*비밀번호를 입력해주세요');
    } else if (!isSameWithPasswordCheck && passwordCheck.trim() !== '') {
        // passwordCheck.trim() !== '' -> 비밀번호 확인을 입력하기 전에 안내가 표시되는 것을 방지
        showHelperText(helper, '*비밀번호 확인과 다릅니다.');
    } else if (!isCollectPassword) {
        // innerHTML을 사용한 이유 -> <br>을 사용하기 위해(가독성을 위해 줄바꿈을 추가)
        helper.innerHTML = '*비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를<br> 각각 최소 1개 포함해야 합니다.';
        helper.style.visibility = 'visible';
    } else {
        helper.style.visibility = 'hidden';
    }

    changeButtonState();
});

// 비밀번호 확인을 입력하고 포커스가 빠져나갔을 때
passwordCheckInput.addEventListener('change', () => {
    const password = passwordInput.value;
    const passwordCheck = passwordCheckInput.value;
    // 비밀번호 확인 도움말
    const helper = document.querySelector('.password-check-helper');
    // 비밀번호와 비밀번호 확인의 입력값이 동일한지 확인
    isSameWithPassword = password === passwordCheck;
    isSameWithPasswordCheck = password === passwordCheck;

    // 안내문을 위한 추가 조건 검증
    if (passwordCheck === '') {
        showHelperText(helper, '*비밀번호를 한 번 더 입력해주세요.');
    } else if (!isSameWithPassword) {
        showHelperText(helper, '*비밀번호와 다릅니다.');
    } else {
        helper.style.visibility = 'hidden';
    }

    changeButtonState();
});

// 닉네임을 입력하고 포커스가 빠져나갔을 때
nicknameInput.addEventListener('change', () => {
    const nickname = nicknameInput.value;
    // 닉네임 조건
    // 1. 1자 이상, 10자 이하여야 한다.
    // 2. 영 대/소문자, 한글, 숫자만 사용 가능하며, 공백은 들어갈 수 없다.
    const nicknameRegExp = /^[a-zA-z가-힣0-9]{1,10}$/;
    // 닉네임 도움말
    const helper = document.querySelector('.nickname-helper');
    // 사용자가 입력한 닉네임이 조건에 부합하는지 확인
    isCollectNickname = nicknameRegExp.test(nickname);

    // 안내문을 위한 추가 조건 검증
    if (nickname === '') {
        showHelperText(helper, '*닉네임을 입력해주세요.');
    } else if (nickname.includes(' ')) {
        showHelperText(helper, '*띄어쓰기를 없애주세요.');
    } else if (nickname.length > 10) {
        showHelperText(helper, '*닉네임은 최대 10자까지 작성 가능합니다.');
    } else {
        helper.style.visibility = 'hidden';
    }

    changeButtonState();
});

// 모든 유효성 검사를 통과했다면, 회원가입 버튼을 눌렀을 때 로그인 화면으로 이동
joinButton.addEventListener('click', () => {
    if (isUploaded && isCollectEmail && isCollectPassword
        && isSameWithPasswordCheck && isSameWithPassword && isCollectNickname) {

        const formData = new FormData();
        formData.append("file", image);
        formData.append("email", emailInput.value);
        formData.append("password", passwordInput.value);
        formData.append("nickname", nicknameInput.value);

        fetch('/users/join', {
            method: 'POST',
            body: formData
        }).then(response => {
            console.log(response);
            const status = response.status;
            return response.json().then(json => {
                return {status, json};
            })
        }).then(({status, json}) => {
            const emailHelper = document.querySelector('.email-helper');
            const nicknameHelper = document.querySelector('.nickname-helper');

            if (status === 201) {
                alert('회원가입이 완료되었습니다.');
                window.location.href = '/users/login';
            } else if (status === 409) {
                if (json.message === 'Email already exists') {
                    showHelperText(emailHelper, '*이미 등록된 이메일입니다.');
                } else {
                    showHelperText(nicknameHelper, '*이미 존재하는 닉네임입니다.');
                }
            }
        });
    } else {
        const event = new Event('change');
        profileButton.dispatchEvent(event);
        emailInput.dispatchEvent(event);
        passwordInput.dispatchEvent(event);
        passwordCheckInput.dispatchEvent(event);
        nicknameInput.dispatchEvent(event);
    }
});