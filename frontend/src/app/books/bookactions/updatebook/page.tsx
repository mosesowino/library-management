"use client"

import * as React from "react"
import { useState } from "react"
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

export default function UpdateBook({ onAction, book }) {
  const [newTitle, setNewTitle] = useState("")
  const [newAuthor, setNewAuthor] = useState("")
  const [newNumberOfCopies, setNewNumberOfCopies] = useState("")
  const [newFee, setNewFee] = useState("")
  const [updateMessage, setUpdateMessage] = useState("")
  const [showForm, setShowForm] = useState(true)

  const handleClick = async (action: string) => {
      onAction(action)

    if (action === "update") {
      // Only include fields that were actually changed
      const updatedFields: Record<string, string | number> = {}

      if (newTitle) updatedFields.title = newTitle
      if (newAuthor) updatedFields.author = newAuthor
      if (newNumberOfCopies) updatedFields.copies = parseInt(newNumberOfCopies)
      if (newFee) updatedFields.fee = parseFloat(newFee)

      if (Object.keys(updatedFields).length === 0) {
        setUpdateMessage("Please fill at least one field to update.")
        return
      }

      try {
        console.log("book ID ya hii kitabu", book.id)
        
        const response = await fetch(`/books/${book.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedFields),
        })

        const data = await response.json()
        setUpdateMessage(data.message || "Book updated successfully!")
        setShowForm(false)
      } catch (error) {
        setUpdateMessage("Failed to update book.", error)
        setShowForm(false)
      }
    }
  }

  return (
    <Card className="w-[350px] mx-auto">
      <CardHeader>
        <CardTitle>Update Book</CardTitle>
        <CardDescription>Only fill the fields you wish to update</CardDescription>
      </CardHeader>
      <CardContent>
        <Card className="py-4 mb-3 text-center">
          <p>Title: {book?.title}</p>
          <p>Author: {book?.author}</p>
        </Card>
        {showForm ? (
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Input
                  id="update-title"
                  placeholder="New Title"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
                <Input
                  id="update-author"
                  placeholder="New Author"
                  value={newAuthor}
                  onChange={(e) => setNewAuthor(e.target.value)}
                />
                <Input
                  id="update-copies"
                  placeholder="New Number of Copies"
                  value={newNumberOfCopies}
                  onChange={(e) => setNewNumberOfCopies(e.target.value)}
                />
                <Input
                  id="update-fee"
                  placeholder="New Fee"
                  value={newFee}
                  onChange={(e) => setNewFee(e.target.value)}
                />
              </div>
            </div>
          </form>
        ) : (
          <p className="text-green-600">{updateMessage}</p>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => handleClick("cancel")}>
          Cancel
        </Button>
        {showForm && (
          <Button onClick={() => handleClick("update")}>Update</Button>
        )}
      </CardFooter>
    </Card>
  )
}
