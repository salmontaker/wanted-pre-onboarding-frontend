import React, { useState } from 'react'
import style from './Todo.module.css'

const TodoItem = ({ id, todo, isCompleted, updateTodo, deleteTodo }) => {
	const [todoCheck, setTodoCheck] = useState(isCompleted)
	const [todoModify, setTodoModify] = useState('')
	const [isEditMode, setIsEditMode] = useState(false)

	// TODO의 체크박스가 변경 되었을 때
	const onTodoCheckChanged = () => {
		updateTodo(id, todo, !todoCheck)
		setTodoCheck(!todoCheck)
	}

	// TODO input창의 값이 변경 되었을 때 (수정모드)
	const onTodoModifyChanged = (e) => {
		const value = e.target.value
		setTodoModify(value)
	}

	// 수정 버튼을 눌렀을 때
	const onEditButtonClicked = () => {
		setTodoModify(todo)
		setIsEditMode(true)
	}

	// 취소 버튼을 눌렀을 때
	const onCancelButtonClicked = () => {
		setIsEditMode(false)
	}

	// 제출 버튼을 눌렀을 때
	const onSubmitButtonClicked = () => {
		updateTodo(id, todoModify, isCompleted)
		setIsEditMode(false)
	}

	// 삭제 버튼을 눌렀을 때
	const onDeleteButtonClicked = () => {
		deleteTodo(id)
	}

	return (
		<li className={style.todoItem}>
			<label className={style.todoLabel}>
				<input
					className={style.todoCheck}
					type='checkbox'
					checked={todoCheck}
					onChange={onTodoCheckChanged}
				/>
				{isEditMode ? (
					<input
						className={style.todoModify}
						data-testid='modify-input'
						type='text'
						onChange={onTodoModifyChanged}
						value={todoModify}
					/>
				) : (
					<span className={style.todoText}>{todo}</span>
				)}
			</label>
			{isEditMode ? (
				<>
					<button
						className={style.todoButton}
						data-testid='submit-button'
						onClick={onSubmitButtonClicked}
					>
						제출
					</button>
					<button
						className={style.todoButton}
						data-testid='cancel-button'
						onClick={onCancelButtonClicked}
					>
						취소
					</button>
				</>
			) : (
				<>
					<button
						className={style.todoButton}
						data-testid='modify-button'
						onClick={onEditButtonClicked}
					>
						수정
					</button>
					<button
						className={style.todoButton}
						data-testid='delete-button'
						onClick={onDeleteButtonClicked}
					>
						삭제
					</button>
				</>
			)}
		</li>
	)
}

export default TodoItem
