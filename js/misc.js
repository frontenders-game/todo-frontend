const genRandomId = function () {
    const timestamp = (new Date().getTime() / 1000 | 0).toString(16);
    return timestamp + 'x'.repeat(16).replace(/x/g,
        () => (Math.random() * 16 | 0).toString(16)).toLowerCase();
};

const dateNow = () => new Date().toISOString()

const dateISOtoLocal = (date) => new Date(date).toLocaleString('ru')


export {
    genRandomId,
    dateNow,
    dateISOtoLocal
}