import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import styles from './SignForm.module.css'

type Props = {
    isSignUp: boolean
}

const SignForm = ({ isSignUp }: Props) => {
	const request = axios.create({
		baseURL: process.env.REACT_APP_API_BASE,
		headers: {
			'Content-Type': 'application/json',
		},
	})

	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [isValidEmail, setIsValidEmail] = useState(false)
	const [isValidPassword, setIsValidPassword] = useState(false)

	const navigate = useNavigate()

	const onChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value

		setEmail(value)
		setIsValidEmail(value.indexOf('@') !== -1)
	}

	const onChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value

		setPassword(value)
		setIsValidPassword(value.length >= 8)
	}

	const sendData = () => {
		const data = {
			email: email,
			password: password,
		}

		request
			.post(`/auth/${isSignUp ? 'signup' : 'signin'}`, data)
			.then((res) => {
				// 회원가입시에는 로그인 페이지로, 로그인시에는 로컬스토리지에 토큰 저장후 TODO 페이지로
				if (isSignUp) {
					navigate('/signin')
				} else {
					localStorage.setItem('access_token', res.data.access_token)
					navigate('/todo')
				}
			})
			.catch((err) => {
				const message = err.response.data.message

				alert(message)
				console.log(err)
			})
	}

	// 로컬스토리지에 토큰이 존재할 경우 TODO 페이지로 리다이렉트
	useEffect(() => {
		if (localStorage.getItem('access_token') !== null) {
			navigate('/todo')
		}
	}, [])

	return (
		<div className={styles.container}>
			<h1 className={styles.h1}>{isSignUp ? '회원가입' : '로그인'}</h1>
			<input
				className={styles.input}
				data-testid='email-input'
				type='email'
				onChange={onChangeEmail}
				placeholder='이메일 주소'
			/>
			<input
				className={styles.input}
				data-testid='password-input'
				type='password'
				onChange={onChangePassword}
				placeholder='비밀번호 (8자리 이상)'
			/>
			<Link className={styles.link} to={isSignUp ? '/signin' : '/signup'}>
				{isSignUp ? '로그인 페이지로' : '회원가입 페이지로'}
			</Link>
			<button
				className={styles.button}
				data-testid={isSignUp ? 'signup-button' : 'signin-button'}
				disabled={!(isValidEmail && isValidPassword)}
				onClick={sendData}
			>
				{isSignUp ? '회원가입' : '로그인'}
			</button>
		</div>
	)
}

export default SignForm
