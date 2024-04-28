import memberModel from "../models/memberModel.js";

const method = {
    loginCheck: async (req, res) => {
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
    join: async (req, res) => {
        const userInput = req.body;
        const members = await memberModel.getMembers();

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
            await memberModel.saveMember(userInput);
            res.status(201).json({
                message: 'Join successful'
            });
        }
    },
    profileImage: async (req, res) => {
        const member = await memberModel.getMemberById(req);

        if (member === undefined) {
            res.status(404).json({message: '회원정보가 존재하지 않습니다.'});
        } else {
            res.status(200).json({image: member.image});
        }
    }
}

export default method;