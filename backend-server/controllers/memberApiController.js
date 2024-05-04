import memberModel from "../models/memberModel.js";

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
        const member = await memberModel.getMemberById(req);

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
        try {
            await memberModel.editMember(req);
        } catch (error) {
            res.status(500).json({message: '회원정보 수정에 실패했습니다. 잠시 후 다시 시도해주세요.'});
        }
        res.status(200).json({message: '회원정보 수정이 성공적으로 완료되었습니다.'});
    },
    async deleteMember(req, res) {
        let prevImage;
        try {
            prevImage = await memberModel.deleteMember(req);
        } catch (error) {
            res.status(500).json({message: '탈퇴에 실패했습니다. 잠시 후 다시 시도해주세요.'});
        }
        res.status(200).json({
            prevImage: prevImage,
            message: '회원 탈퇴를 완료했습니다. 이용해주셔서 감사합니다.'
        });
    },
    async editPassword(req, res) {
        try {
            const result = await memberModel.editMember(req);
            if (!result) {
                res.status(409).json({message: '기존 비밀번호와 동일한 비밀번호로는 변경할 수 없습니다.'});
                return;
            }
        } catch (error) {
            res.status(500).json({message: '비밀번호 수정에 실패했습니다. 잠시 후 다시 시도해주세요.'});
        }
        res.status(200).json({message: '비밀번호 수정이 성공적으로 완료되었습니다.'});
    },
};

export default methods;