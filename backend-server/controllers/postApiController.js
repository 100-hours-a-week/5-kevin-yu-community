import postModel from "../models/postModel.js";
import memberModel from "../models/memberModel.js";
import commentModel from "../models/commentModel.js";
import req from "express/lib/request.js";

const methods = {
    async addPost(req, res) {
        const userInput = req.body;
        const memberId = Number(req.query.id);
        const member = await memberModel.getMemberById(memberId);

        try {
            await postModel.addPost(userInput, member.nickname);
            res.status(200).json({message: '성공적으로 수정하였습니다.'});
        } catch (error) {
            res.status(500).json({message: '예상치 못한 서버 오류가 발생하였습니다. 잠시 후 다시 시도해주세요.'});
        }
    },
    async showPost(req, res) {
        const postNo = Number(req.params.no);
        const post = await postModel.getPostByNo(postNo);

        if (post) {
            res.status(200).json(post);
        } else {
            res.status(404).send("Post not found");
        }
    },
    async editPost(req, res) {
        const postNo = Number(req.params.no);
        const userInput = req.body;

        let prevImage;
        try {
            prevImage = await postModel.editPost(postNo, userInput);
        } catch (error) {
            res.status(500).json({message: '예상치 못한 서버 오류가 발생하였습니다. 잠시 후 다시 시도해주세요.'});
        }

        res.status(200).json({
            message: '성공적으로 수정하였습니다.',
            prevImage: prevImage
        });
    },
    async deletePost(req, res) {
        const postNo = Number(req.params.no);
        try {
            const prevImage = await postModel.deletePost(postNo);
            res.status(200).json({
                message: '성공적으로 수정하였습니다.',
                prevImage: prevImage
            });
        } catch (error) {
            res.status(500).json({message: '예상치 못한 서버 오류가 발생하였습니다. 잠시 후 다시 시도해주세요.'});
        }
    },
    async showComments(req, res) {
        const postNo = req.params.no;

        try {
            const commentList = await commentModel.findCommentsByPostNo(postNo);
            res.status(200).json({commentList});
        } catch (error) {
            res.status(500).json({message: '예상치 못한 서버 오류가 발생하였습니다. 잠시 후 다시 시도해주세요.'});
        }
    },
    async addComment(req, res) {
        const postNo = Number(req.params.no);
        const member = await memberModel.getMemberById(Number(req.query.id));
        const comment = req.body.comment;

        try {
            await commentModel.saveComment(postNo, member, comment);
        } catch (error) {
            res.status(500).json({message: '댓글 등록에 실패하였습니다. 잠시 후 다시 시도해주세요.'});
        }
        res.status(200).json({message: '댓글이 성공적으로 등록되었습니다.'});
    },
    async editComment(req, res) {
        const postNo = Number(req.params.postNo);
        const commentNo = Number(req.params.commentNo);

        try {
            await commentModel.editComment(postNo, commentNo, req.body.content);
        } catch (error) {
            res.status(500).json({message: '댓글 수정에 실패했습니다. 잠시 후 다시 시도해주세요.'});
        }
        res.status(200).json({message: '댓글을 성공적으로 수정하였습니다.'});
    },
    async deleteComment(req, res) {
        const postNo = Number(req.params.postNo);
        const commentNo = Number(req.params.commentNo);

        try {
            await commentModel.deleteComment(postNo, commentNo);
        } catch (error) {
            res.status(500).json({message: '댓글 삭제에 실패했습니다. 잠시 후 다시 시도해주세요.'});
        }
        res.status(200).json({message: '댓글을 성공적으로 삭제하였습니다.'});
    }
};

export default methods;