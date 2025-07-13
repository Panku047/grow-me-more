// lib/auth.ts
import { auth, db } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export const signUp = async (
  email: string, 
  password: string,
  name: string
  ) => {
    try{
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      // Save additional user info in Firestore
      await setDoc(doc(db, "users", user.uid), {
        email,
        name,
        createdAt: serverTimestamp(),
      });
      return user;
    }
    catch(error){
      console.error("Sign-up error:", error);
      alert("Error while sign up")
      throw error;
    }
  }

export const signIn = (email: string, password: string) =>
  signInWithEmailAndPassword(auth, email, password);

export const signOutUser = () => signOut(auth);
