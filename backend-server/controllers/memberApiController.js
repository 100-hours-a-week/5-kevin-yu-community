import memberModel from "../models/memberModel.js";
import req from "express/lib/request.js";
import postModel from "../models/postModel.js";
import commentModel from "../models/commentModel.js";

const methods = {
    async loginCheck(req, res) {
        const userInput = req.body;
        const members = await memberModel.getMembers();

        const member = members.find(member =>
            member.email === userInput.email && member.password === userInput.password);

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
        const memberId = Number(req.query.id);
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

        if (isNicknameExist) {
            res.status(409).json({message: '이미 존재하는 닉네임입니다.'});
        } else {
            res.status(200).json({message: '사용 가능한 닉네임입니다.'});
        }
    },
    async editMember(req, res) {
        const memberId = Number(req.query.id);
        const userInput = req.body;

        try {
            const prevNickname = await memberModel.editMember(memberId, userInput);
            const newNickname = userInput.nickname;
            await postModel.changeNickname(prevNickname, newNickname);
            await commentModel.changeNickname(prevNickname, newNickname)
            res.status(200).json({message: '회원정보 수정이 성공적으로 완료되었습니다.'});
        } catch (error) {
            res.status(500).json({message: '회원정보 수정에 실패했습니다. 잠시 후 다시 시도해주세요.'});
        }
    },
    async deleteMember(req, res) {
        const memberId = Number(req.query.id);
        let prevImage;
        try {
            prevImage = await memberModel.deleteMember(memberId);
            res.status(200).json({
                prevImage: prevImage,
                message: '회원 탈퇴를 완료했습니다. 이용해주셔서 감사합니다.'
            });
        } catch (error) {
            res.status(500).json({message: '탈퇴에 실패했습니다. 잠시 후 다시 시도해주세요.'});
        }
    },
    async editPassword(req, res) {
        const memberId = Number(req.query.id);
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
};

export default methods;