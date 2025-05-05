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
import { Label } from "@/components/ui/label"
import { backendUrl } from "@/app/page"

export default function AddMember({ onAction }) {
  const [newMemberName, setNewMemberName] = useState("")
  const [newMemberPhone, setNewMemberPhone] = useState("")
  const [newMemberEmail, setNewMemberEmail] = useState("")
  const [addMemberMessage, setAddMemberMessage] = useState("")
  const [action, setAction] = useState("")
  const [showForm, setShowForm] = useState(true)

  const handleClick = (selectedAction: string) => {
    setAction(selectedAction)
    onAction(selectedAction)
  }

  useEffect(() => {
    if (action === "add") {
      const newMember = {
        name: newMemberName,
        email: newMemberEmail,
        phone: newMemberPhone,
      }

      const sendToBackend = async () => {
        try {
          const response = await fetch(`${backendUrl}/members`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newMember),
          })
          const data = await response.json()
          setAddMemberMessage(data.message || "Member added successfully!")
          setShowForm(false)
        } catch (error) {
          // setAddMemberMessage("Error adding member.")
          setShowForm(false)
        }
      }

      sendToBackend()
    }
  }, [action])

  return (
    <Card className="w-[350px] m-auto">
      <CardHeader>
        <CardTitle>Add New Member</CardTitle>
        <CardDescription>The Member Id is generated for you</CardDescription>
      </CardHeader>
      <CardContent>
        {showForm ? (
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="member-name">Name</Label>
                <Input
                  id="member-name"
                  placeholder="Name of new user"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                />
                <Label htmlFor="member-phone">Phone</Label>
                <Input
                  id="member-phone"
                  placeholder="Phone number"
                  value={newMemberPhone}
                  onChange={(e) => setNewMemberPhone(e.target.value)}
                />
                <Label htmlFor="member-email">Email</Label>
                <Input
                  id="member-email"
                  placeholder="Email address"
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                />
              </div>
            </div>
          </form>
        ) : (
          <p className="text-green-600">{addMemberMessage}</p>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => handleClick("cancel")}>
          Cancel
        </Button>
        {showForm && (
          <Button onClick={() => handleClick("add")}>
            Add
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
