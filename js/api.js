const API_URL = 'https://281677.simplecloud.ru/api/'

const getApiKey = async () =>{
    const LOCAL_STORAGE_KEY = 'todoApiKey'
    let apiKey = localStorage.getItem(LOCAL_STORAGE_KEY)
    if(apiKey) return apiKey
    const regKeyRequest = await fetch(`${API_URL}user/register`)
    const json = await regKeyRequest.json()
    apiKey = json.data.apiKey
    localStorage.setItem(LOCAL_STORAGE_KEY, apiKey)
    return apiKey
}

const API_KEY = await getApiKey()

/**
  {
    _id: '63ec331a7875944d8864642e',
    text: 'Go for a walk',
    isDone: false,
    userId: '63ec305e9f9c64d23b19754d',
    createdAt: '2023-02-15T01:19:22.362Z',
    updatedAt: '2023-02-15T01:40:20.019Z'
  }
*/


/**
 * Helper function to make options object
 */
const makeOptions = function (method, text, isDone) {
    const options = {
        method: method,
        headers: {
            'apiKey': API_KEY,
            'Content-Type': 'application/json',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
        }
    }
    if (method !== 'GET') {
        options.body = {}
        if (text) options.body.text = text
        if (isDone !== null) options.body.isDone = isDone
        options.body = JSON.stringify(options.body)
    }
    return options
}

const makeRequest = async function (path, method='GET', text=null, isDone=null) {
    const url = `${API_URL}${path}`
    const options = makeOptions(method, text, isDone)
    const result = await fetch(url, options)
    return result.json()
}


const processTodo = function (todo) {
    todo.id = todo._id
    delete todo._id
    return todo
}

const readTodos = async function () {
    const response = await makeRequest('todo/all')
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
    const filtered = todos.filter(t => t.isDone)
    const toResolve = []
    for (const t of filtered) toResolve.push(await delTodoById(t.id))
    await Promise.all(toResolve)
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
