const path = require('path');
const fs = require('fs');

const JSON_PATH = path.join(__dirname, "..", "json/user.json");

const getMemberJson = async () => {
    const file = await fs.promises.readFile(JSON_PATH, 'utf8');
    return JSON.parse(file);
};

const getSequence = async () => {
    return getMemberJson()
        .then(json => json.sequence);
};

const getMembers = async () => {
    return getMemberJson()
        .then(json => json.members);
};

const getMemberById = async (memberId) => {
    const members = await getMembers();
    return members.find(member => member.id === memberId);
};

const getProfileImage = async () => {
    const members = await getMembers();
    return members.map(member => ({
        nickname: member.nickname,
        image: member.image
    }));
};

const findMemberByUserInfo = async (userInput) => {
    const members = await getMembers();
    return members.find(member =>
        member.email === userInput.email && member.password === userInput.password);
}

const saveMember = async (userInput) => {
    const members = await getMembers();
    const sequence = await getSequence();

    const newMember = {
        id: sequence,
        email: userInput.email,
        password: userInput.password,
        nickname: userInput.nickname,
        image: userInput.image
    };
    members.push(newMember);

    await fs.promises.writeFile(JSON_PATH, JSON.stringify({sequence: sequence + 1, members: members}, null, 2));
};

const editMember = async (memberId, nickname, image) => {
    const members = await getMembers();
    const member = members.find(member => member.id === memberId);

    const prevNickname = member.nickname; // 변경하기 전 닉네임
    if (nickname !== '' && nickname !== undefined) {
        member.nickname = nickname;
    }

    if (image !== '' && image !== undefined) {
        member.image = image;
    }

    await fs.promises.writeFile(JSON_PATH, JSON.stringify({sequence: await getSequence(), members: members}, null, 2));
    return prevNickname;
};

const editPassword = async (memberId, userInput) => {
    const members = await getMembers();
    const member = members.find(member => member.id === memberId);

    const password = userInput.password;
    if (password !== '' && password !== undefined) {
        if (member.password === password) {
            return false;
        }
        member.password = password;
    }

    await fs.promises.writeFile(JSON_PATH, JSON.stringify({sequence: await getSequence(), members: members}, null, 2));
    return true;
};

const deleteMember = async (memberId) => {
    const members = await getMembers();

    const index = members.findIndex(member => member.id === memberId);
    const prevImage = members[index].image;
    if (index !== -1) {
        members.splice(index, 1);
    } else {
        throw new Error('회원 정보를 찾을 수 없습니다.');
    }

    await fs.promises.writeFile(JSON_PATH, JSON.stringify({sequence: await getSequence(), members: members}, null, 2));
    return prevImage;
};

module.exports = {
    getMembers,
    getMemberById,
    getProfileImage,
    findMemberByUserInfo,
    saveMember,
    editMember,
    editPassword,
    deleteMember,
};