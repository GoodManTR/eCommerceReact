import { useAuth } from '../contexts/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import '../styles/main.css'
import React, { useRef, useState, useEffect } from 'react'
import { getDatabase, ref, child, get, update, set, remove, onValue, orderByChild } from "firebase/database";
import { auth, firestoreDb } from "../firebase"
import { collection, query, where, onSnapshot, doc, getDoc, setDoc, deleteDoc, getDocs, deleteField, updateDoc } from "firebase/firestore"; 



export default function ShoppingCart() {
    const [items, setItems] = useState([])
    const [cost, setCost] = useState()
    const [error, setError] = useState('')
    let count

    async function getCount(itemId) {
        const docRef = doc(firestoreDb, "users", auth.currentUser.uid + "/shopping_cart/" + itemId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            count = docSnap.data().count
        } 
    }


    function addToCart(uid, itemId) {
        getCount(itemId).then(() => {
            try {
                const docRef = setDoc(doc(firestoreDb, "users", uid + "/shopping_cart/" + itemId), {
                    count: count += 1
                }, { merge: true });
                console.log("Document written with ID: ", docRef.id);
            } catch (e) {
                console.error("Error adding document: ", e);
            }
        })
    }


    function subtractFromCart(uid, itemId) {
        getCount(itemId).then(() => {
            if (count > 1) {
                try {
                    const docRef = setDoc(doc(firestoreDb, "users", uid + "/shopping_cart/" + itemId), {
                        count: count -= 1
                    }, { merge: true });
                    console.log("Document written with ID: ", docRef.id);
                } catch (e) {
                    console.error("Error adding document: ", e);
                }
            } else {
                try {
                    deleteDoc(doc(firestoreDb, "users", uid + "/shopping_cart/" + itemId));
                } catch (e) {
                    console.error("Error adding document: ", e);
                }
                // updates['/users/' + uid + "/shopping_cart/" + itemId] = null
                // return update(ref(db), updates);
            }
        })
    }


    function addToCartClicked(event) {
        var itemId = event.target.parentElement.getElementsByClassName('item-buttons-add')[0].id
        getCount(itemId).then(addToCart(auth.currentUser.uid, itemId))
    }

    function subtractFromCartClicked(event) {
        var itemId = event.target.parentElement.getElementsByClassName('item-buttons-subtract')[0].id
        getCount(itemId).then(subtractFromCart(auth.currentUser.uid, itemId))
    }



    function ready() {
        var addToCartButtons = document.getElementsByClassName('item-buttons-add')
        for (var i = 0; i < addToCartButtons.length; i++) {
            var button = addToCartButtons[i]
            button.onclick = addToCartClicked
        }

        var subtractFromCartButtons = document.getElementsByClassName('item-buttons-subtract')
        for (var i = 0; i < subtractFromCartButtons.length; i++) {
            var button = subtractFromCartButtons[i]
            button.onclick = subtractFromCartClicked
        }
    }

    function getTotal() {
        let total = 0
        let stringTotal = ""
        items.map((item) => {
            if (item.count !== undefined) {
                const count = parseFloat(item.count)
                const cost = parseFloat(item.itemPrice.replace("TL", "").replace(",", "."))
                total += count * cost 
                stringTotal = `${total}` 
                console.log(total);
            }
            
        })  
        return stringTotal.replace(".",",")
    }


    function getItems() {
        const q = query(collection(firestoreDb, "users", auth.currentUser.uid + "/shopping_cart"));
        onSnapshot(q, (querySnapshot) => {
            setItems([])
            querySnapshot.forEach((doc) => {
                setItems(items => [...items, doc.data()])
            });
        });
    }

    async function writeNewPost() {
        const idGenerator = Math.floor(Math.random() * Math.floor(Math.random() * Date.now()))
        const q = query(collection(firestoreDb, "users", auth.currentUser.uid + "/shopping_cart"));
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((docc) => {
            try {
                const docRef = setDoc(doc(firestoreDb, "orders", `${idGenerator}/items/${docc.data().itemId}`), {
                    itemName: docc.data().itemName,
                    itemPrice: docc.data().itemPrice,
                    count: docc.data().count,
                    itemId: docc.data().itemId,
                    itemPictureUrl: docc.data().itemPictureUrl,
                    orderId: idGenerator
                }, { merge: true });
                console.log("Document written with ID: ", docRef.id);
            } catch (e) {
                console.error("Error adding document: ", e);
            }
        });
        try {
            const orderData = setDoc(doc(firestoreDb, "orders", `${idGenerator}`), {
                total: getTotal().replace(",","."),
                orderedBy: auth.currentUser.uid,
            }, { merge: true });
            const orderData2 = setDoc(doc(firestoreDb, "users", `${auth.currentUser.uid}/orders/${idGenerator}`), {
                orderId: idGenerator
            }, { merge: true });
            console.log("Document written with ID: ", orderData.id);
            console.log("Document written with ID: ", orderData2.id);
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    }

    function createOrder() {
        writeNewPost()
            .then(async () => {
                try {
                    const q = query(collection(firestoreDb, "users", auth.currentUser.uid + "/shopping_cart"));
                    const querySnapshot = await getDocs(q);

                    querySnapshot.forEach(async (docc) => { 
                        await deleteDoc(doc(firestoreDb, `users/${auth.currentUser.uid}/shopping_cart/${docc.data().itemId}`))
                    })
                } catch (e) {
                    console.error("Error adding document: ", e);
                }
            }).then(() => {
                //window.location.reload();
            })
    }

    useEffect(() => {
        getItems()
    }, [])

    useEffect(() => {
        ready()  
    })

    return (
        <>
            <div className='profile-main-container'>
                <div className='items-inner-container'>
                    <div className='items_item_container'>
                        {items.length > 0 ? items.map((item) => (

                            <div className='items_item'>
                                <div className='item_picture_container'>
                                    <img className='item-picture' src={item.itemPictureUrl}></img>
                                </div>
                                <div className='item_name_price_container'>
                                    <span className='item_name'>{item.itemName}</span>
                                    <span className='item_price'>{item.itemPrice}</span>
                                </div>
                                <div className='item-add-remove-button-container'>
                                    <button className='item-buttons-add' id={item.itemId}>+</button>
                                    <span className='item_count' >{item.count}</span>
                                    <button className='item-buttons-subtract' id={item.itemId}>-</button>
                                </div>
                            </div>


                        )) : <>Sepetinizde Ürün Bulunmamaktadır.</>}
                    </div>
                    <div className='items_info_container'>
                        <div className='items_info_inner_container'>
                            <span className='items_cost_header'>Toplam Tutar:</span>
                            {<span className='items_cost'>{getTotal()}<span className='TL'>TL</span></span>}
                            <div className='create-order'>
                                <button className="bn632-hover bn22 createOrder" type='Submit' onClick={createOrder}>Sipariş Oluştur</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}