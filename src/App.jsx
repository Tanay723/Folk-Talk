import { useEffect } from "react";
import Chat from "./components/chat/Chat";
import Detail from "./components/detail/Detail";
import List from "./components/list/List"
import Login from "./components/login/Login";
import Notification from "./components/notification/Notification";
import {auth} from "../src/library/firebase"
import { onAuthStateChanged } from "firebase/auth";
import { useUserStore } from "./library/userStore";
import { useChatStore } from "./library/chatstore";

const App = () => {

   // const user= true; this method can be used for prop drilling , but since we arer using state management tools i.e. zustand in this case, hence we will use below template.
     
   const{currentUser,isLoading,fetchUserInfo}= useUserStore() // used for state management 
   const{chatId}= useChatStore()

   useEffect(()=>{ // giving error from here but after including auth from ../src/library/firebase , it resolved.
       const unSub = onAuthStateChanged(auth,(user)=>{
        fetchUserInfo(user?.uid) //it is giviing error in console
        
       })

        return ()=>{
          unSub();
        }
    },[fetchUserInfo])

    console.log(currentUser)

    if(isLoading) return <div className="loading">Loading...</div>

  return (
    <div className='container'>
      {
        currentUser ? (
        <>
        <List/>
        {chatId && <Chat/>} 
        {chatId && <Detail/>}

        </>
               ) 
        : (<Login/>)
      }

      <Notification/>
     
    </div>
  )
}

export default App