import path, {dirname} from 'path';
import {fileURLToPath} from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.resolve(dirname(__filename), '..');
const JSON_PATH = path.join(__dirname, "json/board.json");

// board.json을 읽어서, JS 객체로 변환하는 로직
const getBoard = async () => {
    const file = await fs.promises.readFile(JSON_PATH, 'utf8');
    return JSON.parse(file).posts;
}

const methods = {
    showBoard: async (req, res) => {
        const board = await getBoard();
        res.status(200).json(board);
    }
}

export default methods;