import postModel from "../models/postModel.js";
import memberModel from "../models/memberModel.js";

const addPost = async (req, res) => {
    const userInput = req.body;
    const member = await memberModel.getMemberById(req);

    try {
        await postModel.addPost(userInput, member.nickname);
        res.status(200).json({message: '성공적으로 수정하였습니다.'});
    } catch (error) {
        res.status(500).json({message: '예상치 못한 서버 오류가 발생하였습니다. 잠시 후 다시 시도해주세요.'});
    }
};

const showPost = async (req, res) => {
    const post = await postModel.getPostByNo(req);
    if (post) {
        res.status(200).json(post);
    } else {
        res.status(404).send("Post not found");
    }
};

const editPost = async (req, res) => {
    try {
        await postModel.editPost(req);
        res.status(200).json({message: '성공적으로 수정하였습니다.'});
    } catch (error) {
        res.status(500).json({message: '예상치 못한 서버 오류가 발생하였습니다. 잠시 후 다시 시도해주세요.'});
    }
};

export default {
    addPost,
    showPost,
    editPost
};