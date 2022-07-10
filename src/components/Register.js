import React, { useRef, useState } from 'react'
import { Alert } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { getDatabase, ref, child, get, set } from "firebase/database";
import { auth } from '../firebase';
import '../styles/main.css'
import { collection, addDoc, setDoc, doc } from "firebase/firestore"; 
import { firestoreDb } from '../firebase';

export default function Signup() {
    const nameRef = useRef()
    const lastNameRef = useRef()
    const emailRef = useRef()
    const passwordRef = useRef()
    const passwordConfirmRef = useRef()
    const { signup } = useAuth()
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const db = firestoreDb;

    // FIRESTORE
    async function writeUserData(userId, name, lastname, email) {
        
        try {
            const docRef = await setDoc(doc(db, "users", userId), {
                email: email,
                lastname: lastname,
                username: name,
                userId: userId      
              });
              console.log("Document written with ID: ", docRef.id);
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    }

    // function writeUserData(userId, name, lastname, email) {
    //     const db = getDatabase();
    //     set(ref(db, 'users/' + userId), {
    //         username: name,
    //         userlastname: lastname,
    //         email: email,
    //     });
    // }

    async function handleSubmit(e) {
        e.preventDefault()

        if (passwordRef.current.value !== passwordConfirmRef.current.value) {
            return setError('Password do not match!')
        }

        try {
            setError('')
            setLoading(true)
            await signup(emailRef.current.value, passwordRef.current.value)
            writeUserData(auth.currentUser.uid, nameRef.current.value, lastNameRef.current.value, emailRef.current.value)
            navigate("/")
        } catch {
            setError('Failed to create an account')
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
                            <input type="name" className="form__field" placeholder="Name" name="name" id='name' ref={nameRef} required />
                            <label htmlFor="name" className="form__label">Ad</label>
                        </div>

                        <div className="form__group field">
                            <input type="input" className="form__field" placeholder="Last Name" name="lastname" id='lastname' ref={lastNameRef} required />
                            <label htmlFor="lastname" className="form__label">Soyad</label>
                        </div>

                        <div className="form__group field">
                            <input type="email" className="form__field" placeholder="Email" name="email" id='email' ref={emailRef} required />
                            <label htmlFor="email" className="form__label">Email</label>
                        </div>

                        <div className="form__group field">
                            <input type="password" className="form__field" placeholder="Password" name="password" id='password' ref={passwordRef} required />
                            <label htmlFor="password" className="form__label">Şifre</label>
                        </div>

                        <div className="form__group field">
                            <input type="password" className="form__field" placeholder="Confirm Password" name="passwordconfirm" id='passwordconfirm' ref={passwordConfirmRef} required />
                            <label htmlFor="passwordconfirm" className="form__label">Şifreyi Onayla</label>
                        </div>
                        
                        <div>
                            <Link to="/forgot-password"><button className="bn632-hover bn22">Şifreni Mi Unuttun?</button></Link>
                            <a href="/"><button className="bn632-hover bn22" disabled={loading} type='Submit'>Kayıt Ol</button></a>
                        </div>
                    </form>
                    <br />
                    <div className='bottom_link'>
                        Zaten Hesanın varsa&nbsp; <a href="/login">Giriş Yap</a>
                    </div>
                </div>
            </div>
        </>
    )
}


