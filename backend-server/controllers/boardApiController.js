const postModel = require('../models/dbPostModel.js');
const dateUtils = require('../utils/dataUtils');

const methods = {
    async showBoard(req, res) {
        const board = await postModel.getBoard();

        board.forEach(post => {
            post.created_at = dateUtils.convertTimeFormat(post.created_at);
        });

        if (!board) {
            res.status(500).json({message: '예상치 못한 서버 오류가 발생하였습니다. 잠시 후 다시 시도해주세요.'});
        } else {
            res.status(200).json(board);
        }
    }
}

module.exports = methods;