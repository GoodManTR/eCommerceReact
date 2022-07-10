import React, { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import '../styles/main.css'

export default function Login() {
    const emailRef = useRef()
    const passwordRef = useRef()
    const { login } = useAuth()
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()



    async function handleSubmit(e) {
        e.preventDefault()

        try {
            setError('')
            setLoading(true)
            await login(emailRef.current.value, passwordRef.current.value)


            navigate("/")
        } catch {
            setError('Failed to log in')
        }

        setLoading(false)
    }



    return (
        <>
            <div className="main_container">
                <div className='form_Container'>
                    {error && <div className='formError'>{error} </div>}
                    <form onSubmit={handleSubmit}>

                        <div className="form__group field">
                            <input type="email" className="form__field" placeholder="Email" name="email" id='email' ref={emailRef} required />
                            <label htmlFor="email" className="form__label">Email</label>
                        </div>

                        <div className="form__group field">
                            <input type="password" className="form__field" placeholder="Password" name="password" id='password' ref={passwordRef} required />
                            <label htmlFor="password" className="form__label">Şifre</label>
                        </div>

                        <div>
                            <Link to="/forgot-password"><button className="bn632-hover bn22">Şifreni Mi Unuttun?</button></Link>
                            <a href="/"><button className="bn632-hover bn22" disabled={loading} type='Submit'>Giriş Yap</button></a>
                        </div>
                    </form>
                    <br />
                    <div className='bottom_link'>
                        Hesaba mı ihtiyacın var?&nbsp; <a href="/signup">Kayıt Ol</a>
                    </div>
                </div>
            </div>
        </>
    )
}


