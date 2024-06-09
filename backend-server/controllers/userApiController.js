const memberModel = require("../models/jsonUserModel.js");
const postModel = require("../models/jsonPostModel.js");
const commentModel = require("../models/jsonCommentModel.js");

const FormData = require('form-data');
const axios = require('axios');
const res = require("express/lib/response");
const req = require("express/lib/request");

async function sendFileToClientServer(file, prevImageName) {
    const formData = new FormData();

    formData.append('prevImageName', prevImageName);
    formData.append('file', file.buffer, {filename: file.originalname, contentType: file.mimeType});

    const response = await axios.patch('http://localhost:3000/users', formData, {
        headers: formData.getHeaders(),
    });

    return response.data;
}

const methods = {
    async loginCheck(req, res) {
        const userInput = req.body;
        const emailRegExp = /^[a-zA-Z0-9._-]+@[a-z]+\.[a-z]{2,3}$/;
        const passwordRegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,20}$/;
        if (!(emailRegExp.test(userInput.email) && passwordRegExp.test(userInput.password))) {
            res.status(400).json({message: '올바르지 않은 입력입니다.'});
            return;
        }

        const member = await memberModel.findMemberByUserInfo(userInput);
        if (member) {
            req.session.member = {
                id: member.id,
                nickname: member.nickname,
            }
            res.status(200).json({message: '로그인 성공'});
        } else {
            res.status(401).json({
                message: '회원 정보를 찾을 수 없습니다.'
            });
        }
    },
    logout(req, res) {
        req.session.destroy((err) => {
            if (err) {
                res.status(500).json({message: '로그아웃에 실패했습니다. 잠시 후 다시 시도해주세요.'});
            } else {
                res.status(200).json({message: '로그아웃 성공'});
            }
        });
    },
    async join(req, res) {
        const userInput = req.body;
        const members = await memberModel.getMembers();

        const isEmailExist = members.some(member => member.email === userInput.email);
        const isNicknameExist = members.some(member => member.nickname === userInput.nickname);
        if (isEmailExist) {
            res.status(409).json({message: '이미 존재하는 이메일입니다.'});
        } else if (isNicknameExist) {
            res.status(409).json({message: '이미 존재하는 닉네임입니다.'});
        } else {
            await memberModel.saveMember(userInput);
            res.status(201).json({
                message: 'Join successful'
            });
        }
    },
    async findMemberById(req, res) {
        const memberId = Number(req.session.member.id);
        const member = await memberModel.getMemberById(memberId);

        if (member === undefined) {
            res.status(404).json({message: '회원정보가 존재하지 않습니다.'});
        } else {
            res.status(200).json(member);
        }
    },
    async checkDuplication(req, res) {
        const userNickname = req.query.nickname;
        const members = await memberModel.getMembers();
        const isNicknameExist = members.some(member => member.nickname === userNickname);

        // 기존의 닉네임이 아니면서 다른 사람들과 겹치면 만들 수 없는 닉네임
        // -> 닉네임은 그대로 두고 사진만 변경할 수 있게 하기 위해
        if (isNicknameExist && userNickname !== req.session.member.nickname) {
            res.status(409).json({message: '이미 존재하는 닉네임입니다.'});
        } else {
            res.status(200).json({message: '사용 가능한 닉네임입니다.'});
        }
    },
    async editMember(req, res) {
        const memberId = req.session.member.id;
        const userInput = req.body;
        const file = req.file;

        if (!file && userInput.nickname === req.session.member.nickname) {
            res.status(400).json({message: '변경사항이 없습니다.'});
            return;
        }

        let imageName;
        try {
            const member = await memberModel.getMemberById(memberId);
            const prevImageName = member.image;

            if (file) {
                const data = await sendFileToClientServer(file, prevImageName);
                imageName = data.imageName;

                if (!imageName) {
                    throw new Error(); // 바로 catch문으로 이동시키려는 의도
                }
            }

            const prevNickname = await memberModel.editMember(memberId, userInput.nickname, imageName);
            const newNickname = userInput.nickname;
            await postModel.changeNickname(prevNickname, newNickname);
            await commentModel.changeNickname(prevNickname, newNickname);

            // 세션에 저장된 닉네임 정보를 새로운 닉네임으로 바꿔줌
            req.session.member.nickname = newNickname;

            res.status(200).json({
                message: '회원정보 수정이 성공적으로 완료되었습니다.'
            });
        } catch (error) {
            res.status(500).json({message: '회원정보 수정에 실패했습니다. 잠시 후 다시 시도해주세요.'});
        }
    },
    async deleteMember(req, res) {
        const memberId = req.session.member.id;
        let prevImage;
        try {
            prevImage = await memberModel.deleteMember(memberId);

            await axios.delete(`http://localhost:3000/users?image=${prevImage}`);

            res.status(200).json({
                message: '회원 탈퇴를 완료했습니다. 이용해주셔서 감사합니다.'
            });
        } catch (error) {
            res.status(500).json({message: '탈퇴에 실패했습니다. 잠시 후 다시 시도해주세요.'});
        }
    },
    async editPassword(req, res) {
        const memberId = req.session.member.id;
        const userInput = req.body;
        try {
            const result = await memberModel.editPassword(memberId, userInput);
            if (!result) {
                res.status(409).json({message: '기존 비밀번호와 동일한 비밀번호로는 변경할 수 없습니다.'});
                return;
            }
            res.status(200).json({message: '비밀번호 수정이 성공적으로 완료되었습니다.'});
        } catch (error) {
            res.status(500).json({message: '비밀번호 수정에 실패했습니다. 잠시 후 다시 시도해주세요.'});
        }
    },
    async getProfileImages(req, res) {
        try {
            const profileImages = await memberModel.getProfileImage();
            res.status(200).json({profileImages});
        } catch (error) {
            res.status(500).json({message: '프로필 사진 조회에 실패했습니다. 잠시후 다시 시도해주세요.'});
        }
    },
};

module.exports = methods;