import React, { useState, useEffect } from 'react'
import '../styles/main.css'
import { getDatabase, ref, child, push, update, set, get, onValue } from "firebase/database";
import { collection, query, where, onSnapshot, doc, getDoc, setDoc } from "firebase/firestore"; 
import { auth, firestoreDb } from '../firebase';

export default function PageMain() {
    let count
    let isKeyExist
    const [items, setItems] = useState([])

    async function checkKey(itemId) {
        const docRef = doc(firestoreDb, "users", auth.currentUser.uid + "/shopping_cart/" + itemId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            isKeyExist = true
        } else {
            isKeyExist = false
        }
    }


    async function getCount(itemId) {
        const docRef = doc(firestoreDb, "users", auth.currentUser.uid + "/shopping_cart/" + itemId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            count = docSnap.data().count
        } 
    }

    async function writeNewPost(uid, itemId, itemName, itemPrice, itemPictureUrl) {
        checkKey(itemId).then(() => {
            if (isKeyExist) {
                getCount(itemId).then(() => {
                    try {
                        const docRef =  setDoc(doc(firestoreDb, "users", uid + "/shopping_cart/" + itemId), {
                            count: count += 1
                        }, { merge: true });
                        console.log("Document written with ID: ", docRef.id);
                    } catch (e) {
                        console.error("Error adding document: ", e);
                    }

                })
            } else if (!isKeyExist) {
                try {
                    const docRef = setDoc(doc(firestoreDb, "users", uid + "/shopping_cart/" + itemId), {
                        itemName: itemName,
                        itemPrice: itemPrice,
                        count: 1,
                        itemId: itemId,
                        itemPictureUrl: itemPictureUrl
                    }, { merge: true });
                    console.log("Document written with ID: ", docRef.id);


                } catch (e) {
                    console.error("Error adding document: ", e);
                }
            }
        })
    }


    function addToCartButton() {
        document.querySelectorAll('.add-to-cart-button').forEach(function (addToCartButton) {
            addToCartButton.addEventListener('click', function (event) {
                addToCartButton.classList.add('added');
                setTimeout(function () {
                    addToCartButton.classList.remove('added');
                }, 2000);
            });
        });
    }

    function checkOverflow(el) {
        var curOverflow = el.style.overflow;

        if (!curOverflow || curOverflow === "visible")
            el.style.overflow = "hidden";

        var isOverflowing = el.clientWidth < el.scrollWidth
            || el.clientHeight < el.scrollHeight;

        el.style.overflow = curOverflow;

        return isOverflowing;
    }

    function overflowManagement() {
        const grid_container = document.getElementById("grid_container")
        const div4 = document.getElementById("div4")

        window.onzoom = function (e) {
            console.log(checkOverflow(div4));
            if (checkOverflow(div4)) {
                grid_container.style.gridTemplateColumns = "auto auto auto auto"
                if (checkOverflow(div4)) {
                    grid_container.style.gridTemplateColumns = "auto auto auto"
                    if (checkOverflow(div4)) {
                        grid_container.style.gridTemplateColumns = "auto auto"
                        if (checkOverflow(div4)) {
                            grid_container.style.gridTemplateColumns = "auto "
                        }
                    } else {
                        grid_container.style.gridTemplateColumns = "auto auto auto"
                    }
                } else {
                    grid_container.style.gridTemplateColumns = "auto auto auto auto"
                }
            } else {
                grid_container.style.gridTemplateColumns = "auto auto auto auto auto"
                if (checkOverflow(div4)) {
                    grid_container.style.gridTemplateColumns = "auto auto auto auto"
                    if (checkOverflow(div4)) {
                        grid_container.style.gridTemplateColumns = "auto auto auto"
                        if (checkOverflow(div4)) {
                            grid_container.style.gridTemplateColumns = "auto auto"
                            if (checkOverflow(div4)) {
                                grid_container.style.gridTemplateColumns = "auto"
                            }
                        }
                    }
                }
            }
            console.log("zooming")
        };

        (function () {
            var oldresize = window.onresize;
            window.onresize = function (e) {
                var event = window.event || e;
                if (typeof (oldresize) === 'function' && !oldresize.call(window, event)) {
                    return false;
                }
                if (typeof (window.onzoom) === 'function') {
                    return window.onzoom.call(window, event);
                }
            }
        })();
    }

    function ready() {
        var addToCartButtons = document.getElementsByClassName('add-to-cart-button')
        for (var i = 0; i < addToCartButtons.length; i++) {
            var button = addToCartButtons[i]
            button.addEventListener('click', addToCartClicked)
        }
    }

    function addToCartClicked(event) {
        var button = event.target
        var shopItem = button.parentElement
        if (button.className === "add-to-cart" || button.className === "added-to-cart") {
            shopItem = button.parentElement.parentElement
        }
        var title = shopItem.getElementsByClassName('shop-item-title')[0].innerText
        var price = shopItem.getElementsByClassName('shop-item-price')[0].innerText
        var imageSrc = shopItem.getElementsByClassName('shop-item-image')[0].src
        var itemId = shopItem.getElementsByClassName('add-to-cart-button')[0].id

        addItemToCart(itemId, title, price, imageSrc)
    }

    function addItemToCart(itemId, title, price, imageSrc) {
        writeNewPost(auth.currentUser.uid, itemId, title, price, imageSrc)
        console.log("added");
    }


    async function getItems() {
        const q = query(collection(firestoreDb, "products"));
        onSnapshot(q, (querySnapshot) => {
            querySnapshot.forEach((doc) => {
                setItems(items => [...items, doc.data()])
            });
        });
    }


    function overflowManagementFirstLoad() {
        const grid_container = document.getElementById("grid_container")
        const div4 = document.getElementById("div4")
        if (checkOverflow(div4)) {
            grid_container.style.gridTemplateColumns = "auto auto auto auto"
            if (checkOverflow(div4)) {
                grid_container.style.gridTemplateColumns = "auto auto auto"
                if (checkOverflow(div4)) {
                    grid_container.style.gridTemplateColumns = "auto auto"
                    if (checkOverflow(div4)) {
                        grid_container.style.gridTemplateColumns = "auto "
                    }
                } else {
                    grid_container.style.gridTemplateColumns = "auto auto auto"
                }
            } else {
                grid_container.style.gridTemplateColumns = "auto auto auto auto"
            }
        } else {
            grid_container.style.gridTemplateColumns = "auto auto auto auto auto"
            if (checkOverflow(div4)) {
                grid_container.style.gridTemplateColumns = "auto auto auto auto"
                if (checkOverflow(div4)) {
                    grid_container.style.gridTemplateColumns = "auto auto auto"
                    if (checkOverflow(div4)) {
                        grid_container.style.gridTemplateColumns = "auto auto"
                        if (checkOverflow(div4)) {
                            grid_container.style.gridTemplateColumns = "auto"
                        }
                    }
                }
            }
        }
    }

    useEffect(() => {
        getItems()
    }, [])

    useEffect(() => {
        addToCartButton()
        overflowManagement()
        ready()
        overflowManagementFirstLoad()
})

    return (
        <>
            <div className="parent">
                <div className="div2">
                    <div className="category_outer">
                        <div id="category_title">
                            <h1>Kategoriler</h1>
                        </div>
                        <div>
                            <a href="/">
                                <button className="category_button" name="allproducts">
                                    <div>
                                        <div className="category_name">Tüm Ürünler</div>
                                    </div>
                                </button>
                            </a>
                            <a href="/categories/soznisankutusu">
                                <button className="category_button" name="soznisankutusu">
                                    <div>
                                        <div className="category_name">Söz Nişan Kutusu</div>
                                    </div>
                                </button>
                            </a>
                            <a href="/categories/gelinkinaduvagi">
                                <button className="category_button" name="gelinkinaduvagi">
                                    <div>
                                        <div className="category_name">Gelin Kına Duvağı</div>
                                    </div>
                                </button>
                            </a>
                            <a href="/categories/bohcasusu">
                                <button className="category_button" name="bohcasusu">
                                    <div>
                                        <div className="category_name">Bohça Süsü</div>
                                    </div>
                                </button>
                            </a>
                            <a href="/categories/soztepsisi">
                                <button className="category_button" name="soztepsisi">
                                    <div>
                                        <div className="category_name">Söz Tepsisi</div>
                                    </div>
                                </button>
                            </a>
                            <a href="/categories/nedimetaci">
                                <button className="category_button" name="nedimetaci">
                                    <div>
                                        <div className="category_name">Nedime Taçı</div>
                                    </div>
                                </button>
                            </a>
                            <a href="/categories/gelinmendili">
                                <button className="category_button" name="gelinmendili">
                                    <div>
                                        <div className="category_name">Gelin Mendili</div>
                                    </div>
                                </button>
                            </a>
                            <a href="/categories/mumcesitleri">
                                <button className="category_button" name="mumcesitleri">
                                    <div>
                                        <div className="category_name">Mum Çeşitleri</div>
                                    </div>
                                </button>
                            </a>
                            <a href="/categories/elgulu">
                                <button className="category_button" name="elgulu">
                                    <div>
                                        <div className="category_name">El Gülü</div>
                                    </div>
                                </button>
                            </a>
                            <a href="/categories/dansmalzemeleri">
                                <button className="category_button" name="dansmalzemeleri">
                                    <div>
                                        <div className="category_name">Dans Malzemeleri</div>
                                    </div>
                                </button>
                            </a>
                            <a href="/categories/dagatmalikkina">
                                <button className="category_button" id="bottom_one" name="dagatmalikkina">
                                    <div>
                                        <div className="category_name">Dağatmalık Kına</div>
                                    </div>
                                </button>
                            </a>
                        </div>
                    </div>
                </div>

                <div className="div4" id="div4">
                    <div className="product-list">
                        <div className="grid_container shop-items" id='grid_container'>
                            {items.map((item) => (
                                <div className="grid-item shop-item product-background">
                                    <img className="shop-item-image product-image" src={item.itemPictureUrl} />
                                    <span className="shop-item-title product-name">{item.itemName}</span>

                                    <span className="shop-item-price">{item.itemPrice + " TL"}</span>


                                    <button className="btn btn-primary add-to-cart-button" id={item.itemId} type='button'>
                                        <svg className="add-to-cart-box box-1" width={24} height={24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <rect width={24} height={24} rx={2} fill="#ffffff" />
                                        </svg>
                                        <svg className="add-to-cart-box box-2" width={24} height={24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <rect width={24} height={24} rx={2} fill="#ffffff" />
                                        </svg>
                                        <svg className="cart-icon" xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                                            <circle cx={9} cy={21} r={1} />
                                            <circle cx={20} cy={21} r={1} />
                                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                                        </svg>
                                        <svg className="tick" xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24">
                                            <path fill="none" d="M0 0h24v24H0V0z" />
                                            <path fill="#ffffff" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM9.29 16.29L5.7 12.7c-.39-.39-.39-1.02 0-1.41.39-.39 1.02-.39 1.41 0L10 14.17l6.88-6.88c.39-.39 1.02-.39 1.41 0 .39.39.39 1.02 0 1.41l-7.59 7.59c-.38.39-1.02.39-1.41 0z" />
                                        </svg>
                                        <span className="add-to-cart">Sepete Ekle</span>
                                        <span className="added-to-cart">Sepete Eklendi</span>
                                    </button>
                                </div>
                            ))}

                        </div>
                    </div>
                </div>
            </div>

            <script src='.../html-scripts/main.js'></script>



        </>
    )
}
