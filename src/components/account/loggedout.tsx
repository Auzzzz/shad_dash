"use client"
import { signOut } from 'next-auth/react'
import React from 'react'
import toast from 'react-hot-toast'

const LoggedOut = () => {
    signOut({redirectTo: "/"}).catch(() => {
    toast.error("An error occurred while logging out. Please try again.");
  }
  )
  return (
    <div>
      You are being logged out. Please log back in

    </div>
  )
}

export default LoggedOut
