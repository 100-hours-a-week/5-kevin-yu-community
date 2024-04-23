const image = document.querySelector('.image');
const emailInput = document.querySelector('.email p:nth-child(2)');
const nicknameInput = document.querySelector('#nickname');
const helper = document.querySelector('.helper');
const editButton = document.querySelector('.button');

const nicknameList = []; // 회원들의 닉네임을 저장하는 리스트
document.addEventListener('DOMContentLoaded', () => {
    fetch('/json/member')
        .then(response => response.json())
        .then(data => {
            // 리스트에 회원의 닉네임을 하나씩 저장
            for (let m of data.members) {
                nicknameList.push(m.nickname);
            }
            return data.members[0]; // 임시로 멤버 지정
        })
        .then(member => {
            image.src = `/images/members/${member.image}`;
            emailInput.textContent = member.email;
            nicknameInput.value = member.nickname;
        });
});

// 도움말을 보여주는 함수
function showHelperText(text) {
    helper.textContent = text;
    helper.style.visibility = 'visible';
}

const finishButton = document.querySelector('.finish');
function changeFinishButton(state) {
    finishButton.style.backgroundColor = state ? '#7f6aee' : '#aca0eb';
    finishButton.style.cursor = state ? 'pointer' : 'default';
}

const toast = document.querySelector('.toast-message');
editButton.addEventListener('click', () => {
    const nickname = nicknameInput.value;

    if (nickname.trim() === '') {
        showHelperText('*닉네임을 입력해주세요.');
        changeFinishButton(false);
    } else if (nicknameList.includes(nickname)) {
        showHelperText('*중복된 닉네임입니다.');
        changeFinishButton(false);
    } else if (nickname.length > 10) {
        showHelperText('*닉네임은 최대 10자 까지 작성 가능합니다.');
        changeFinishButton(false);
    } else {
        helper.style.visibility = 'hidden';
        toast.classList.add('active'); // 클래스를 통해 토스트 메시지를 제어
        setTimeout(() => {
            toast.classList.remove('active');
        }, 1000);
        // 수정 완료 했을 때만 버튼 상태 변경
        changeFinishButton(true);
    }
});

const modal = document.querySelector('.modal');
const modalBackground = document.querySelector('.modal-background');
function showModal() {
    modal.style.display = 'flex';
    modalBackground.style.display = 'flex';
}

document.querySelector('.quit').addEventListener('click', (e) => {
    e.preventDefault();
    showModal();
});

document.querySelector('.modal .confirm').addEventListener('click', () => {
    window.location.href = '/login';
});

// 모달 취소 버튼
document.querySelector('.modal .cancel').addEventListener('click', () => {
    modal.style.display = 'none';
    modalBackground.style.display = 'none';
});