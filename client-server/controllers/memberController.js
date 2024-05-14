import fetch from 'node-fetch';
import path, {dirname} from 'path';
import {fileURLToPath} from "url";
import imageUtils from "../utils/ImageUtils.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.resolve(dirname(__filename), '..');
const HTML_PATH = path.join(__dirname, 'public/html');

const methods = {
    showLoginForm(req, res) {
        res.sendFile(path.join(HTML_PATH, 'login.html'));
    },
    // Deprecated: 필요 없는 코드가 되었음
    async loginCheck(req, res) {
        try {
            const response = await fetch('http://localhost:4000/json/members/login', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(req.body)
            });

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
    showJoinForm(req, res) {
        res.sendFile(path.join(HTML_PATH, 'join.html'));
    },
    async join(req, res) {
        const newUser = {
            ...req.body,
            image: req.file.filename
        }

        const response = await fetch('http://localhost:4000/json/members/join', {
            method: 'POST',
            body: JSON.stringify(newUser),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (response.status === 409) {
            imageUtils.deleteImage('members', req.file.filename);
        }

        response.json().then(data => {
            res.status(response.status).json(data);
        });
    },
    showEditInfoForm(req, res) {
        res.sendFile(path.join(HTML_PATH, 'edit-member.html'));
    },
    async editMemberImage(req, res) {
        try {
            imageUtils.deleteImage('members', req.body.prevImageName);
            res.status(200).json({imageName: req.file.filename});
        } catch (error) {
            res.status(500).json({message: '이미지 삭제에 실패했습니다.'});
        }
    },
    async deleteMember(req, res) {
        try {
            imageUtils.deleteImage('members', req.query.image);
            res.status(200).json({})
        } catch (error) {
            res.status(500).json({message: '이미지 삭제에 실패했습니다.'});
        }
    },
    showPasswordForm(req, res) {
        res.sendFile(path.join(HTML_PATH, 'edit-password.html'));
    }
}

export default methods;