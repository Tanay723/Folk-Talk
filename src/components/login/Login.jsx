//This code defines the Login component for user authentication, including both login and registration functionality with Firebase Authentication

import { useState } from "react";
import "./login.css";
import {toast} from "react-toastify";
import { createUserWithEmailAndPassword , signInWithEmailAndPassword} from "firebase/auth";
import {auth,db} from "../../library/firebase"
import { doc, setDoc } from "firebase/firestore"; 

const Login =() => {

const[avatar,setAvatar]= useState({file:null,url:""})  //  Keeps track of the uploaded avatar image. It holds the file (file) and its URL (url).

const [loading,setLoading] = useState(false);

// The files in the handleAvatar function are not being stored in Firebase or any database. Instead, the file is temporarily handled and displayed on the user's browser as a preview.
const handleAvatar=e =>{
if(e.target.files[0])
    {setAvatar({
        file:e.target.files[0],
        url:URL.createObjectURL(e.target.files[0])
    })
  }
}

//The handleRegister function is called when the user submits the registration form.

const handleRegister = async (e) =>{
    e.preventDefault() // it stops the form from reloading the page when submitted
    const formData= new FormData(e.target)

    const {username,email,password} = Object.fromEntries(formData);  // is used to convert the formData into a JavaScript object and extract specific fields (email and password).
    

    try{
         
    const res = await createUserWithEmailAndPassword(auth,email,password) // giving error here but started working when i imported db and auth from ../../library/firebase
                                                                          // Firebase Authentication's createUserWithEmailAndPassword method to create a new user with the provided email and password.
    
    // After creating the user, it stores additional information (such as username, email, and user ID) in the Firestore users collection using setDoc.                                                                      
    await setDoc(doc(db, "users", res.user.uid), {
        username: username , // we can also simply write username since both on lhs and rhs name is same
        email, //what we did in above case, since name is same
        id: res.user.uid ,// we pass res.user.id in db because it makees works easy when we search for that id in db
        blocked: [],
    });


   // Additionally, an empty userchats document is created for the user in the Firestore userchats collection.
    await setDoc(doc(db, "userchats", res.user.uid), {
        chats:[],
    });


    // Success or error messages are displayed using toast notifications.
    toast.success("Account created! you can login now!")
    }catch(err){
        console.log(err)
        toast.error(err.message)
    }
}


//The handleLogin function is triggered when the user submits the login form.
const handleLogin = async(e) =>{
    e.preventDefault()
    setLoading(true) //The loading state is used to show loading indication while the authentication process is ongoing.

    const formData= new FormData(e.target)
    const {email,password} = Object.fromEntries(formData);  // is used to convert the formData into a JavaScript object and extract specific fields (email and password).

    try{
        await signInWithEmailAndPassword(auth,email,password)  //Firebase Authentication's signInWithEmailAndPassword method to authenticate the user with the provided credentials.

    }catch(err){
        console.log(err)
        toast.error(err.message)
    }
    finally{
        setLoading(false)
    }
}

    return (
        <div className="login">
            <div className="item143">
               <h2>Welcome,back</h2> 
               <form  onSubmit={handleLogin}>
                <input type="text" placeholder="Email" name="email"/>
                <input type="password" placeholder="Password" name="password"/>
                <button>Sign In</button>
               </form>
            </div>
            <div className="separator"></div>
            <div className="item143">
            <h2>Create an Account</h2> 
               <form onSubmit={handleRegister}>
                <label htmlFor="file">
                    <img src={avatar.url || "./avatar.png"} alt="" />
                    Upload an image</label>
               <input type="file" id="file" style={{display:"none"}} onChange={handleAvatar} />
                <input type="text" placeholder="Username" name="username"/>
                <input type="text" placeholder="Email" name="email"/>
                <input type="password" placeholder="Password" name="password"/>
                <button>Sign up</button>
               </form>
            </div>
        </div>
    )
}

export default Login
