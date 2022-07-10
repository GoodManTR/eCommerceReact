import { useAuth } from '../contexts/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import '../styles/main.css'
import { getDatabase, ref, child, get, onValue } from "firebase/database";
import { auth, firestoreDb } from '../firebase';
import React, { useState, useEffect } from 'react'
import { collection, query, onSnapshot, where, getDocs, doc } from "firebase/firestore"; 

export default function Profile_Orders() {

    const { currentUser } = useAuth()
    const [ what , setWhat ] = useState([])

    async function getOrders() {
        const q = query(collection(firestoreDb, "orders"), where("orderedBy", "==", `${auth.currentUser.uid}`));
        
        onSnapshot(q, (querySnapshot) => {

            querySnapshot.forEach((docc) => {
                const qq = query(collection(firestoreDb, `orders/${docc.data().orderId}/items`));

                onSnapshot(qq, (qquerySnapshot) => {
                    setWhat([])
                    qquerySnapshot.forEach((doccc) => {
                        setWhat(what => [...what, doccc.data()])
                    });
                });
            });
        });
    }


    useEffect(() => {
        //getItems()
        getOrders()
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
                        <div className='orders_container'>
                        {what.map((what) => (
                            <div>{what.itemName}</div>
                        ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}