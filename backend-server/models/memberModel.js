import path, {dirname} from 'path';
import {fileURLToPath} from 'url';
import fs from 'fs';

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

export default {
    getMembers,
    getMemberById,
    saveMember
};