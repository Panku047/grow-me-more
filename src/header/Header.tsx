"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import Link from "next/link";
import Profile from "./Profile";
import Image from "next/image";

export default function Header() {
  const [user, setUser] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      console.log("User logged in:", firebaseUser);

      if (firebaseUser) {
        const docRef = doc(db, "users", firebaseUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          console.log("User Firestore data:", docSnap.data());
          setUserData(docSnap.data());
        } else {
          console.warn("No user data found in Firestore.");
        }
      } else {
        setUserData(null); // Clear data on logout
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <header className="w-full bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between sm:px-6 lg:px-8">
        <Link href="/">
          <Image
            src="/logo.png"       // path is relative to public/
            alt="Site Logo"
            width={100}
            height={100}
            priority  
            quality={100}             // optional: load faster for LCP
          />
        </Link>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Profile />
              {/* <span className="text-lg text-gray-600">
                {userData?.name || user.displayName}
              </span> */}
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-md px-4 py-2 text-sm font-medium text-gray-700 bg-sky-100 hover:text-black"
              >
                LOGIN
              </Link>
              <Link
                href="/register"
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                CREATE ACCOUNT
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
