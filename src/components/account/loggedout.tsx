"use client"
import { signOut } from 'next-auth/react'
import React from 'react'
import toast from 'react-hot-toast'

const LoggedOut = () => {
    signOut({redirectTo: "/"})
    // toast.error("You have been logged out. Please log back in.")
  return (
    <div>
      You are being logged out. Please log back in

    </div>
  )
}

export default LoggedOut
