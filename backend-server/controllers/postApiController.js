const postModel = require("../models/jsonPostModel.js");
const memberModel = require("../models/jsonMemberModel.js");
const commentModel = require("../models/jsonCommentModel.js");

const FormData = require('form-data');
const axios= require('axios');

async function sendFileToClientServer(fileBuffer, fileName, mimeType) {
    const formData = new FormData();

    formData.append('file', fileBuffer, {filename: fileName, contentType: mimeType});

    const response = await axios.post('http://localhost:3000/posts', formData, {
        headers: formData.getHeaders(),
    });

    return response.data;
}

const methods = {
    async addPost(req, res) {
        const userInput = req.body;
        const file = req.file;
        const member = await memberModel.getMemberById(req.session.member.id);

        let imageName = file ? file.originalname : '';
        try {
            // 만약 사용자가 이미지를 업로드했다면, 클라이언트 서버에 저장해줄 것을 요청
            if (imageName !== '') {
                const data = await sendFileToClientServer(file.buffer, imageName, file.mimeType);
                imageName = data.imageName;

                if (!imageName) {
                    throw new Error(); // 바로 catch문으로 이동시키려는 의도
                }
            }

            const postNo = await postModel.addPost(userInput, imageName, member.nickname);
            await commentModel.makeCommentObject(postNo);
            res.status(200).json({message: '성공적으로 등록하였습니다.'});
        } catch (error) {
            res.status(500).json({message: '예상치 못한 서버 오류가 발생하였습니다. 잠시 후 다시 시도해주세요.'});
        }
    },
    async showPost(req, res) {
        const postNo = Number(req.params.no);
        await postModel.increaseHit(postNo);
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
            res.status(200).json({
                message: '성공적으로 수정하였습니다.',
                prevImage: prevImage
            });
        } catch (error) {
            res.status(500).json({message: '예상치 못한 서버 오류가 발생하였습니다. 잠시 후 다시 시도해주세요.'});
        }
    },
    async deletePost(req, res) {
        const postNo = Number(req.params.no);
        try {
            const prevImage = await postModel.deletePost(postNo);
            await commentModel.deleteCommentObject(postNo);
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
        const member = await memberModel.getMemberById(req.session.member.id);
        const comment = req.body.comment;
        try {
            const commentCount = await commentModel.saveComment(postNo, member, comment);
            await postModel.updateCommentCount(postNo, commentCount);
            res.status(200).json({message: '댓글이 성공적으로 등록되었습니다.'});
        } catch (error) {
            res.status(500).json({message: '댓글 등록에 실패하였습니다. 잠시 후 다시 시도해주세요.'});
        }
    },
    async editComment(req, res) {
        const postNo = Number(req.params.postNo);
        const commentNo = Number(req.params.commentNo);
        try {
            await commentModel.editComment(postNo, commentNo, req.body.content);
            res.status(200).json({message: '댓글을 성공적으로 수정하였습니다.'});
        } catch (error) {
            res.status(500).json({message: '댓글 수정에 실패했습니다. 잠시 후 다시 시도해주세요.'});
        }
    },
    async deleteComment(req, res) {
        const postNo = Number(req.params.postNo);
        const commentNo = Number(req.params.commentNo);
        try {
            const commentCount = await commentModel.deleteComment(postNo, commentNo);
            await postModel.updateCommentCount(postNo, commentCount);
            res.status(200).json({message: '댓글을 성공적으로 삭제하였습니다.'});
        } catch (error) {
            res.status(500).json({message: '댓글 삭제에 실패했습니다. 잠시 후 다시 시도해주세요.'});
        }
    }
};

module.exports = methods;