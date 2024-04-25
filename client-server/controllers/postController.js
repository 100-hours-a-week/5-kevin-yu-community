import {fileURLToPath} from "url";
import path, {dirname} from "path";

const __filename = fileURLToPath(import.meta.url);
// path.resolve -> __dirname이 route의 하위 경로이므로, route의 상위 디렉토리로 이동해야 public에 접근 가능
const __dirname = path.resolve(dirname(__filename), '..');
const HTML_PATH = path.join(__dirname, 'public/html');

const methods = {
    showPost: async (req, res) => {
        res.sendFile(path.join(HTML_PATH, 'post.html'));
    }
}

export default methods;