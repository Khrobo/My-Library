import { initializeApp } from "https://www.gstatic.com/firebasejs/9.11.0/firebase-app.js";
import { 
    getAuth, 
    GoogleAuthProvider, 
    onAuthStateChanged,
    signInWithPopup, 
    signOut
} from "https://www.gstatic.com/firebasejs/9.11.0/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, updateDoc, setDoc, doc, deleteDoc } from "https://www.gstatic.com/firebasejs/9.11.0/firebase-firestore.js"
import { bookAddition } from "./app.js";

const firebaseConfig = {
    apiKey: "AIzaSyClAHAAFHUoFWnCS2WKT4f3_2lF4APO3Lo",
    authDomain: "library-2974d.firebaseapp.com",
    projectId: "library-2974d",
    storageBucket: "library-2974d.appspot.com",
    messagingSenderId: "425784309642",
    appId: "1:425784309642:web:8d4ba0be0fb14ae7b87a73",
    measurementId: "G-PJY5803LEL"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app)
const prov = new GoogleAuthProvider()
const auth = getAuth();
let userData = false;

onAuthStateChanged(auth, (user) => {
    if (user) {
        document.querySelector('.logIn-btn').style.display = 'none'
        document.querySelector('.logOut-btn').style.display = 'block'
        userData = true
        document.querySelectorAll('.book').forEach(book => book.remove())
        getData()
    } else {
        document.querySelector('.logIn-btn').style.display = 'block'
        document.querySelector('.logOut-btn').style.display = ''
        userData = false;
        document.querySelectorAll('.book').forEach(book => {
            book.remove()
        })
        JSON.parse(window.localStorage.getItem('book')) ? JSON.parse(window.localStorage.getItem("book")).forEach(book => {
            bookAddition(book)
        }) : null 
    }
})

const setData = async (book) => {
    try {
        await setDoc(doc(db, 'Book', book.bookTitle), {
            bookTitle: book.bookTitle,
            bookAuthor: book.bookAuthor,
            bookPages: book.bookPages,
            bookRead: book.bookRead
        })
    } catch (error) {
        console.log(error)
    }
}

const getData = async () => {
    let savedData = await getDocs(collection(db, 'Book'))
        
    savedData.forEach((bookName) => {
        const getInfo = bookName.data();
        
        bookAddition(getInfo)
    })
}

document.querySelector('.logIn-btn').addEventListener('click', () => {    
    signInWithPopup(auth, prov)
    
})

document.querySelector('.logOut-btn').addEventListener('click', () => {
    signOut(auth)
})

export { setData, getData, userData, addDoc, getDocs, db, app, collection, updateDoc, setDoc, doc, deleteDoc }