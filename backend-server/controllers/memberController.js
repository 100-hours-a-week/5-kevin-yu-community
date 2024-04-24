import path from 'path';
import {fileURLToPath} from 'url';
import {dirname} from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.resolve(dirname(__filename), '..');

const JSON_PATH = path.join(__dirname, "json/member.json");
const method = {
    loginCheck: async (req, res) => {
        const userInput = req.body; // 사용자가 입력한 이메일 & 비밀번호
        const file = fs.readFileSync(JSON_PATH, 'utf8'); // member.json 문자열
        const members = JSON.parse(file).members; // member.json을 객체로 변경

        // 회원정보에서 고객이 입력한 아이디, 비밀번호와 일치하는 데이터 있는지 확인하고 반환
        const member = members.find(member => member.email === userInput.email && member.password === userInput.password);
        if (member) {
            res.json({ // 만약 일치하는 회원이 있으면, 회원 고유번호 반환
                success: true,
                message: 'Login successful',
                userId: member.id
            });
        } else {
            res.json({
                succes: false,
                message: 'Login Fail'
            })
        }
    }
}

export default method;