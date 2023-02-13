import {
    readTodos,
    checkDoneById,
    checkUndoneById,
    editTodoTextById,
    delTodoById} from './storage-utils.js'

const icons = {
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
const renderTodo = function(todoObj) {
    const {text, id, isDone} = todoObj
    //            [className, textContent, listenerFn]
    const data = [
        ['todo-text', text, null],
        ['edit-todo', icons.edit, editListener],
        ['del-todo', icons.delete, delListener]
    ]
    const p = document.createElement('p')
    p.className = 'todo'
    // checkbox
    const checkbox = document.createElement('input')
    checkbox.type = 'checkbox';
    checkbox.className = 'todo-checkbox'
    checkbox.checked = isDone
    const checkboxFn = isDone ? checkUndoneById: checkDoneById
    checkbox.addEventListener('change', () => {
        checkboxFn(id)
        renderAllTodos()
    })
    p.appendChild(checkbox)
    // text and buttons
    for (let [className, textContent, listenerFn] of data) {
        const el = document.createElement('span')
        el.className = className
        el.textContent = textContent
        if (listenerFn) {
            listenerFn(el, id)
        }
        p.appendChild(el)
    }
    return p
}

const delListener = function(el, id) {
    el.addEventListener('click', () => {
        delTodoById(id)
        renderAllTodos()
    })
}


const editListener = function(el, id) {
    el.addEventListener('click', evt => {
        const parent = evt.target.parentElement
        const todoTextSpan = parent.querySelector('span.todo-text')
        const textContent = todoTextSpan.textContent
        parent.replaceChild(renderEditInp(id, textContent), todoTextSpan)
        parent.replaceChild(renderConfirmIcon(), parent.querySelector('.edit-todo'))
        const confirmIcon = parent.querySelector('.edit-todo')
        confirmIcon.addEventListener('click', () => {
            const editedText = parent.querySelector('.todo-edit-input').value
            editTodoTextById(id, editedText)
            renderAllTodos()
        })
    })
}

const renderEditInp = function(id, text) {
    const inputEdit = document.createElement('input')
    inputEdit.className = 'todo-edit-input'
    inputEdit.type = 'text'
    inputEdit.value = text
    inputEdit.addEventListener('keydown', (evt) => {
        if (evt.code === 'Escape' || evt.code === 'Enter') {
            editTodoTextById(id, inputEdit.value)
            renderAllTodos()
        }
    })
    return inputEdit
}

const renderConfirmIcon = function() {
    const editIcon = document.createElement('span')
    editIcon.className = 'edit-todo'
    editIcon.textContent = icons.confirm
    return editIcon
}


const renderAllTodos = function() {
    todoBlock.innerHTML = ''
    const todos = readTodos()
    if (todos.length === 0) {
        todoBlock.classList.add('hidden')
        delButtonsBlock.classList.add('hidden')
        return
    }
    todos.forEach(t => todoBlock.append(renderTodo(t)))
    todoBlock.classList.remove('hidden')
    delButtonsBlock.classList.remove('hidden')
    delSelectedBtn.disabled = todos.every(t => !t.isDone)

}

export {
    renderAllTodos
}