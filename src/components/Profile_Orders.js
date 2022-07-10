import { useAuth } from '../contexts/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import '../styles/main.css'
import { getDatabase, ref, child, get, onValue } from "firebase/database";
import { auth } from '../firebase';
import React, { useState, useEffect } from 'react'

export default function Profile_Orders() {

    const { currentUser, logout } = useAuth()
    const navigate = useNavigate()
    const [name, setName] = useState('loading...')
    const [orders, setOrders] = useState([])
    const [error, setError] = useState('')

    function getItems() {
        const db = getDatabase();
        const starCountRef = ref(db, `users/${auth.currentUser.uid}/orders/`);

        onValue(starCountRef,
            (snapshot) => {
                setOrders([])
                snapshot.forEach((data) => {
                    setOrders(orders => [...orders, data.exportVal()]);
                });
            },
            (error) => {
                setError(error)
                console.log(error);
            }
        );
    }

    useEffect(() => {
        const getName = async () => {
            const dbRef = ref(getDatabase())
            const res = await get(child(dbRef, `users/${auth.currentUser.uid}`))
            if (res.exists()) {
                const name = res.val().username + " " + res.val().userlastname
            setName(name)
            }
        }
        getName()
        getItems()

    }, [])

    return (
        <>
            <div className='profile_main'>
                <div className='profile-inner-container'>
                    <div className='profile-navigation'>
                        {currentUser.email === "b.kurul@outlook.com" &&
                            <a href="/add-product">
                                <button className="profile-navigation-item">Ürün Ekle</button>
                            </a>}
                        <a href="/orders">
                            <button className="profile-navigation-item selected-one">Siparişler</button>
                        </a>
                        <a href="/profile-info">
                            <button className="profile-navigation-item">Kullanıcı Bilgilerim</button>
                        </a>
                    </div>
                    &nbsp;&nbsp;
                    <div className="profile-vertical-line"></div>
                    <div className='profile-data-div'>
                        {orders.map((order, index, or) => (
                            <>
                                <div>{console.log(or)}</div>
                                <div>{console.log(order)}</div>
                            </>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}