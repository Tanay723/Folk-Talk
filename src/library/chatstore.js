// This code defines a Zustand store for managing chat-related states in a React app

import { doc, getDoc } from 'firebase/firestore';
import { create } from 'zustand'  // Store Setup with create()
import { db } from './firebase';
import { useUserStore } from './userStore';

export const useChatStore = create((set) => ({  // here we are creating chatstore using create 

// state variables
  chatId: null,
  user: null,
  isCurrentUserBlocked: false,
  isReceiverBlocked: false,

  // changeChat method is responsible for switching the current chat and handling blocking logic.
  changeChat: (chatId,user)=>{
      const currentUser = useUserStore.getState().currentUser
       
      // CHECK IF CURRENT USER IS BLOCKED

      if(user.blocked.includes(currentUser.id)){
         return set({
          chatId,
          user: null,
          isCurrentUserBlocked: true, // current user is blocked
          isReceiverBlocked: false,
         })
      }


      // CHECK IF RECEIVER IS BLOCKED

     else if(currentUser.blocked.includes(user.id)){
        return set({
         chatId,
         user: user,
         isCurrentUserBlocked: false, 
         isReceiverBlocked: true, // reciever is blocked 
        })
      } 
      
      else // when both are unblocked

      {
        return set({
        chatId,
        user,
        isCurrentUserBlocked: false,
        isReceiverBlocked: false,
       })
      
      }

  },

  changeBlock: ()=>{
     set((state)=> ({...state,isReceiverBlocked: !state.isReceiverBlocked}))  // It updates the isReceiverBlocked flag, which is a boolean that sees whether user is blocked or unblocekd
  }
  
}))
