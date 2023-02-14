import {clearTodos, addTodo, delSelected} from './storage-utils.js'
import {renderAllTodos} from './render-todos.js'

const inputForm = document.querySelector('.add-form')
const inputBtn = document.querySelector('.btn-add')
const inputField = document.querySelector('.input-field')
const delSelectedBtn = document.querySelector('.del-selected-btn')
const delAllBtn = document.querySelector('.del-all-btn')

const addAllListeners = function () {
    inputForm.addEventListener('submit', evt => evt.preventDefault())
    inputBtn.addEventListener('click', _ => {
        if (inputField.value) addTodo(inputField.value)
        inputField.value = ""
        inputField.focus()
        renderAllTodos()
    })
    delSelectedBtn.addEventListener('click', () => {
        delSelected()
        renderAllTodos()
    })
    delAllBtn.addEventListener('click', () => {
        clearTodos()
        renderAllTodos()
    })
}

renderAllTodos() // render for the first time
addAllListeners() // add listeners for all buttons


