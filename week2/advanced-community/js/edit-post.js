// 헤더
// 뒤로 가기 버튼
// query string에서 파싱한 게시글의 번호
const no = new URLSearchParams(window.location.search).get('no');
document.querySelector('.back').addEventListener('click', () => {
    window.location.href = `/post/${window.location.search}`;
});

document.addEventListener('DOMContentLoaded', () => {
    fetch('/json/board')
        .then(response => response.json())
        .then(data => {
            data.posts.forEach(post => {
                if (post.no === parseInt(no)) {
                    const title = document.querySelector('#title');
                    title.value = post.title;
                    const content = document.querySelector('#content');
                    content.value = post.content;
                }
            });
        });
});

document.querySelector('.submit button').addEventListener('click', (e) => {
    // 수정 내용을 반영하는 기능 추가해야 함
    window.location.href = `/post/${window.location.search}`;
});