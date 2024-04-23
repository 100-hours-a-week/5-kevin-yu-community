// 헤더
// 뒤로 가기 버튼
document.querySelector('.back').addEventListener('click', () => {
    window.location.href = '/board';
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

// 게시글 템플릿에 JSON 데이터 삽입
function insertText(post) {
    // 제목
    const title = document.querySelector('.title > h2');
    title.textContent = post.title;
    // 작성자
    const nickname = document.querySelector('.nickname');
    nickname.textContent = post.writer;
    // 작성일
    const regDt = document.querySelector('.date');
    regDt.textContent = post.regDt;
    // 이미지
    const image = document.querySelector('.content .image img');
    image.src = `/images/posts/${post.image}`;
    // 본문
    const content = document.querySelector('.text');
    content.textContent = post.content;
    // 조회수
    const hit = document.querySelector('.count div:first-child p:first-child');
    hit.textContent = convertCount(post.hit);
    // 댓글수
    const comment = document.querySelector('.count div:nth-child(2) p:first-child');
    comment.textContent = convertCount(post.comment);
}

// 댓글 리스트 생성
const commentList = document.querySelector('.comment-list');
function makeCommentList(comments) {
    comments.forEach(comment => {
        // 댓글 요소 생성
        const commentElement = document.createElement('div');
        commentElement.classList.add('comment-element');

        commentElement.innerHTML = `
            <div>
                <div class="image">
                    <img src="" alt="" />
                </div>
            </div>
            <div class="center">
                <div>
                    <div class="nickname bold">${comment.writer}</div>
                    <div class="date regular">${comment.regDt}</div>
                </div>
                <p>${comment.content}</p>
            </div>
            <div class="buttons">
                <button class="edit-comment regular">수정</button>
                <button class="delete-comment regular">삭제</button>
            </div>
        `;
        // 댓글 요소 생성 후 댓글 리스트 요소에 추가
        commentList.appendChild(commentElement);
    });

    return commentList;
}

// query string에서 파싱한 게시글의 번호
const no = new URLSearchParams(window.location.search).get('no');
// JSON에 있는 데이터로 동적으로 요소를 생성하고 추가
document.addEventListener('DOMContentLoaded', () => {
    fetch('/json/board')
        .then(response => response.json())
        .then(data => {
            const commentSection = document.querySelector('.comment');
            data.posts.forEach(post => {
                // 게시글 목록 중 query string과 게시글 번호가 똑같은 데이터를 찾음
                if (post.no === parseInt(no)) {
                    insertText(post);

                    const commentList = makeCommentList(post.comments);
                    commentSection.appendChild(commentList);
                }
            }); // forEach
        }) // then
        .catch(error => console.log(`Error: ${error}`));
});

// 댓글 입력 시 댓글 등록 버튼 상태를 변경 -> 과제 3에서 저장 기능 구현해야 함
const commentTextarea = document.querySelector('.comment-text textarea');
const commentButton = document.querySelector('.comment-button');
commentTextarea.addEventListener('keyup', () => {
    const isCommentEmpty = commentTextarea.value.trim() === '';

    commentButton.style.backgroundColor = isCommentEmpty ? '#aca0eb' : '#7f6aee';
    commentButton.style.cursor = isCommentEmpty ? 'defalut' : 'pointer';
});

const modal = document.querySelector('.modal');
const modalBackground = document.querySelector('.modal-background');
function showModal(text) {
    document.querySelector('.modal p:first-child').textContent = text;
    modal.style.display = 'flex';
    modalBackground.style.display = 'flex';
}

// 본문
// 게시글 수정/삭제 버튼 이벤트 등록
document.querySelector('.post').addEventListener('click', (e) => {
    if (e.target.classList.contains('edit-post')) {
        window.location.href = `/post/edit-form?no=${no}`;
    } else if (e.target.classList.contains('delete-post')) {
        showModal('게시글을 삭제하시겠습니까?');
    }
});

// 댓글 수정/삭제 버튼 이벤트 등록
document.querySelector('.comment').addEventListener('click', (e) => {
    if (e.target.classList.contains('edit-comment')) {
        // 댓글 정보가 표시되는 영역
        const commentText = e.target.closest('.comment-element').querySelector('.center');

        let before; // 바뀌기 전 요소
        let after; // 바뀌고 난 후의 요소
        // 단순히 댓글을 표시 중이라면, 댓글 내용을 댓글 수정란에 넣음
        if (commentText.querySelector('p') !== null) {
            before = document.createElement('textarea');
            after = commentText.querySelector('p');
            before.value = after.textContent;
        } else { // 댓글 수정 중이라면, 수정된 내용을 표시창에 출력
            before = document.createElement('p');
            after = commentText.querySelector('textarea');
            before.textContent = after.value;
        }
        after.remove();
        commentText.appendChild(before);
    } else if (e.target.classList.contains('delete-comment')) {
        showModal('댓글을 삭제하시겠습니까?');
    }
});

// 모달 취소 버튼
document.querySelector('.modal .cancel').addEventListener('click', () => {
    modal.style.display = 'none';
    modalBackground.style.display = 'none';
});