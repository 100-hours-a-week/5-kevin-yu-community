// 헤더
// 프로필 이미지 클릭 시
document.querySelector('.header-image img').addEventListener('click', () => {
    const menu = document.querySelector('.menu');
    // 메뉴 껐다 켜는 기능
    if (menu.style.display === 'block') {
        menu.style.display = 'none';
    } else {
        menu.style.display = 'block';
    }
});

// 메뉴 클릭 시 해당하는 페이지로 이동
document.querySelectorAll('.menu div').forEach(div => {
    div.addEventListener('click', () => {
        let path;
        switch (div.textContent) {
            case '회원정보수정':
                path = '/member';
                break;
            case '비밀번호수정':
                path = '/password';
                break;
            case '로그아웃':
                path = '/member/login';
        }
        window.location.href = path;
    });
});

// 사용자 프로필 이미지명 받아와서 출력
document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    const response = await fetch(`http://localhost:4000/json/member/profile?id=${id}`);
    const data = await response.json();
    
    document.querySelector('.header-image img').src = `../images/members/${data.image}`;
});