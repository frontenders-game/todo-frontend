import {clearTodos, addTodo, delSelected} from './api.js'
import {renderAllTodos} from './render-todos.js'

const inputForm = document.querySelector('.add-form')
const inputBtn = document.querySelector('.btn-add')
const inputField = document.querySelector('.input-field')
const delSelectedBtn = document.querySelector('.del-selected-btn')
const delAllBtn = document.querySelector('.del-all-btn')

const addAllListeners = async function () {
    inputForm.addEventListener('submit', evt => evt.preventDefault())
    inputBtn.addEventListener('click', async () => {
        if (inputField.value) await addTodo(inputField.value)
        inputField.value = ''
        inputField.focus()
        await renderAllTodos()
    })
    delSelectedBtn.addEventListener('click', async () => {
        await delSelected()
        await renderAllTodos()
    })
    delAllBtn.addEventListener('click', async () => {
        await clearTodos()
        await renderAllTodos()
    })
}

await renderAllTodos() // render for the first time
await addAllListeners() // add listeners for all buttons


