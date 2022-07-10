import '../styles/main.css'
import Iframe from "react-iframe"
import { useAuth } from '../contexts/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import React, { useState, useEffect } from 'react'
import { getDatabase, ref, child, get } from "firebase/database";
import { auth } from '../firebase';

export default function ContactUs() {

    const { currentUser, logout } = useAuth()
    const navigate = useNavigate()
    const [name, setName] = useState('loading...')

    const handleLogout = async () => {
        try {
            console.log("asddas");
            await logout()
            navigate("/")
        } catch {
        }
    }

    useEffect(() => {
        const getName = async () => {
            const dbRef = ref(getDatabase())
            const res = await get(child(dbRef, `users/${auth.currentUser.uid}`))
            console.log(res)
            if (res.exists()) {
                console.log(res.val());
                const name = res.val().username + " " + res.val().userlastname
            setName(name)
            }
        }

        getName()
    }, [])

    return (
        <>
            <div className="main-container">
                <div className="inner-container">
                    <div className="contact-left">
                        <h1>Mail Atın</h1>
                        <form>
                            <div className="form__group field">
                                <input type="name" className="form__field" placeholder="Ad" name="name" id='name' required />
                                <label htmlFor="name" className="form__label">Ad</label>
                            </div>
                            <div className="form__group field">
                                <input type="lastname" className="form__field" placeholder="Email" name="lastname" id='lastname'
                                    required />
                                <label htmlFor="lastname" className="form__label">Soyad</label>
                            </div>
                            <div className="form__group field">
                                <input type="email" className="form__field" placeholder="Email" name="email" id='email' required />
                                <label htmlFor="email" className="form__label">Email</label>
                            </div>
                            <div className="form__group field">
                                <input type="text" className="form__field" placeholder="Konu" name="subject" id='subject'
                                    required />
                                <label htmlFor="subject" className="form__label">Konu</label>
                            </div>
                            <textarea placeholder="Mesaj" rows="20" name="comment[text]" id="comment_text" cols="40"
                                className="ui-autoComplete-input" autoComplete="off" role="textbox" aria-autocomplete="list"
                                aria-haspopup="true"></textarea>
                            <div className="contact-submit-button"><a href="/"><button className="bn632-hover bn22"
                                type='Submit'>Gönder</button></a></div>
                        </form>

                    </div>
                    <div className="contact-right">
                        <h1>Konum</h1>
                        <Iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3010.5669213967913!2d28.967891215856525!3d41.012851327091546!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cab92ec520681f%3A0x71bb30a7c5aaac9d!2zxLBoc2FuIMOHZXlpeiBCaW5kYWxsxLE!5e0!3m2!1str!2str!4v1654635231721!5m2!1str!2str"
                            width="400" height="300" style="border:0;" allowFullScreen="" loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"></Iframe>
                        <div className="contact-right-bottom">
                            <div>Sabit Hat: 0212 123 45 67</div>
                            <div>Cep: 0532 123 45 67</div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}


