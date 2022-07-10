import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import { collection, addDoc, setDoc, doc, getDoc } from "firebase/firestore"; 
import { auth } from '../firebase';
import { firestoreDb } from '../firebase';

export default function Header() {
    const [name, setName] = useState('loading...')
    const { currentUser, logout } = useAuth()
    const navigate = useNavigate()
    const currentUrl = window.location.pathname

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
            const docRef = doc(firestoreDb, "users", auth.currentUser.uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const name = docSnap.data().username + " " + docSnap.data().lastname
                setName(name)
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        }
        getName()
    })


    return (
        <>
            <div className="div1">
                <header className="site-header">

                    <a href="/" className="site-logo-anchor">
                        <h1 className="site-logo">İHSAN ÇEYİZ</h1>
                    </a>

                    <div className="vl"></div>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <div><a href="/">Ürünler</a></div>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <div><a href="/communication">İletişim</a></div>
                    
                    {currentUrl === "/" && <h1 className="current-page">Tüm Ürünler</h1>}
                    {currentUrl === "/orders" && <h1 className="current-page">Siparişler</h1>}
                    {currentUrl === "/profile-info" && <h1 className="current-page">Kullanıcı Bilgileri</h1>}
                    {currentUrl === "/signup" && <h1 className="current-page">Kayıt Ol</h1>}
                    {currentUrl === "/login" && <h1 className="current-page">Giriş Yap</h1>}
                    {currentUrl === "/forgot-password" && <h1 className="current-page">Şifre Sıfırlama</h1>}
                    {currentUrl === "/communication" && <h1 className="current-page">Bize Ulaşın</h1>}
                    {currentUrl === "/shopping-cart" && <h1 className="current-page">Sepet</h1>}
                    {currentUrl === "/add-product" && <h1 className="current-page">Ürün Ekle</h1>}
                   

                    {currentUser && <div className="header-auth">
                        <div>
                            {name}
                        </div>
                        {currentUser.email === "b.kurul@outlook.com" && currentUser && 
                        <>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <a href='/add-product'>
                            <button>
                                Admin
                            </button>
                        </a>
                        </>}
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <a href='/profile-info'>
                            <button>
                                Profilim
                            </button>
                        </a>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <a href='/orders'>
                            <button>
                                Siparişler
                            </button>
                        </a>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        
                        <a href='/shopping-cart'>
                            <button>
                                Sepet
                            </button>
                        </a>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <button onClick={handleLogout}>
                            Çıkış Yap
                        </button>
                    </div>}

                    {!currentUser &&
                        <div className="header-auth">
                            <a href="/signup"><div>Kayıt Ol</div></a>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <a href="/login"><div>Giriş Yap</div></a>


                        </div>}
                </header>
            </div>
        </>
    )
}