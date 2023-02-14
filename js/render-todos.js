import {
    readTodos,
    setDoneById,
    setNotDoneById,
    editTodoTextById,
    delTodoById
} from './storage-utils.js'

const ICONS = {
    edit: '✏️',
    delete: '❌',
    confirm: '✅',
}

const todoBlock = document.querySelector('.todo-block')
const delButtonsBlock = document.querySelector('.del-buttons-block')
const delSelectedBtn = document.querySelector('.del-selected-btn')

/*
{
    "id": "63ea1255c82a8fb6426fc960",
    "text": "go to shop",
    "isDone": "true",
    "createdAt": "2023-02-13T10:35:01.590Z",
    "updatedAt": "2023-02-13T10:35:01.590Z",
}
*/
const renderTodo = function (todoObj) {
    const {text, id, isDone} = todoObj
    const data = [
        // [className, textContent, listenerFn]
        ['todo-text', text, null],
        ['edit-todo-icon', ICONS.edit, editListener],
        ['del-todo-icon', ICONS.delete, delListener]
    ]
    const p = document.createElement('p')
    p.className = 'todo'
    // checkbox
    const checkbox = document.createElement('input')
    checkbox.type = 'checkbox';
    checkbox.className = 'todo-checkbox'
    checkbox.checked = isDone
    const checkboxFn = isDone ? setNotDoneById : setDoneById
    checkbox.addEventListener('change', () => {
        checkboxFn(id)
        renderAllTodos()
    })
    p.appendChild(checkbox)
    // text and icons
    for (let [className, textContent, listenerFn] of data) {
        const el = document.createElement('span')
        el.className = className
        el.textContent = textContent
        if (listenerFn) listenerFn(el, id)
        p.appendChild(el)
    }
    return p
}

const delListener = function (el, id) {
    el.addEventListener('click', () => {
        delTodoById(id)
        renderAllTodos()
    })
}

const editListener = function (el, id) {
    el.addEventListener('click', evt => {
        const parent = evt.target.parentElement
        const todoTextSpan = parent.querySelector('.todo-text')
        const icon = parent.querySelector('.edit-todo-icon')
        const textContent = todoTextSpan.textContent
        todoTextSpan.replaceWith(renderEditInp(id, textContent))
        parent.querySelector('.todo-edit-input').focus()
        icon.textContent = ICONS.confirm
        icon.addEventListener('click', () => {
            const editedText = parent.querySelector('.todo-edit-input').value
            editTodoTextById(id, editedText)
            renderAllTodos()
        })
    }, {once: true})
}

const renderEditInp = function (id, text) {
    const inputEdit = document.createElement('input')
    inputEdit.className = 'todo-edit-input'
    inputEdit.value = text
    inputEdit.addEventListener('keydown', (evt) => {
        if (evt.code === 'Enter') {
            editTodoTextById(id, inputEdit.value)
            renderAllTodos()
        } else if (evt.code === 'Escape') renderAllTodos()
    })
    return inputEdit
}

const renderAllTodos = function () {
    todoBlock.innerHTML = ''
    const todos = readTodos()
    // empty todos
    if (todos.length === 0) {
        todoBlock.classList.remove('visible')
        delButtonsBlock.classList.remove('visible')
        return
    }
    // not empty
    todos.forEach(t => todoBlock.append(renderTodo(t)))
    todoBlock.classList.add('visible')
    delButtonsBlock.classList.add('visible')
    delSelectedBtn.disabled = todos.every(t => !t.isDone)
    delSelectedBtn.title = delSelectedBtn.disabled ?
        'Кнопка станет активной, когда появятся выполненные задачи' :
        'Нажмите для удаления выбранных задач'
}

export {
    renderAllTodos
}