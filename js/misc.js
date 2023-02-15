const genRandomId = function () {
    const timestamp = (new Date().getTime() / 1000 | 0).toString(16);
    return timestamp + 'xxxxxxxxxxxxxxxx'.replace(/[x]/g,
        () => (Math.random() * 16 | 0).toString(16)).toLowerCase();
};

const dateNow = () => new Date().toISOString()

const dateISOtoLocal = (date) => new Date(date).toLocaleString('ru')

const sortTodosByCreatedDate = (todoArr) => {
    todoArr.sort((todo1, todo2) => new Date(todo2.createdAt).getTime() - new Date(todo1.createdAt).getTime())
    return todoArr
}


export {
    genRandomId,
    dateNow,
    dateISOtoLocal,
    sortTodosByCreatedDate
}