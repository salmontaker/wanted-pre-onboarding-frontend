import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const LoginForm = ({ isSignUp }) => {
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

	const onChangeEmail = (e) => {
		const value = e.target.value

		setEmail(value)
		setIsValidEmail(value.indexOf('@') !== -1)
	}

	const onChangePassword = (e) => {
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
				console.log(err)
			})
	}

	// 로컬스토리지에 토큰이 존재할 경우 TODO 페이지로 리다이렉트
	useEffect(() => {
		if (localStorage.getItem('access_token') !== null) {
			navigate('/todo')
		}
	}, [navigate])

	return (
		<div>
			<input data-testid='email-input' type='email' onChange={onChangeEmail} />
			<input data-testid='password-input' type='password' onChange={onChangePassword} />
			<button
				data-testid={isSignUp ? 'signup-button' : 'signin-button'}
				disabled={!(isValidEmail && isValidPassword)}
				onClick={sendData}
			>
				{isSignUp ? '회원가입' : '로그인'}
			</button>
		</div>
	)
}

export default LoginForm
