
import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirestore, setDoc, doc, collection, query, where, getDoc, getDocs } from "firebase/firestore";
import { toast } from "react-toastify";

const firebaseConfig = {
  apiKey: "AIzaSyCmWWTiO19zhgWU979ayQWFZLAVZpPAZyY",
  authDomain: "chat-app-gs-1cd53.firebaseapp.com",
  projectId: "chat-app-gs-1cd53",
  storageBucket: "chat-app-gs-1cd53.appspot.com",
  messagingSenderId: "213194664618",
  appId: "1:213194664618:web:95f70f407e471f57e77ed3"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const signup = async (username, email, password) => {
    try {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        const user = res.user;
        await setDoc(doc(db, "users", user.uid), {
            id: user.uid,
            username: username.toLowerCase(),
            email,
            name: "",
            avatar: "",
            bio: "Hey, there I am using Chat App",
            lastSeen: Date.now()
        });
        await setDoc(doc(db, "chats", user.uid), {
            chatsData: [] // Ensure this matches what is expected in AppContext.jsx
        });
        toast.success("User registered successfully!");
    } catch (error) {
        console.error(error);
        toast.error(error.code.split('/')[1].split('-').join(' '));
    }
};


const login = async (email, password) => {
    try {
        await signInWithEmailAndPassword(auth, email, password);
        toast.success("Logged in successfully!");
    } catch (error) {
        console.error(error);
        toast.error(error.code.split('/')[1].split('-').join(' '));
    }
}

const logout = async () => {
    try{
        await signOut(auth);
    } catch{
        console.error("Logout error:", error);
        toast.error(error.code.split('/')[1].split('-').join(' '));
    }
}

const resetPass = async (email) => {
    if(!email){
        toast.error("Enter your valid Email");
        return null;
    }
    try {
        const userRef =  collection(db, 'users');
        const q = query(userRef, where("email", "==",email));
        const querySnap = await getDocs(q);
        if(!querySnap.empty){
            await sendPasswordResetEmail(auth, email);
            toast.success("Password reset link sent to your email");
        }
        else{
            toast.error("User not found");
        }
    } catch (error) {
        console.error(error);
        toast.error(error.message);
    }
}

export {signup, login, logout, auth, db,resetPass}