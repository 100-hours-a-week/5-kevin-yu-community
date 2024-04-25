import fetch from 'node-fetch';
import fs from 'fs';
import path, {dirname} from 'path';
import {fileURLToPath} from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.resolve(dirname(__filename), '..');

const methods = {
    loginCheck: async (req, res) => {
        try {
            // JSON API 서버에 사용자가 입력한 계정 정보가 올바른지 확인해달라고 요청
            const userInput = req.body;

            // 서버 측에서 사용자 입력이 유효한지 한 번 더 검증
            const emailRegExp = /^[a-zA-Z0-9._-]+@[a-z]+\.[a-z]{2,3}$/;
            const passwordRegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,20}$/;
            if (!(emailRegExp.test(userInput.email) && passwordRegExp.test(userInput.password))) {
                res.sendStatus(400);
                return;
            }

            const response = await fetch('http://localhost:4000/json/member/login', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userInput)
            });

            // 만약 JSON API 서버가 계정 정보가 있다고 하면, 사용자 고유번호를 클라이언트에 반환
            const result = await response.json();
            if (response.ok) {
                res.status(200).json({
                    id: result.userId
                });
            } else {
                res.sendStatus(401);
            }
        } catch (error) {
            res.sendStatus(500);
        }
    },
    join: async (req, res) => {
        // 사용자가 입력한 값과 이미지 파일의 이름을 결합한 새로운 사용자 객체
        const newUser = {
            ...req.body,
            image: req.file.filename
        }
        
        const response = await fetch('http://localhost:4000/json/member/join', {
            method: 'POST',
            body: JSON.stringify(newUser),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        // 만약 이메일 또는 닉네임이 중복되면, 저장해뒀던 사진을 제거
        if (response.status === 409) {
            const filePath = path.join(__dirname, 'public/images/members', req.file.filename);
            fs.unlink(filePath, err => {
                if (err) {
                    console.error(`Cannot delete file: ${err}`);
                }
            });
        }

        response.json().then(data => {
            res.status(response.status).json(data);
        });
    }
}

export default methods;