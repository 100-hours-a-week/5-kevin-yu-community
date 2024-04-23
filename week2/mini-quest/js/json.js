import readline from 'readline-sync';
import fileSystem from 'fs';

const name = readline.question('이름: ');
const age = parseInt(readline.question('나이: '));
const email = readline.question('이메일: ');
const telNo = readline.question('전화번호: ');

const kevin = {
    "name": name,
    "age": age,
    "email": email,
    "telNo": telNo
}

function createJson(object) {
    const jsonString = JSON.stringify(kevin);
    const fileName = 'kevin.json';

    fileSystem.writeFileSync(fileName, jsonString, 'utf8');
    console.log(`${fileName} 파일이 생성되었습니다.`);
}

function deleteJson(fileName) {
    const input = readline.question(`${fileName} 파일을 삭제하시겠습니까? (y/n): `);

    if (input === 'y') {
        fileSystem.unlinkSync(fileName);
        console.log(`${fileName} 파일이 삭제되었습니다.`);
    }
}

createJson(kevin);
deleteJson('kevin.json');