import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { useChatStore } from "../../library/chatstore";
import { auth, db } from "../../library/firebase";
import { useUserStore } from "../../library/userStore";
import "./detail.css";

const Detail = () => {

  const { chatId , user ,isCurrentUserBlocked, isReceiverBlocked, changeBlock } = useChatStore()

  const {currentUser} = useUserStore()

  const handleBlock = async() =>{
       if(!user) return  //This checks if the user object exists. If not, the function exits early to avoid errors.

       const userDocRef = doc(db,"users",currentUser.id) //Creates a reference to the document for the current user (currentUser.id) in the users collection of Firestore.

       try {
        await updateDoc(userDocRef,{
          blocked: isReceiverBlocked ? arrayRemove(user.id) : arrayUnion(user.id), //if isReceiverBlocked is true, it removes the user.id from the blocked list; if false, it adds the user.id to the list.
        })

        changeBlock() //Calls the changeBlock function to update the UI or perform other actions after the block/unblock operation.

       } catch (err) {
        console.log(err)
       }
   }

  return (
    <div className="detail">
      <div className="user1">
        <img src={user?.avatar || "./avatar.png"} alt="" />
        <h2>{user?.username}</h2>
        <p>Lorem ipsum, dolor sit amet .</p>
      </div>

      <div className="info1">
        <div className="option">
          <div className="title">
            <span>Chat Settings</span>
            <img src="./arrowUp.png" alt="" />
          </div>
        </div>

        <div className="option">
          <div className="title">
            <span>Privacy & help</span>
            <img src="./arrowUp.png" alt="" />
          </div>
        </div>

        <div className="option">
          <div className="title">
            <span>Shared photos</span>
            <img src="./arrowDown.png" alt="" />
          </div>

          <div className="photos">
            <div className="photoItem">
              <div className="photoDetail">
                <img src="./flower.jpg" />
                <span>photo_2024_2.png</span>
              </div>
              <img src="./download.png" alt="" className="icon53" />
            </div>

            <div className="photoItem">
              <div className="photoDetail">
                <img src="./flower.jpg" />
                <span>photo_2024_2.png</span>
              </div>
              <img src="./download.png" alt="" className="icon53" />
            </div>

            <div className="photoItem">
              <div className="photoDetail">
                <img src="./flower.jpg" />
                <span>photo_2024_2.png</span>
              </div>
              <img src="./download.png" alt="" className="icon53" />
            </div>
          </div>
        </div>

        <div className="option">
          <div className="title">
            <span>Shared Files</span>
            <img src="./arrowUp.png" alt="" />
          </div>
        </div> 
      <button onClick={handleBlock}>
        {
      isCurrentUserBlocked ? "You are blocked!" : isReceiverBlocked ? "Unblock User" : "Block User"
    
    
    }
    </button> 
      <button className="logout" onClick={()=>auth.signOut()}>Logout</button>
      </div>
    </div>
  );
};

export default Detail;
