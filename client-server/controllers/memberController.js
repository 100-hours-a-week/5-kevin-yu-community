import fetch from 'node-fetch';

const methods = {
    loginCheck: async (req, res) => {
        try {
            // JSON API 서버에 사용자가 입력한 계정 정보가 올바른지 확인해달라고 요청
            const userInput = req.body;

            // 서버 측에서 사용자 입력이 유효한지 한 번 더 검증
            const emailRegExp = /^[a-zA-Z0-9._-]+@[a-z]+\.[a-z]{2,3}$/;
            const passwordRegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,20}$/;
            if (!(emailRegExp.test(userInput.email) && passwordRegExp.test(userInput.password))) {
                res.sendStatus(400);
                return;
            }

            const response = await fetch('http://localhost:4000/json/member/login', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userInput)
            });

            // 만약 JSON API 서버가 계정 정보가 있다고 하면, 사용자 고유번호를 클라이언트에 반환
            const result = await response.json();
            if (result.success) {
                res.json({id: result.userId});
            } else {
                res.sendStatus(401);
            }
        } catch (error) {
            res.sendStatus(500);
        }
    }
}

export default methods;