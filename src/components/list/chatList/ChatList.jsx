import { useEffect, useState } from "react"
import "./chatList.css"
import AddUser from "./addUser/addUser"
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { useUserStore } from "../../../library/userStore";
import { db } from "../../../library/firebase";
import { useChatStore } from "../../../library/chatstore";


const ChatList =() => {
    const [chats,setChats]= useState([]) //Stores the list of chat items fetched from Firebase.
    const [addMode,setAddMode]= useState(false) //Controls whether the "Add User" section is visible
    const [input,setInput]= useState("")

    const {currentUser} = useUserStore()  //fetching currentUser from useUserStore() 
    const {chatId,changeChat} = useChatStore()  //fetching chatId,changeChat from useChatStore() 


    //The useEffect hook listens for changes to the user's chat data from Firebase in real time (onSnapshot).
     useEffect(()=>{
         const unSub = onSnapshot(doc(db, "userchats",currentUser.id), async (res) => {
          const items = res.data().chats; //This retrieves the chats array from the response data res

          const promises = items.map(async(item)=>{
            const userDocRef = doc(db, "users", item.receiverId);
            const userDocSnap = await getDoc(userDocRef);

            const user= userDocSnap.data() //retrieves the data from a Firestore document snapshot userDocSnap and assigns it to the user constant

            return {...item,user}   //  creates a new object by spreading the properties of the item object and then adding with the user object
          })

          const chatData = await Promise.all(promises)
          setChats(chatData.sort((a,b)=> b.updatedAt - a.updatedAt)) // chat data is sorted by the most recent updatedAt timestamp, so we get the latest chat

               })
       return ()=>{
        unSub() // The cleanup function  unsubscribes from the listener when the component unmounts or when currentUser.id changes
        }

     },[currentUser.id])


     // This function is called when a user clicks on a chat. It updates the chat's isSeen status to true (marking it as read).

     const  handleSelect  = async(chat)=>{
       
      // It creates a new userChats object and updates the userchats collection to reflect the new isSeen status for the selected chat.
        const userChats = chats.map(item=>{
            const {user,...rest} = item
            return rest
        })
        

        //searches through the userChats array to find the index of the first element (item) where the chatId matches the chat.chatId. It returns the index of the matching element, or -1 if no match is found.
        const chatIndex = userChats.findIndex(item=>item.chatId === chat.chatId)
      
        userChats[chatIndex].isSeen = true

        const userChatsRef = doc(db,"userchats",currentUser.id) //  This creates a reference to the Firestore document located in the userchats collection with the currentUser.id as the document ID.

        try {
            await updateDoc(userChatsRef,{
                chats: userChats

            })
        } catch (err) {
           console.log(err) 
        }

        // changeChat(chat.chatId,chat.user)
     }
    
    // const filteredChats = chats.filter(c=> c.user.username.toLowerCase().include(input.toLowerCase()))
   
    return (
        <div className="chatList">
         <div className="search">
            <div className="searchBar">
                <input type="text" placeholder="Search" onChange={(e)=>setInput(e.target.value)} />
                <img src="./search.png" alt="" />
            </div>
            <img src={addMode ? "./minus.png" : "./plus.png"} alt="" className="add"
            onClick={()=> setAddMode((prev)=>!prev)}/>
            </div>  

            {Array.from(new Map(chats.map(chat => [chat.chatId, chat])).values()).map((chat) => (  //It ensures that duplicate chats are removed 
  <div className="item" key={chat.chatId} onClick={()=>handleSelect(chat)}
  style={{
    backgroundColor: chat?.isSeen ? "transparent" : "#5183fe", // changing msg background color if unread
  }}
  >
    <img src="./avatar.png" alt="" />
    <div className="texts">
       <span>{chat.user?.username || "Unknown User"}</span>  {/*Displays the username of the user from the chat object if it exists; otherwise, it shows "Unknown User" as a fallback. */}
      <p>{chat.lastMessage || "No message yet"}</p>    {/*Displays the lastMessage from the chat object if available; otherwise, it shows "No message yet" as a fallback. */}
    </div>
  </div>
))}


            
            
             {addMode && <AddUser/>}
        </div>
    )
}

export default ChatList;
