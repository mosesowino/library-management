"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useState } from "react"

// import { backendUrl } from "@/app/page"

export default function ReturnBook({onAction, selectedBook}) {
  const [payment, setPayment] = useState()
  const [message, setMessage] = useState("")
  console.log("Selected Book:", selectedBook)


  const [cancel, setCancel] = useState(false)
  const [update, setUpdate] = useState(false)

    //update members debt at members endpoint using put method and selectedBook.member_id  
    const sendUpdate = async () => {
      try {
        const response = await fetch(`/members/debtUpdate/${selectedBook.member_id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ newDebt: selectedBook.fee }),
        });
    
        const data = await response.json();
    
        if (response.ok) {
          setMessage(data.message || "Member debt updated successfully!");
          sendToBackend(); 
        } else {
          setMessage(data.message || "Failed to update member debt.");
        }
      } catch (error) {
        setMessage("Failed to update member debt.");
      }
    };
    


    const sendToBackend = async () => {    
      if (!payment || payment <= 0) {
        setMessage("Please enter a valid payment amount")
        return
      }
  
      try {
        const response = await fetch(`/return`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            book_id: selectedBook.id,
            member_id: selectedBook.member_id,
            payment: payment,
          }),
        })
  
        const data = await response.json()
        console.log("Response data:", data)
  
        if (response.ok) {
          setMessage(`Book returned and payment of $${payment} processed successfully!`)
        } else {
          setMessage(`Error: ${data.error || "An error occurred"}`)
        }
      } catch (error) {
        setMessage("Failed to process the request")
      }
    }
  

    //update fee in transactions at transactions endpoint using put method and selectedBook.id and selectedBook.member_id
    //then proceed to send to backend(to return endpoint)
  const handleClick = (action) => {
    onAction(action)
    if (action === "done") {
      //update members debt at members endpoint using put method and selectedBook.member_id  
      if(selectedBook.fee != selectedBook.initial_fee){
        sendUpdate()
      }
      else{
        sendToBackend()
      }
    } 
  }

  return (
    <Card className="w-[350px] mx-auto">
      <CardHeader>
        <CardTitle>Return Book</CardTitle>
        <CardDescription>Return book and make payment</CardDescription>
      </CardHeader>
      <CardContent>
        <Card className="mb-3 mx-auto">
            <CardContent className="text-center">
                <p>Book Title: {selectedBook?.title}</p>
                <br />
                <p>Member name: {selectedBook?.name}</p>
                <p>Fee: {selectedBook?.fee}</p>
            </CardContent>
        </Card>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-2">
              <Input
               placeholder="Enter payment amount" 
               value={payment}
               onChange={(e) => setPayment(e.target.value)}
               type="number"
               step="0.1"
               min="0"
               />
            </div>
          </div>
          <p className="text-green-500">{message}</p>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => handleClick("cancel")}>Cancel</Button>
        <Button type="submit" onClick={() => handleClick("done")}>Done</Button>
      </CardFooter>
    </Card>
  )
}
