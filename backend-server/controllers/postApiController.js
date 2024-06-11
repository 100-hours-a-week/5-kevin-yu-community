const postModel = require('../models/dbPostModel.js');
const commentModel = require('../models/dbCommentModel.js');
const dbConnector = require('../models/dbConnector');

const FormData = require('form-data');
const axios = require('axios');
const dateUtils = require("../utils/dataUtils");
const {commitTransaction, rollbackTransaction} = require("../models/dbConnector");

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
        const userId = Number(req.session.user.id);

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

            await postModel.addPost(userId, userInput, imageName);
            res.status(200).json({message: '성공적으로 등록하였습니다.'});
        } catch (error) {
            res.status(500).json({message: '예상치 못한 서버 오류가 발생하였습니다. 잠시 후 다시 시도해주세요.'});
        }
    },
    async showPost(req, res) {
        const postId = Number(req.params.no);
        await postModel.increaseViews(postId);
        const post = await postModel.getPostById(postId);

        post[0].created_at = dateUtils.convertTimeFormat(post[0].created_at);

        if (post) {
            res.status(200).json(post[0]);
        } else {
            res.status(404).send("Post not found");
        }
    },
    async editPost(req, res) {
        const postId = Number(req.params.no);
        const userInput = req.body;
        const file = req.file;

        try {
            const post = await postModel.getPostById(postId);
            const prevImage = post[0].post_image;
            const imageName = file ? file.originalname : prevImage;

            await postModel.editPost(postId, userInput, imageName);
            res.status(200).json({
                message: '성공적으로 수정하였습니다.',
                prevImage: prevImage === imageName ? '' : prevImage
            });
        } catch (error) {
            res.status(500).json({message: '예상치 못한 서버 오류가 발생하였습니다. 잠시 후 다시 시도해주세요.'});
        }
    },
    async deletePost(req, res) {
        const postId = Number(req.params.no);
        try {
            await dbConnector.beginTransaction();

            const post = await postModel.getPostById(postId);
            const prevImage = post[0].post_image;

            await postModel.deletePost(postId);
            await commentModel.deleteAllComments(postId);

            await commitTransaction();

            res.status(200).json({
                message: '성공적으로 수정하였습니다.',
                prevImage: prevImage
            });
        } catch (error) {
            await rollbackTransaction();
            res.status(500).json({message: '예상치 못한 서버 오류가 발생하였습니다. 잠시 후 다시 시도해주세요.'});
        }
    },
    async showComments(req, res) {
        const postId = Number(req.params.no);
        try {
            const commentList = await commentModel.getCommentsById(postId);

            commentList.forEach(comment => {
                comment.created_at = dateUtils.convertTimeFormat(comment.created_at);
            });

            res.status(200).json(commentList);
        } catch (error) {
            res.status(500).json({message: '예상치 못한 서버 오류가 발생하였습니다. 잠시 후 다시 시도해주세요.'});
        }
    },
    async addComment(req, res) {
        const postId = Number(req.params.no);
        const userId = Number(req.session.user.id);
        const comment = req.body.comment;
        try {
            await commentModel.addComment(postId, userId, comment);
            await postModel.increaseCommentCount(postId);
            res.status(200).json({message: '댓글이 성공적으로 등록되었습니다.'});
        } catch (error) {
            res.status(500).json({message: '댓글 등록에 실패하였습니다. 잠시 후 다시 시도해주세요.'});
        }
    },
    async editComment(req, res) {
        const commentId = Number(req.params.commentNo);
        try {
            await commentModel.editComment(commentId, req.body.content);
            res.status(200).json({message: '댓글을 성공적으로 수정하였습니다.'});
        } catch (error) {
            res.status(500).json({message: '댓글 수정에 실패했습니다. 잠시 후 다시 시도해주세요.'});
        }
    },
    async deleteComment(req, res) {
        const postId = Number(req.params.postNo);
        const commentId = Number(req.params.commentNo);
        try {
            await commentModel.deleteComment(commentId);
            await postModel.decreaseCommentCount(postId);
            res.status(200).json({message: '댓글을 성공적으로 삭제하였습니다.'});
        } catch (error) {
            res.status(500).json({message: '댓글 삭제에 실패했습니다. 잠시 후 다시 시도해주세요.'});
        }
    }
};

module.exports = methods;