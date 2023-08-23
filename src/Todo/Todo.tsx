import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import TodoItem from './TodoItem'
import style from './Todo.module.css'

type TodoObj = {
    id: string,
    todo: string,
    isCompleted: boolean
}

const Todo = () => {
	const request = axios.create({
		baseURL: process.env.REACT_APP_API_BASE,
		headers: {
			Authorization: `Bearer ${localStorage.getItem('access_token')}`,
			'Content-Type': 'application/json',
		},
	})

	const [todoInput, setTodoInput] = useState('')
	const [todoList, setTodoList] = useState<TodoObj[]>([])

	const navigate = useNavigate()

	const onTodoInputChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
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
				const message = err.response.data.message

				alert(message)
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
				const message = err.response.data.message

				alert(message)
				console.log(err)
			})
	}

	const updateTodo = (id: string, todo: string, isCompleted: boolean) => {
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
				const message = err.response.data.message

				alert(message)
				console.log(err)
			})
	}

	const deleteTodo = (id: string) => {
		request
			.delete(`/todos/${id}`)
			.then(() => {
				setTodoList(todoList.filter((item) => item.id !== id))
			})
			.catch((err) => {
				const message = err.response.data.message

				alert(message)
				console.log(err)
			})
	}

	const onLogoutButtonClicked = () => {
		localStorage.removeItem('access_token')
		navigate('/signin')
	}

	useEffect(() => {
		if (localStorage.getItem('access_token') === null) {
			navigate('/signin')
		} else {
			getTodos()
		}
	}, [])

	return (
		<div className={style.container}>
			<h1 className={style.todoTitle}>TODO!</h1>
			<ol className={style.todoList}>
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
			</ol>
			<div className={style.createContainer}>
				<input
					className={style.createTodoInput}
					data-testid='new-todo-input'
					onChange={onTodoInputChanged}
					value={todoInput}
					placeholder='해야할 일 입력...'
				/>
				<button
					className={style.createTodoButton}
					data-testid='new-todo-add-button'
					onClick={createTodo}
				>
					추가하기
				</button>
			</div>
			<button className={style.logoutButton} onClick={onLogoutButtonClicked}>
				로그아웃
			</button>
		</div>
	)
}

export default Todo
