"use client"

import {
  Toast,
  ToastProvider,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastViewport,
} from "@/components/ui/toast"
import { useState } from "react"

export default function TransactionToast({showToast}) {
  const [open, setOpen] = useState(false)
  const[message, setMessage] = useState("")
  const [alertType, setAlertType] = useState("")
  if(showToast === "True"){
    setOpen(true)
    setMessage("Book issued to member. View the transaction in the dashboard.")
    setAlertType("success")
    }else if(showToast === "False"){
    setOpen(true)
    setMessage("Book not issued to member. Please try again.")
    setAlertType("error")
}

  const handleSuccess = () => {
    setOpen(true)
  }


  return (
    <ToastProvider>
      <button
        onClick={handleSuccess}
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Issue Book
      </button>

      <Toast
        open={open}
        onOpenChange={setOpen}
        duration={5000} 
      >
        <div className="flex flex-col space-y-1">
          <ToastTitle>{alertType}</ToastTitle>
          <ToastDescription>
            {message}
          </ToastDescription>
        </div>
        <ToastClose />
      </Toast>

      <ToastViewport />
    </ToastProvider>
  )
}
