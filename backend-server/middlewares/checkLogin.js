const isLoggedIn = (req, res, next) => {
    if (!req.session.member) {
        res.status(401).json({messsage: '회원 정보를 찾을 수 없습니다.'});
        return;
    }
    next();
};

module.exports = {
    isLoggedIn
}