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
// import { Book } from "./app.js";

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
const auth = getAuth()

onAuthStateChanged(auth, (user) => {
    if (user) {
        document.querySelector('.logIn-btn').style.display = 'none'
        document.querySelector('.logOut-btn').style.display = 'block'
        setData()
    } else {
        document.querySelector('.logIn-btn').style.display = 'block'
        document.querySelector('.logOut-btn').style.display = ''
    }
})

const setData = async () => {
    try {
        let data = await addDoc(collection(db, 'Book'), {
            title: Book.booktitle,
            author: Book.bookAuthor,
            pages: Book.bookPages,
            read: Book.bookRead
        })
        console.log('DATA', data, 'ID:', data.id)
        console.log('Storage', window.localStorage)

        let getData = await getDocs(collection(db, 'Book'))
        
        getData.forEach((book) => {
            console.log('New Data', book.data())
        })
    } catch (error) {
        console.log(error)
    }
    
    // db.collection('Book').add({
    //     title: '',
    //     author: '',
    //     pages: '',
    //     read: ''
    // })

}

document.querySelector('.logIn-btn').addEventListener('click', () => {
    
    console.log(auth, prov)
    console.log('Protocol', window.location.protocol)
    signInWithPopup(auth, prov)
    .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        const user = result.user;
        console.log(result)
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