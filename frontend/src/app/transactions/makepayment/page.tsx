/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { Label } from "@/components/ui/label"
import { useState } from "react"

import { backendUrl } from "@/app/page"
import { ServerResponse } from "http"

export default function MakePayment({onAction, member}) {
  const[payment, setPayment] = useState("")
  const [memberId, setMemberId] = useState("")
  const [message, setMessage] = useState("")

  // const [cancel, setCancel] = useState(false)
  // const [paymentDone, setPaymentDone] = useState(false)

  const handleSubmit = async (e)=>{
    console.log("payment done")
  }

  const handleClick = (action) => {
    if (action === "cancel") {
      onAction("cancel")
    } else if (action === "done") {
      onAction("done")

      // Call the API to make payment if done is clicked
      async function makePayment() {
      const response = await fetch(`${backendUrl}/make_payment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          member_id: member.id,
          amount: payment
        }),
      })
      const data = await response.json()
      setMessage(data.message || "Payment made successfully!")
    }
    makePayment()
  }
  }


  return (
    <>
      <Card className="w-[350px] mx-auto">
        <CardHeader>
          <CardTitle>Make payment</CardTitle>
          <CardDescription>make payment to clear existing debt</CardDescription>
        </CardHeader>
        <CardContent>
          <Card className=" mb-3 mx-auto">
            {message ? 
            (<Card className=" mx-auto p-2 text-center text-green-500">
              {message}
            </Card>):
              <CardContent className="text-center">
                  <p>Member name: {member?.name}</p>
                  <p>Fee: {member?.debt}</p>
              </CardContent>
            }
          </Card>
          {message ? '':
          <form onSubmit={handleSubmit}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-2">
                <Input
                placeholder="Enter payment amount" 
                value={payment}
                onChange={(e) => {setPayment(e.target.value)}}
                />
              </div>
            </div>
          </form>
          }

        </CardContent>
        {
          message ? '':
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => handleClick("cancel")}>Cancel</Button>
          <Button type="submit" onClick={()=>handleClick("done")}>Done</Button>
        </CardFooter>
        }
      </Card>


    
    </>
  )
}
