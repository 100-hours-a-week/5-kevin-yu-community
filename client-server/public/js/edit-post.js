// 헤더
// 뒤로 가기 버튼
// path variable에서 파싱한 게시글의 번호
const path = window.location.pathname;
const no = path.split('/')[2];
const id = new URLSearchParams(window.location.search).get('id');

document.querySelector('.back').addEventListener('click', () => {
    window.location.href = `/posts/${no}?id=${id}`;
});

// 게시글의 데이터를 백엔드 서버에 요청
const title = document.querySelector('#title');
const content = document.querySelector('#content');
document.addEventListener('DOMContentLoaded', () => {
    fetch(`http://localhost:4000/json/posts/${no}`)
        .then(response => response.json())
        .then(post => {
            title.value = post.title;
            content.value = post.content;
        });
});

// 제목과 본문이 공백이 아닌지 검사
function isValidToSubmit() {
    const button = document.querySelector('.submit button');
    const helper = document.querySelector('.helper');

    if (title.value.trim() === '' || content.value.trim() === '') {
        helper.style.visibility = 'visible';
        button.style.backgroundColor = '#aca0eb';
        return false;
    } else {
        helper.style.visibility = 'hidden';
        button.style.backgroundColor = '#7f6aee';
        return true;
    }
}

const elements = [title, content];
elements.forEach(element => {
    element.addEventListener('change', () => {
        isValidToSubmit();
    });
});

document.querySelector('.submit button').addEventListener('click', (e) => {
    if (isValidToSubmit()) {
        fetch(`/posts/${no}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: title.value,
                content: content.value
            })
        })
            .then(response => {
                if (response.ok) {
                    window.location.href = `/posts/${no}?id=${id}`
                } else {
                    alert('수정에 실패하였습니다. 잠시 후 다시 시도해주세요.');
                }
            });
    }
});