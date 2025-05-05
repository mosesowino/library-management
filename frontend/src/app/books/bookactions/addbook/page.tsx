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
import { Label } from "@/components/ui/label"
// import { backendUrl } from "@/app/page"

export default function AddBook({ onAction }) {
  const [addBookMessage, setAddBookMessage] = useState("")
  const [showForm, setShowForm] = useState(true)
  const [title, setTitle] = useState("")
  const [author, setAuthor] = useState("")
  const [copies, setCopies] = useState("")
  const [fee, setFee] = useState("")

  const handleClick = async (selectedAction: string) => {
    onAction(selectedAction)
    if (selectedAction === "add") {
      const newBook = {
        title,
        author,
        copies,
        fee,
        issued: 0,
      }

      try {
        const response = await fetch('/books', {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newBook),
        })

        const data = await response.json()
        setAddBookMessage(data.message || "Book added successfully!")
        setShowForm(false)
        setTitle("")
        setAuthor("")
        setCopies("")
        setFee("")
      } catch (error) {
        setAddBookMessage("Error adding book.")
        setShowForm(false)
      }
    }
  }

  return (
    <Card className="w-[350px] mx-auto">
      <CardHeader>
        <CardTitle>Add New Book</CardTitle>
        <CardDescription>Book Id is generated for you</CardDescription>
      </CardHeader>
      <CardContent>
        {showForm ? (
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="book-title">Title</Label>
                <Input
                  id="book-title"
                  placeholder="Book Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <Label htmlFor="book-author">Author</Label>
                <Input
                  id="book-author"
                  placeholder="Author"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                />
                <Label htmlFor="book-copies">Number of copies</Label>
                <Input
                  id="book-copies"
                  placeholder="Number of copies"
                  value={copies}
                  onChange={(e) => setCopies(e.target.value)}
                />
                <Label htmlFor="book-fee">Fee</Label>
                <Input
                  id="book-fee"
                  placeholder="Fee"
                  value={fee}
                  onChange={(e) => setFee(e.target.value)}
                />
              </div>
            </div>
          </form>
        ) : (
          <p className="text-green-600">{addBookMessage}</p>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => handleClick("cancel")}>
          Cancel
        </Button>
        {showForm && (
          <Button onClick={() => handleClick("add")}>Add</Button>
        )}
      </CardFooter>
    </Card>
  )
}
