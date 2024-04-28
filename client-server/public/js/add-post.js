const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');
// 헤더
// 뒤로 가기 버튼
document.querySelector('.back').addEventListener('click', () => {
    window.location.href = `/board?id=${id}`;
});

//본문
const titleInput = document.querySelector('#title');
const contentInput = document.querySelector('#content');
const helper = document.querySelector('.helper');
const submitButton = document.querySelector('button');

// 처음엔 확인하지 않았으므로 false로 초기화
let isTitleFilled = false; // 제목이 채워졌는가
let isContentFiled = false; // 본문이 채워졌는가

function changeButtonState() {
    // 완료 버튼 스타일 변경
    submitButton.style.backgroundColor = isTitleFilled && isContentFiled ? '#7f6aee' : '#aca0eb'; // 색상
    submitButton.style.cursor = isTitleFilled && isContentFiled ? 'pointer' : 'default'; // 커서

    if (isTitleFilled && isContentFiled) {
        // 안내문이 사라지는 건 입력을 모두 마쳤을 때
        helper.style.visibility = 'hidden';
    }
}

// 사용자가 제목을 입력했을 때
titleInput.addEventListener('change', () => {
    const title = titleInput.value;
    isTitleFilled = title.trim() !== '';

    changeButtonState();
});

// 사용자가 본문을 입력했을 때
contentInput.addEventListener('change', () => {
    const content = contentInput.value;
    isContentFiled = content.trim() !== '';

    changeButtonState();
});

// 사용자가 완료 버튼을 클릭했을 때
submitButton.addEventListener('click', (e) => {
    if (!isTitleFilled || !isContentFiled) {
        // 안내문이 보이는 건 버튼을 클릭 했을 때
        helper.style.visibility = 'visible';
        // 사용자가 입력을 모두 완료하지 않았을 경우, submit 하지 못하도록 만듦
        e.preventDefault();
    } else {
        const data = {
            "title": titleInput.value,
            "content": contentInput.value
        };
        // JSON API로 사용자가 입력한 데이터를 보냄
        fetch('/json/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(response => {
            if (response.ok) {
                window.location.href = `/board?id=${id}`;
            }
        });
    }
});


