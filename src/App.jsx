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
     
   const{currentUser,isLoading,fetchUserInfo}= useUserStore() // used for state management , useUserStore() manages user authentication state.
   const{chatId}= useChatStore() // useChatStore() handles chat-related state (chatId).

   useEffect(()=>{ //  Firebase Authentication Handling using useeffect hook
       const unSub = onAuthStateChanged(auth,(user)=>{  // onAuthStateChanged listens for user authentication status changes
        fetchUserInfo(user?.uid) //it is giviing error in console
        
       })

        return ()=>{
          unSub();
        }
    },[fetchUserInfo])

    console.log(currentUser)

    if(isLoading) return <div className="loading">Loading...</div> // If isLoading is true, it shows a loading screen.

  return (
    <div className='container'>
      {
        currentUser ? ( // If currentUser is authenticated , It Renders the chat list (List), chat window (Chat), and chat details (Detail) when a chat is selected.
        <>
        <List/>
        {chatId && <Chat/>} 
        {chatId && <Detail/>}

        </>
               ) 
        : (<Login/>) // Otherwise, it shows the login screen (Login).
      }

      <Notification/>
     
    </div>
  )
}

export default App
