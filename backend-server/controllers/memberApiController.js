import memberModel from "../models/memberModel.js";
import res from "express/lib/response.js";

const loginCheck = async (req, res) => {
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
};

const join = async (req, res) => {
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
};

const findMemberById = async (req, res) => {
    const member = await memberModel.getMemberById(req);

    if (member === undefined) {
        res.status(404).json({message: '회원정보가 존재하지 않습니다.'});
    } else {
        res.status(200).json(member);
    }
};

const checkDuplication = async (req, res) => {
    const userNickname = req.query.nickname;
    const members = await memberModel.getMembers();
    const isNicknameExist = members.some(member => member.nickname === userNickname);

    if (isNicknameExist) {
        res.status(409).json({message: '이미 존재하는 닉네임입니다.'});
    } else {
        res.status(200).json({message: '사용 가능한 닉네임입니다.'});
    }
};

const editMember = async (req, res) => {
    const userInput = req.body;
    try {
        await memberModel.editMember(req, userInput);
    } catch (error) {
        res.status(500).json({message: '회원정보 수정에 실패했습니다. 잠시 후 다시 시도해주세요.'});
    }
    res.status(200).json({message: '회원정보 수정이 성공적으로 완료되었습니다.'});
};

export default {
    loginCheck,
    join,
    findMemberById,
    checkDuplication,
    editMember
};