import path, {dirname} from "path";
import fs from "fs";
import {fileURLToPath} from "url";

const __filename = fileURLToPath(import.meta.url);
// path.resolve -> __dirname이 route의 하위 경로이므로, route의 상위 디렉토리로 이동해야 public에 접근 가능
const __dirname = path.resolve(dirname(__filename), '..');

const deleteImage = (filename) => {
    const filePath = path.join(__dirname, 'public/images/members', filename);
    fs.unlink(filePath, err => {
        if (err) {
            console.error(`Cannot delete file: ${err}`);
        }
    });
};

export default {
    deleteImage
};