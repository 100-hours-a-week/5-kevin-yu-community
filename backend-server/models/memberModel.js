import path, {dirname} from 'path';
import {fileURLToPath} from 'url';
import fs from 'fs';
import req from "express/lib/request.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.resolve(dirname(__filename), '..');
const JSON_PATH = path.join(__dirname, "json/member.json");

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

const getMemberById = async (req) => {
   const members = await getMembers();
    return members.find(member => member.id === Number(req.query.id));
};

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

    await fs.promises.writeFile(JSON_PATH, JSON.stringify({sequence: sequence + 1, members : members}, null, 2));
};

const editMember = async (req) => {
    const members = await getMembers();
    const member = members.find(member => member.id === Number(req.query.id));
    const userInput = req.body;

    const nickname = userInput.nickname;
    const image = userInput.image;
    const password = userInput.password;

    if (nickname !== '' && nickname !== undefined) {
        member.nickname = nickname;
    }
    if (image !== '' && image !== undefined) {
        member.image = image;
    }
    if (password !== '' && password !== undefined) {
        if (member.password === password) {
            return false;
        }
        member.password = password;
    }

    await fs.promises.writeFile(JSON_PATH, JSON.stringify({sequence: await getSequence(), members: members}, null, 2));
    return true;
};

const deleteMember = async (req) => {
    const members = await getMembers();

    const id = Number(req.query.id);
    const index = members.findIndex(member => member.id === id);
    const prevImage = members[index].image;
    if (index !== -1) {
        members.splice(index, 1);
    } else {
        throw new Error('회원 정보를 찾을 수 없습니다.');
    }

    await fs.promises.writeFile(JSON_PATH, JSON.stringify({sequence: await getSequence(), members: members}, null, 2));
    return prevImage;
};

export default {
    getMembers,
    getMemberById,
    saveMember,
    editMember,
    deleteMember
};