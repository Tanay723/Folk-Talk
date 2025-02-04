//this code is used for managing the state related to the current user's data

import { doc, getDoc } from 'firebase/firestore'; // The doc() function is used to create a reference to a specific document within a Firestore collection.
                                                  // The getDoc() function is used to retrieve the data from a document in Firestore, using the document reference created by doc().
import { create } from 'zustand'
import { db } from './firebase';

export const useUserStore = create((set) => ({  //userstore is created using create
 
  //state variables
  currentUser: null,
  isLoading: true,
  fetchUserInfo: async (uid) =>{  // It is an asynchronous method that fetches the user’s data from Firestore based on the provided uid

    if(!uid) return set({currentUser:null, isLoading: false}) //If no uid is provided, it sets currentUser to null and isLoading to false.

        try {
            const docRef = doc(db, "users", uid); // docRef: A reference to the document you want to retrieve.
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {   // if that document exists
              set({currentUser:docSnap.data(), isLoading: false}) //the currentUser state is updated with the user data, and isLoading is set to false.
           } else{
            set({currentUser:null, isLoading: false}) // it sets currentUser to null and isLoading to false.
           }

        }
        
        //If there’s an error while fetching the user data (e.g., network issues), it catches the error, logs it, and sets currentUser to null and isLoading to false.
        catch (err) {
            console.log(err);
            return set({currentUser:null, isLoading: false})
        }
  }
}))
