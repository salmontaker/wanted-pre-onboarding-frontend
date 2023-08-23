import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import TodoItem from './TodoItem'
import style from './Todo.module.css'
import { apiClient } from '../utils/axios'

type TodoObj = {
    id: string,
    todo: string,
    isCompleted: boolean
}

const Todo = () => {
	const [todoInput, setTodoInput] = useState('')
	const [todoList, setTodoList] = useState<TodoObj[]>([])

	const navigate = useNavigate()

	const onTodoInputChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value
		setTodoInput(value)
	}

	const createTodo = () => {
		apiClient
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
		apiClient
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
		apiClient
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
		apiClient
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
