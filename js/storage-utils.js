import genRandomId from './misc.js'
const TODO_LS_KEY = 'todo'

/*
{
    "id": "63ea1255c82a8fb6426fc960",
    "text": "go to shop",
    "isDone": "true",
    "createdAt": "2023-02-13T10:35:01.590Z",
    "updatedAt": "2023-02-13T10:35:01.590Z",
}
*/
const saveTodos = function(todoArr) {
    localStorage.setItem(TODO_LS_KEY, JSON.stringify(todoArr));
    return localStorage.getItem(TODO_LS_KEY)
}

const clearTodos = () => saveTodos([])

const readTodos = () => JSON.parse(localStorage.getItem(TODO_LS_KEY) ?? saveTodos([]))

const addTodo = function(text) {
    const todos = readTodos()
    const timeNow = _dateNow()
    const todo = {
        id: genRandomId(),
        text: text,
        isDone: false, // always false for new item
        createdAt: timeNow,
        updatedAt: timeNow
    }
    todos.push(todo)
    return saveTodos(todos)
}

const _editTodoById = function(id, NewIsDone=null, newText=null) {
    const todos = readTodos()
    const idx = _getTodoIdxById(id)
    const todo = todos[idx]
    if (newText) todo.text = newText
    if (NewIsDone !== null) todo.isDone = NewIsDone
    todo.updatedAt = _dateNow()
    return saveTodos(todos)
}

const checkDoneById = (id) => _editTodoById(id, true)

const checkUndoneById = (id) => _editTodoById(id, false)

const editTodoTextById = (id, text) => _editTodoById(id, null, text)



const delTodoById = function(id) {
    const todos = readTodos()
    const todoIdx = _getTodoIdxById(id)
    todos.splice(todoIdx, 1)
    return saveTodos(todos)
}

const delSelected = function() {
    const todos = readTodos()
    const newTodos = todos.filter(t => !t.isDone)
    return saveTodos(newTodos)
}

const _getTodoIdxById = function(id) {
    const todos = readTodos()
    for (let i = 0; i < todos.length; i++) {
        if (todos[i].id === id) return i
    }
    return null
}

const _dateNow = () => new Date().toISOString()


export {
    readTodos,
    saveTodos,
    clearTodos,
    addTodo,
    checkDoneById,
    checkUndoneById,
    editTodoTextById,
    delTodoById,
    delSelected
}