import {fileURLToPath} from "url";
import path, {dirname} from "path";

const __filename = fileURLToPath(import.meta.url);
// path.resolve -> __dirname이 route의 하위 경로이므로, route의 상위 디렉토리로 이동해야 public에 접근 가능
const __dirname = path.resolve(dirname(__filename), '..');
const HTML_PATH = path.join(__dirname, 'public/html');

const methods = {
    showPost: (req, res) => {
        res.sendFile(path.join(HTML_PATH, 'post.html'));
    },
    showAddForm: (req, res) => {
        res.sendFile(path.join(HTML_PATH, 'add-post.html'));
    },
    showEditForm: (req, res) => {
        res.sendFile(path.join(HTML_PATH, 'edit-post.html'));
    },
    editPost: async (req, res) => {
        const postNo = Number(req.params.no);
        const userInput = req.body;

        // TODO 사용자 입력 검증 로직 추가
        if (userInput.title.trim() === '' || userInput.content.trim() === '') {
            res.status(400).json({message: '사용자 입력이 올바르지 않습니다.'});
        }

        const response = await fetch(`http://localhost:4000/json/posts/${postNo}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userInput)
        });

        if (response.ok) {
            const data = await response.json();
            res.status(200).json(data);
        } else {
            const json = await response.json();
            res.status(response.status).json({message: json.message});
        }
    }
}

export default methods;