const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');

// 게시글 작성 페이지로 이동
document.querySelector('.post-button').addEventListener('click', () => {
    window.location.href = `/posts/add-form?id=${id}`;
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
function makePostElement(data, post, imageMap) {
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
                    <div>조회수 ${hit}</div>s
                </div>
                <div class="date">${post.regDt}</div>
            </div>
        </section>
        <hr class="post-horizontal" />
        <section class="writer">
            <img class="image" src="../images/members/${imageMap.get(post.writer)}" alt="">
            <div class="nickname">${post.writer}</div>
        </section>`;
    // 생성된 요소를 반환
    return article;
}

// 회원들의 닉네임과 프로필 이미지를 Map 형태로 반환
async function getImageMap() {
    const memberResponse = await fetch('http://localhost:4000/json/members/images');
    const members = await memberResponse.json();

    return members.profileImages.reduce((memberMap, member) => {
        memberMap.set(member.nickname, member.image);
        return memberMap;
    }, new Map());
}

document.addEventListener('DOMContentLoaded', async () => {
    const boardResponse = await fetch('http://localhost:4000/json/board')
    const board = await boardResponse.json();

    const imageMap = await getImageMap();

    const postList = document.querySelector('.post-list');
    board.forEach(post => {
        // JSON에서 가져온 데이터로 새로운 요소를 생성하고
        let newPostElement = makePostElement(board, post, imageMap);
        // 기존의 요소 밑에 추가함
        postList.appendChild(newPostElement);
    });
});

// 이벤트 위임을 통해 특정 게시글로 이동
document.querySelector('.post-list').addEventListener('click', (e) => {
    // closest() -> 가장 가까운 부모 요소 중 입력된 선택자에 해당하는 요소
    const boardNo = e.target.closest('.post').childNodes[1].value;
    window.location.href = `/posts/${boardNo}?id=${id}`;
});