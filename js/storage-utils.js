import {genRandomId, dateNow} from './misc.js'

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
const saveTodos = function (todoArr) {
    localStorage.setItem(TODO_LS_KEY, JSON.stringify(todoArr));
    return todoArr
}

const clearTodos = () => saveTodos([])

const readTodos = () => JSON.parse(localStorage.getItem(TODO_LS_KEY) ?? saveTodos([]))

const addTodo = function (text) {
    const todos = readTodos()
    const timeNow = dateNow()
    const todo = {
        id: genRandomId(),
        text: text,
        isDone: false, // always false for new item
        createdAt: timeNow,
        updatedAt: timeNow
    }
    todos.push(todo)
    saveTodos(todos)
}

const editTodoById = function (id, isDone = null, text = null) {
    const todos = readTodos()
    const idx = getTodoIndexById(id)
    const todo = todos[idx]
    if (text) todo.text = text
    if (isDone !== null) todo.isDone = isDone
    todo.updatedAt = dateNow()
    saveTodos(todos)
}

const setDoneById = (id) => editTodoById(id, true)

const setNotDoneById = (id) => editTodoById(id, false)

const editTodoTextById = (id, text) => editTodoById(id, null, text)


const delTodoById = function (id) {
    const todos = readTodos()
    const todoIdx = getTodoIndexById(id)
    todos.splice(todoIdx, 1)
    saveTodos(todos)
}

const delSelected = function () {
    const todos = readTodos()
    const newTodos = todos.filter(t => !t.isDone)
    saveTodos(newTodos)
}

const getTodoIndexById = function (id) {
    const todos = readTodos()
    for (let i = 0; i < todos.length; i++) {
        if (todos[i].id === id) return i
    }
    return null
}


export {
    readTodos,
    saveTodos,
    clearTodos,
    addTodo,
    setDoneById,
    setNotDoneById,
    editTodoTextById,
    delTodoById,
    delSelected
}