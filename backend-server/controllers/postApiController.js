import path, {dirname} from 'path';
import {fileURLToPath} from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.resolve(dirname(__filename), '..');
const JSON_PATH = path.join(__dirname, "json/board.json");

// board.json을 읽어서, JS 객체로 변환하는 로직
// TODO 추후 모델로 분리해야 함
async function getBoard() {
    const file = await fs.promises.readFile(JSON_PATH, 'utf8');
    return JSON.parse(file).posts;
}

async function getPostByNo(req) {
    const postNo = Number(req.params.no);
    const board = await getBoard();
    return board.find(post => post.no === postNo);
}

// TODO 추후 모델로 분리해야 함
async function saveBoard(board) {
    const json = JSON.stringify({posts: board}, null, 2);
    await fs.promises.writeFile(JSON_PATH, json);
}

function getCurrentTime() {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // month는 0부터 시작하기 때문에 +1이 필요함
    const day = String(now.getDate()).padStart(2, '0');

    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

const methods = {
    showPost: async (req, res) => {
        const post = await getPostByNo(req);
        if (post) {
            res.status(200).json(post);
        } else {
            res.status(404).send("Post not found");
        }
    },
    editPost: async (req, res) => {
        const postNo = Number(req.params.no);
        const board = await getBoard();
        const post = board.find(post => post.no === postNo);
        const userInput = req.body;

        try {
            post.title = userInput.title;
            post.content = userInput.content;
            post.regDt = getCurrentTime();
            await saveBoard(board);
            res.status(200).json({message: '성공적으로 수정하였습니다.'});
        } catch (error) {
            res.status(500).json({message: '예상치 못한 서버 오류가 발생하였습니다. 잠시 후 다시 시도해주세요.'});
        }
    }
}

export default methods;