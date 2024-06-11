// @Deprecated
// DB 사용으로 인해 더 이상 사용하지 않음
// const getCurrentTime = () => {
//     const now = new Date();
//
//     const year = now.getFullYear();
//     const month = String(now.getMonth() + 1).padStart(2, '0'); // month는 0부터 시작하기 때문에 +1이 필요함
//     const day = String(now.getDate()).padStart(2, '0');
//
//     const hours = String(now.getHours()).padStart(2, '0');
//     const minutes = String(now.getMinutes()).padStart(2, '0');
//     const seconds = String(now.getSeconds()).padStart(2, '0');
//
//     return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
// }

const convertTimeFormat = (date) => {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2); // Months are zero indexed. Add leading 0.
    const day = ('0' + date.getDate()).slice(-2); // Add leading 0.
    const hour = ('0' + date.getHours()).slice(-2);
    const minute = ('0' + date.getMinutes()).slice(-2);
    const second = ('0' + date.getSeconds()).slice(-2);

    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
};

module.exports = {
    convertTimeFormat,
};