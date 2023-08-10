import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import TodoItem from './TodoItem'

const Todo = () => {
	const request = axios.create({
		baseURL: process.env.REACT_APP_API_BASE,
		headers: {
			Authorization: `Bearer ${localStorage.getItem('access_token')}`,
			'Content-Type': 'application/json',
		},
	})

	const [todoInput, setTodoInput] = useState('')
	const [todoList, setTodoList] = useState([])

	const navigate = useNavigate()

	const onTodoInputChanged = (e) => {
		const value = e.target.value
		setTodoInput(value)
	}

	const createTodo = () => {
		request
			.post('/todos', { todo: todoInput })
			.then((res) => {
				setTodoList([...todoList, res.data])
				setTodoInput('')
			})
			.catch((err) => {
				console.log(err)
			})
	}

	const getTodos = () => {
		request
			.get('/todos')
			.then((res) => {
				setTodoList(res.data)
			})
			.catch((err) => {
				console.log(err)
			})
	}

	const updateTodo = (id, todo, isCompleted) => {
		request
			.put(`/todos/${id}`, { todo: todo, isCompleted: isCompleted })
			.then((res) => {
				const data = res.data

				setTodoList(
					todoList.map((item) =>
						item.id === id
							? { ...item, todo: data.todo, isCompleted: data.isCompleted }
							: item
					)
				)
			})
			.catch((err) => {
				console.log(err)
			})
	}

	const deleteTodo = (id) => {
		request
			.delete(`/todos/${id}`)
			.then(() => {
				setTodoList(todoList.filter((item) => item.id !== id))
			})
			.catch((err) => {
				console.log(err)
			})
	}

	useEffect(() => {
		if (localStorage.getItem('access_token') === null) {
			navigate('/signin')
		} else {
			getTodos()
		}
	}, [])

	return (
		<div>
			<input data-testid='new-todo-input' onChange={onTodoInputChanged} value={todoInput} />
			<button data-testid='new-todo-add-button' onClick={createTodo}>
				추가
			</button>
			{todoList.map((item) => (
				<TodoItem
					key={item.id}
					id={item.id}
					todo={item.todo}
					isCompleted={item.isCompleted}
					updateTodo={updateTodo}
					deleteTodo={deleteTodo}
				/>
			))}
		</div>
	)
}

export default Todo
