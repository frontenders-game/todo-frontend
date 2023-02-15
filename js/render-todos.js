import {dateISOtoLocal} from './misc.js'
import {
    readTodos,
    setDoneById,
    setNotDoneById,
    editTodoTextById,
    delTodoById
} from './api.js'

const ICONS = {
    edit: '✏️',
    delete: '❌',
    confirm: '✅',
}

const todoBlock = document.querySelector('.todo-block')
const delButtonsBlock = document.querySelector('.del-buttons-block')
const delSelectedBtn = document.querySelector('.del-selected-btn')

/**
{
    "id": "63ea1255c82a8fb6426fc960",
    "text": "go to shop",
    "isDone": "true",
    "createdAt": "2023-02-13T10:35:01.590Z",
    "updatedAt": "2023-02-13T10:35:01.590Z",
}
 */

const generateDateTitle = function (createdAt, updatedAt) {
    let str = `Добавлено: ${dateISOtoLocal(createdAt)}.`
    if (createdAt !== updatedAt) str += ` Изменено: ${dateISOtoLocal(updatedAt)}.`
    return str
}

const renderTodo = async function (todoObj) {
    const {text, id, isDone, createdAt, updatedAt} = todoObj
    const data = [
        // [className, textContent, listenerFn]
        ['todo-text', text, null],
        ['edit-todo-icon', ICONS.edit, editListener],
        ['del-todo-icon', ICONS.delete, delListener]
    ]
    const p = document.createElement('p')
    p.className = 'todo'
    p.title = generateDateTitle(createdAt, updatedAt)
    // checkbox
    const checkbox = document.createElement('input')
    checkbox.type = 'checkbox';
    checkbox.className = 'todo-checkbox'
    checkbox.checked = isDone
    const checkboxFn = isDone ? setNotDoneById : setDoneById
    checkbox.addEventListener('change', async() => {
        await checkboxFn(id)
        await renderAllTodos()
    })
    p.appendChild(checkbox)
    // text and icons
    for (let [className, textContent, listenerFn] of data) {
        const el = document.createElement('span')
        el.className = className
        el.textContent = textContent
        if (listenerFn) await listenerFn(el, id)
        p.appendChild(el)
    }
    return p
}

const delListener = async function (el, id) {
    el.addEventListener('click', async () => {
        await delTodoById(id)
        await renderAllTodos()
    })
}

const editListener = async function (el, id) {
    el.addEventListener('click', async evt => {
        const parent = evt.target.parentElement
        const todoTextSpan = parent.querySelector('.todo-text')
        const icon = parent.querySelector('.edit-todo-icon')
        const textContent = todoTextSpan.textContent
        todoTextSpan.replaceWith(await renderEditInp(id, textContent))
        parent.querySelector('.todo-edit-input').focus()
        icon.textContent = ICONS.confirm
        icon.addEventListener('click', async () => {
            const editedText = parent.querySelector('.todo-edit-input').value
            await editTodoTextById(id, editedText)
            await renderAllTodos()
        })
    }, {once: true})
}

const renderEditInp = async function (id, text) {
    const inputEdit = document.createElement('input')
    inputEdit.className = 'todo-edit-input'
    inputEdit.value = text
    inputEdit.addEventListener('keydown', async (evt) => {
        if (evt.code === 'Enter') {
            await editTodoTextById(id, inputEdit.value)
            await renderAllTodos()
        } else if (evt.code === 'Escape') await renderAllTodos()
    })
    return inputEdit
}

const renderAllTodos = async function () {
    todoBlock.innerHTML = ''
    const todos = await readTodos()
    // new items first
    todos.reverse()
    // empty todos
    if (todos.length === 0) {
        todoBlock.classList.remove('visible')
        delButtonsBlock.classList.remove('visible')
        return
    }
    // not empty
    for (const t of todos) {
        todoBlock.append(await renderTodo(t));
    }
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