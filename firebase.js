import { initializeApp } from "https://www.gstatic.com/firebasejs/9.11.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.11.0/firebase-analytics.js";
import { 
    getAuth, 
    GoogleAuthProvider, 
    onAuthStateChanged,
    signInWithPopup, 
    signOut
} from "https://www.gstatic.com/firebasejs/9.11.0/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/9.11.0/firebase-firestore.js"
import { Book, bookAddition, myLibrary } from "./app.js";

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
        // USE SET DATA TO SET THE DATA INTO THE DATABASE
    } else {
        document.querySelector('.logIn-btn').style.display = 'block'
        document.querySelector('.logOut-btn').style.display = ''
        userData = false;
    }
})

const setData = async (book) => {
    try {
        let data = await addDoc(collection(db, 'Book'), {
            title: book.bookTitle,
            author: book.bookAuthor,
            pages: book.bookPages,
            read: book.bookRead
        })
        console.log('DATA', data, 'ID:', data.id)
        console.log('Storage', window.localStorage)

        getData()
    } catch (error) {
        console.log(error)
    }
}

const getData = async () => {
    let savedData = await getDocs(collection(db, 'Book'))
        
    savedData.forEach((bookName) => {
        const getInfo = bookName.data();
        console.log('New Data', bookName.data(), bookName.data().title)
    })
}

document.querySelector('.logIn-btn').addEventListener('click', () => {
    
    console.log(auth, prov)
    console.log('Protocol', window.location.protocol)
    signInWithPopup(auth, prov)
    .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        const user = result.user;
        console.log('Result', result)
    }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.customData.email;
        const credential = GoogleAuthProvider.credentialFromError(error)
    })
})

document.querySelector('.logOut-btn').addEventListener('click', () => {
    signOut(auth)
})

export { setData, userData }