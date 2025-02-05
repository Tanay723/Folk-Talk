import { useEffect, useRef, useState } from "react"
import "./chat.css"
import EmojiPicker from "emoji-picker-react"
import { arrayUnion, doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../library/firebase";
import { useChatStore } from "../../library/chatstore";
import { useUserStore } from "../../library/userStore";


const Chat =() => {
  const [chat,setChat] = useState(); //Stores the current chat data.
  const [open,setOpen] = useState(false); //Controls whether the emoji picker is open or not.
 const [text,setText] = useState(""); //Stores the current message being typed by the user.

 const {currentUser} = useUserStore() // Retrieves the current user’s data.
 const {chatId,user,isCurrentUserBlocked, isReceiverBlocked} = useChatStore() //Retrieves chat information and whether either user is blocked.

const endRef=useRef(null); // endRef: Holds a reference to a DOM element, allowing direct manipulation or access to it.

//The below useEffect ensures the chat automatically scrolls to the latest message by using the endRef reference.
useEffect(()=>{
  endRef.current?.scrollIntoView({behavior:"smooth"} )
},[])


// The second useEffect listens for real-time updates to the current chat by subscribing to the chats document in Firestore. Whenever the chat changes, the component state is updated with new chat data.
useEffect(()=>{
   const unSub = onSnapshot(doc(db,"chats",chatId),(res)=>{
    setChat(res.data())
   })

   return () =>{
    unSub
   }
},[chatId])

console.log(chat)


 const handleEmoji= e =>{  //Adds the selected emoji to the message being typed and closes the emoji picker.
    setText((prev)=>prev+ e.emoji);
    setOpen(false)
 }


//Sends the typed message to Firestore and updates the messages array in the current chat document.
 const handleSend = async () =>{
  if(text=="") return;  // if there is no msg

  try {


    //Updates the messages array of the chat document (identified by chatId) in Firestore, adding a new message object that includes the sender's ID, message text, and the timestamp (createdAt).
    await updateDoc(doc(db,"chats",chatId),{
      messages:arrayUnion({
        senderId: currentUser.id,
        text,
        createdAt: new Date(),
      })
    })


    //Iterates over both user IDs (the current user and the other user in the chat) to update their individual chat references. 
   //, For each user, it checks if the chatId   in their userChats and updates the lastMessage, isSeen, and updatedAt fields.
    const userIDs = [currentUser.id,user.id]

    userIDs.forEach(async (id)=>{
    
      const userChatsRef = doc(db,"userchats",id)
      const userChatsSnapshsot = await getDoc(userChatsRef)
  
      if(userChatsSnapshsot.exists()){
        const userChatsData = userChatsSnapshsot.data()
  
        const chatIndex = userChatsData.chats.findIndex(
          c=>c.chatId === chatId
        )
        userChatsData.chats[chatIndex].lastMessage = text  // Updates the lastMessage  of the chat at chatIndex in the userChatsData object with the new text message.
        
         //Sets the isSeen property to true if the id is equal to currentUser.id, indicating the current user has seen the message. Otherwise, it sets it to false for the other user.
        userChatsData.chats[chatIndex].isSeen = id === currentUser.id? true : false 
        
        userChatsData.chats[chatIndex].updatedAt = Date.now() //Updates the updatedAt property with the current timestamp (Date.now()), indicating when the chat was last updated.
  

        //After modifying the chat's details (like the last message and seen status), it updates the userChats collection for each user with the new data.
        await updateDoc(userChatsRef,{
          chats:userChatsData.chats,
        })
      
      }

    })

    
  } catch (err) {
    console.log(err)
  }
 }

 console.log(text)

    return (
        <div className="chat">
            <div className="top">
                <div className="user">
                    <img src={ user?.avatar || "./avatar.png"} alt="" />
                    <div className="texts">
                       <span>{user?.username}</span>
                       <p>Lorem ipsum dolor sit amet.</p>
                      </div>
                </div>

                <div className="icons">
                   <img src="./phone.png" alt="" />
                   <img src="./video.png" alt="" /> 
                   <img src="./info.png" alt="" />
                </div>

            </div>

            <div className="center">

              { chat?.messages?.map((message)=>(
                <div className="message own" key = {message?.createAt}>
                <div className="texts1">
                  {message.img && <img src={message.img} alt="" />}
                    <p>{message.text}</p>
                    {/* <span>1 min ago</span> */}
                </div>
              </div>
             )) }

              
              <div ref={endRef}> </div>
            </div>

            <div className="bottom">
            <div className="icons">
               <img src="./img.png" alt="" />
               <img src="./camera.png" alt="" />
               <img src="./mic.png" alt="" />

            </div>
             <input type="text" placeholder="Type a message..." value={text} onChange={e=>setText(e.target.value)}
             disabled={isCurrentUserBlocked || isReceiverBlocked}
             /> 
              
              <div className="emoji">
                {<img src="./emoji.png" alt="" onClick={()=> setOpen((prev) => !prev)}/> }
               
                <div className="picker">
                <EmojiPicker open={open}  onEmojiClick={handleEmoji}/>
                </div>
                
              </div>
              <button className="sendButton" onClick={handleSend} disabled={isCurrentUserBlocked || isReceiverBlocked}>Send</button>
            </div>
        </div>
    )
}

export default Chat
