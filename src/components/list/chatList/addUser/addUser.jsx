import "./addUser.css"
import { arrayUnion, collection, doc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore";
import {db} from "../../../../library/firebase";
import { useState } from "react";
import {useUserStore} from "../../../../library/userStore";


const AddUser =() => {

  const [user,setUser] = useState(null)  // Stores the user data that is fetched after searching for a username.

  const {currentUser} = useUserStore()  // Fetches the data of the currently logged-in user using the useUserStore
 

  //When the user submits the search form, this function is triggered.
  const handleSearch= async (e) => {
     e.preventDefault()

     //It retrieves the username input using FormData, then performs a query to the Firebase Firestore users collection to find a user with that username.
     const formData= new FormData(e.target)
     const username = formData.get("username")
     
     //If a matching user is found, the user data is stored in the user state, which will be used for adding the user to the chat.
     try {
      const userRef = collection(db, "users");
      const q = query(userRef, where("username", "==", username)); // query for matching username in db
      
      const querySnapShot = await getDocs(q)

      if(!querySnapShot.empty){
        setUser(querySnapShot.docs[0].data()) //If documents exist, it retrieves the data from the first document (docs[0]) and updates the user state with that data.
      }

     } catch (err) {
      console.log(err);
     }
  }
 

  //Once the user is found, the handleAdd function creates a new chat

  const handleAdd = async ()=>{
    const chatRef = collection(db,"chats") //A new document is added to the chats collection in Firestore 
    const useChatsRef = collection(db,"userchats")

    try {
     const newChatRef= doc(chatRef) // it is referencing chatRef

      await setDoc(newChatRef,{  // A new document is added to the chats collection in Firestore with createdAt as a timestamp and an empty messages array.
          createdAt: serverTimestamp(),
          messages: [],
      })
      

      //It adds the new chat to the chats array for user, with necessary information like chatId, lastMessage, receiverId, and updatedAt
      await updateDoc(doc(useChatsRef,user.id),{
        chats:arrayUnion({ //arrayUnion is used to ensure that the new chat is added to the user's chat list without duplicating existing chats.
          chatId: newChatRef.id,
          lastMessage: "",
          receiverId: currentUser.id,
          updatedAt: Date.now(),

        })
      })

     // It adds the new chat to the chats array for currentuser, with necessary information like chatId, lastMessage, receiverId, and updatedAt
      await updateDoc(doc(useChatsRef,currentUser.id),{
        chats:arrayUnion({
          chatId: newChatRef.id,
          lastMessage: "",
          receiverId: user.id,
          updatedAt: Date.now(),

        })
      })


      console.log(newChatRef.id)

    } catch (err) {
      console.log(err);
    }
  }

    return (
        <div className="addUser">
          <form onSubmit={handleSearch}>
            <input type="text" placeholder="Username" name="username" />
            <button>Search</button>
          </form>  
       {user && <div className="user253">
            <div className="detail7">
                <img src={user.avatar || "./avatar.png"} alt="" />
                <span>{user.username}</span>
            </div>
             <button onClick={handleAdd} >Add User</button> {/* If a user is found (i.e., user state is set), the user's details (avatar and username) are displayed along with a button to "Add User." */}
        </div>}
        </div>
    )
}

export default AddUser
