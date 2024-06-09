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
    div.addEventListener('click', async () => {
        let path;
        switch (div.textContent) {
            case '회원정보수정':
                path = '/users/info';
                break;
            case '비밀번호수정':
                path = '/users/password';
                break;
            case '로그아웃':
                const response = await fetch('http://localhost:4000/json/users/logout', {
                    credentials: 'include',
                });
                const data = await response.json();
                if (response.ok) {
                    path = '/users/login';
                } else {
                    alert(data.message);
                }
        }
        window.location.href = path + window.location.search;
    });
});

// 사용자 프로필 이미지명 받아와서 출력
document.addEventListener('DOMContentLoaded', async () => {
    const response = await fetch(`http://localhost:4000/json/users`, {
        credentials: 'include',
    });

    if (response.status === 401) {
        window.location.href = '/users/login';
    }

    const json = await response.json();
    
    document.querySelector('.header-image img').src = `/images/users/${json.image}`;
});