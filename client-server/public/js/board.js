// 게시글 작성 페이지로 이동
document.querySelector('.post-button').addEventListener('click', () => {
    window.location.href = '/post/add-form';
});

// 조회수와 댓글의 개수를 변환하는 함수
function convertCount(count) {
    if (count >= 100000) {
        return '100k';
    } else if (count >= 10000) {
        return '10k';
    } else if (count >= 1000) {
        return '1k';
    } else {
        return count;
    }
}

// 게시글 요소를 생성하는 코드가 너무 길어서 가독성을 위해 분리
function makePostElement(data, post) {
    // 가장 바깥쪽을 감싸는 <article> 태그 생성
    const article = document.createElement('article');
    // 조회수와 댓글 개수 변환
    let hit = convertCount(parseInt(`${post.hit}`));
    let comment = convertCount(parseInt(`${post.comment}`));
    article.classList.add('post')
    // <article> 태그 안에 내용 추가
    article.innerHTML = `
        <input type="hidden" name="no" class="no" value="${post.no}">
        <section class="post-info">
            <h3>${post.title}</h3>
            <div class="numeric">
                <div class="count">
                    <div>좋아요 ${post.like}</div>
                    <div>댓글 ${comment}</div>
                    <div>조회수 ${hit}</div>
                </div>
                <div class="date">${post.regDt}</div>
            </div>
        </section>
        <hr class="post-horizontal" />
        <section class="writer">
            <div class="image"></div>
            <div class="nickname">${post.writer}</div>
        </section>`;
    // 생성된 요소를 반환
    return article;
}

document.addEventListener('DOMContentLoaded', () => {
    fetch('http://localhost:4000/json/board')
        .then(response => response.json())
        .then(data => {
            const postList = document.querySelector('.post-list');
            data.forEach(post => {
                // JSON에서 가져온 데이터로 새로운 요소를 생성하고
                let newPostElement = makePostElement(data, post);
                // 기존의 요소 밑에 추가함
                postList.appendChild(newPostElement);
            });
        })
        .catch(error => console.log(`Error: ${error}`));
});

// 이벤트 위임을 통해 특정 게시글로 이동
document.querySelector('.post-list').addEventListener('click', (e) => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    // 클릭한 게시글의 게시판 번호
    // closest() -> 가장 가까운 부모 요소 중 입력된 선택자에 해당하는 요소
    const boardNo = e.target.closest('.post').childNodes[1].value;
    // 백엔드 코드 없이 path variable을 쓰는 방법이 떠오르지 않아서 query string으로 처리
    window.location.href = `/posts/${boardNo}?id=${id}`;
});