import path, {dirname} from 'path';
import {fileURLToPath} from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.resolve(dirname(__filename), '..');
const JSON_PATH = path.join(__dirname, "json/member.json");

// member.json을 읽어서, JS 객체로 변환하는 로직
const getMembers = async () => {
    const file = await fs.promises.readFile(JSON_PATH, 'utf8');
    return JSON.parse(file).members;
}

const method = {
    loginCheck: async (req, res) => {
        const userInput = req.body;
        const members = await getMembers();

        const member = members.find(member => member.email === userInput.email && member.password === userInput.password);
        if (member) {
            res.status(200).json({
                message: 'Login successful',
                userId: member.id
            });
        } else {
            res.status(401).json({
                message: 'Login Fail'
            });
        }
    },
    join: async (req, res) => {
        const userInput = req.body;
        const members = await getMembers();

        const isEmailExist = members.some(member => member.email === userInput.email);
        const isNicknameExist = members.some(member => member.nickname === userInput.nickname);
        if (isEmailExist) {
            res.status(409).json({
                message: 'Email already exists'
            });
        } else if (isNicknameExist) {
            res.status(409).json({
                message: 'Nickname already exists'
            });
        } else {
            const newMember = {
                id: members.length,
                email: userInput.email,
                password: userInput.password,
                nickname: userInput.nickname,
                image: userInput.image
            };
            members.push(newMember);
            await fs.promises.writeFile(JSON_PATH, JSON.stringify({members}, null, 2));
            res.status(201).json({
                message: 'Join successful'
            });
        }
    },
    profileImage: async (req, res) => {
        const members = await getMembers();
        console.log(`members: ${members}`);
        const member = members.find(member => member.id === Number(req.query.id));
        res.json({
            image: member.image
        });
    }
}

export default method;