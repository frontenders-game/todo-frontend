
// const API_URL = 'http://127.0.0.1:5000/api/'
// const API_KEY = '2d5f792d-2ff3-4bd8-9637-1d2967f27c8d'

const API_URL = 'https://281677.simplecloud.ru/api/'
const API_KEY = 'd79887cf-df04-4457-972e-247a0f81f9d4'

/*
  {
    _id: '63ec331a7875944d8864642e',
    text: 'Go for a walk',
    isDone: false,
    userId: '63ec305e9f9c64d23b19754d',
    createdAt: '2023-02-15T01:19:22.362Z',
    updatedAt: '2023-02-15T01:40:20.019Z'
  }
*/


const makeRequest = async function (path, method='GET', text=null, isDone=null) {
    const headers = {
        'apiKey': API_KEY,
        'Content-Type': 'application/json',
    }
    const url = `${API_URL}${path}`
    const options = {
        method: method,
        headers: headers
    }

    if (method !== 'GET') {
        options.body = {}
        if (text) options.body.text = text
        if (isDone !== null) options.body.isDone = isDone
        options.body = JSON.stringify(options.body)
    }

    const result = await fetch(url, options)
    return result.json()
}

const processTodo = function (todo) {
    todo.id = todo._id
    return todo
}

const readTodos = async function () {
    const response = await makeRequest('todo/all')
    console.log(response.data)
    return response.data.map(todo => processTodo(todo))
}

const clearTodos = async function () {
    return await makeRequest('todo/all', 'DELETE')
}

const addTodo = async function (text) {
    return await makeRequest('todo/', 'POST', text)
}

const editTodoById = async function (id, isDone = null, text = null) {
    return await makeRequest(`todo/${id}`, 'PATCH', text, isDone)
}

const setDoneById = async (id) => await editTodoById(id, true)

const setNotDoneById = async (id) => await editTodoById(id, false)

const editTodoTextById = async (id, text) => await editTodoById(id, null, text)

const delTodoById = async function (id) {
    return await makeRequest(`todo/${id}`, 'DELETE')
}

const delSelected = async function () {
    const todos = await readTodos()
    todos.filter(t => t.isDone)
        .forEach(todo => delTodoById(todo.id))
}

export {
    readTodos,
    clearTodos,
    addTodo,
    setDoneById,
    setNotDoneById,
    editTodoTextById,
    delTodoById,
    delSelected
}





