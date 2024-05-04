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
    async loginCheck(req, res) {
        try {
            const userInput = req.body;
            const emailRegExp = /^[a-zA-Z0-9._-]+@[a-z]+\.[a-z]{2,3}$/;
            const passwordRegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,20}$/;
            if (!(emailRegExp.test(userInput.email) && passwordRegExp.test(userInput.password))) {
                res.sendStatus(400);
                return;
            }

            const response = await fetch('http://localhost:4000/json/members/login', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userInput)
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
    async editMemberInfo(req, res) {
        const response = await fetch(`http://localhost:4000/json/members?id=${req.query.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nickname: req.body.nickname,
                image: req.file !== undefined ? req.file.filename : ""
            })
        });

        const json = await response.json();
        if (response.ok) {
            res.status(200).json(json.message);
        } else {
            res.status(500).json(json.message);
        }
    },
    async deleteMember(req, res) {
        const response = await fetch(`http://localhost:4000/json/members?id=${req.query.id}`, {
            method: 'DELETE'
        });

        const json = await response.json();
        if (response.ok) {
            imageUtils.deleteImage('members', json.prevImage);
            res.status(200).json({message: json.message});
        } else {
            res.status(500).json({message: json.message});
        }
    },
    showPasswordForm(req, res) {
        res.sendFile(path.join(HTML_PATH, 'edit-password.html'));
    }
}

export default methods;