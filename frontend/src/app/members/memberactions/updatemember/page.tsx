"use client"

import * as React from "react"
import { useState, useEffect } from "react"

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
// import { backendUrl } from "@/app/page"

export default function UpdateMember({ onAction, member }) {
  const [newName, setNewName] = useState("")
  const [newPhone, setNewPhone] = useState("")
  const [action, setAction] = useState("")
  const [message, setMessage] = useState("")
  const [showForm, setShowForm] = useState(true)

  const handleClick = (selectedAction: string) => {
    setAction(selectedAction)
    onAction(selectedAction)
  }

  useEffect(() => {
    if (action === "update") {
      const updatedData: Record<string, string> = {}

      if (newName.trim() !== "") {
        updatedData.name = newName
      }
      if (newPhone.trim() !== "") {
        updatedData.phone = newPhone
      }

      const sendUpdate = async () => {
        try {
          const response = await fetch(`/members/${member?.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedData),
          })

          const data = await response.json()
          setMessage(data.message || "Member updated successfully!")
          setShowForm(false)
        } catch (error) {
          setMessage("Failed to update member.")
          setShowForm(false)
        }
      }

      sendUpdate()
    }
  }, [action])

  return (
    <Card className="w-[350px] mx-auto">
      <CardHeader>
        <CardTitle>Update Member</CardTitle>
        <CardDescription>Only update the fields you wish to change</CardDescription>
      </CardHeader>
      <CardContent>
        {showForm ? (
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Card className="mb-2 p-2 text-sm">
                  <p><strong>Member ID:</strong> {member?.id}</p>
                  <p><strong>Name:</strong> {member?.name}</p>
                  <p><strong>Phone:</strong> {member?.phone}</p>
                </Card>
                <Input
                  placeholder="New Name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
                <Input
                  placeholder="New Phone"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                />
              </div>
            </div>
          </form>
        ) : (
          <p className="text-green-600">{message}</p>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => handleClick("cancel")}>Cancel</Button>
        {showForm && (
          <Button onClick={() => handleClick("update")}>Update</Button>
        )}
      </CardFooter>
    </Card>
  )
}
