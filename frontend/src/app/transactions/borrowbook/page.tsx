"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { backendUrl } from "@/app/page";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAppContext } from "@/app/context/AppContext";

export default function IssueBook() {
  const { memberData } = useAppContext();
  const [books, setBooks] = useState<Book[]>([]);
  const [bookTitle_Author, setbookTitle_Author] = useState("");
  const [memberId, setMemberId] = useState("");
  const [suggestions, setSuggestions] = useState<Book[]>([]);

  interface Book {
    author: string;
    id: number;
    cost_per_day: string;
    issued_copies: number;
    available_copies: number;
    title: string;
    total_copies: number;
  }

  const fetchAllBooks = async () => {
    try {
      const result = await axios.get(`${backendUrl}/books`);
      if (result && result.data) {
        setBooks(result.data);
      }
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  useEffect(() => {
    fetchAllBooks();
  }, []);

  const match = books.find(
    (book) =>
      book.author.toLowerCase().includes(bookTitle_Author.toLowerCase()) ||
      book.title.toLowerCase().includes(bookTitle_Author.toLowerCase())
  );

  const selectedMember = memberData?.find(
    (member) => String(member.id) === memberId
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${backendUrl}/transactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ book_id: match?.id, member_id: memberId }),
      });

      if (response.ok) {
        console.log("Transaction successful!");
        setbookTitle_Author("");
        setMemberId("");
        await fetchAllBooks(); // ✅ refetch book availability
        // You could also trigger memberData update here if debt might change.
      } else {
        console.error("Failed to submit transaction");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setbookTitle_Author(value);

    const searchTerm = value.trim().toLowerCase();
    if (!searchTerm) {
      setSuggestions([]);
      return;
    }

    const filtered = books.filter(
      (book) =>
        book.author.toLowerCase().includes(searchTerm) ||
        book.title.toLowerCase().includes(searchTerm)
    );

    setSuggestions(filtered.slice(0, 5));
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-slate-800 p-4 md:gap-8 md:p-10">
        <div className="mx-auto w-full max-w-6xl">
          <h1 className="text-3xl font-semibold">Issue Book</h1>
        </div>
        <div className="mx-auto grid w-full max-w-6xl items-start gap-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Member</CardTitle>
                <CardDescription>Enter id of member borrowing book.</CardDescription>
              </CardHeader>
              <CardContent>
                <form>
                  <Input
                    type="text"
                    name="member_id"
                    placeholder="Member Id"
                    value={memberId}
                    onChange={(e) => setMemberId(e.target.value)}
                  />
                </form>
                {selectedMember && (
                  <Card className="py-2 px-4 mt-2">
                    {selectedMember.name}
                    {parseInt(selectedMember.debt) < 500 ? (
                      <p className="text-green-400">Eligible</p>
                    ) : (
                      <p className="text-amber-400">Not Eligible</p>
                    )}
                  </Card>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Book</CardTitle>
                <CardDescription>Enter book title or author name.</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                  <Input
                    type="text"
                    name="book_id"
                    placeholder="Title or author"
                    value={bookTitle_Author}
                    onChange={handleChange}
                    disabled={
                      !memberId || (selectedMember && parseInt(selectedMember.debt) >= 500)
                    }
                  />

                  <CardContent>
                    {suggestions.length > 0 && (
                      <ul className="absolute bg-white border rounded mt-1 shadow z-10 w-full max-h-60 overflow-y-auto">
                        {suggestions.map((book) => (
                          <li
                            key={book.id}
                            onClick={() => {
                              setbookTitle_Author(book.title);
                              setSuggestions([]);
                            }}
                            className="p-2 hover:bg-gray-100 cursor-pointer"
                          >
                            {book.title} — {book.author}
                            {book.total_copies > book.issued_copies ? (
                              <p className="ml-2 text-green-400">Available</p>
                            ) : (
                              <p className="ml-2 text-amber-400">Not Available</p>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}

                    <CardFooter className="border-t px-6 py-4 mb-0">
                      <Button
                        className="mb-0"
                        type="submit"
                        disabled={
                          !memberId ||
                          (selectedMember && parseInt(selectedMember.debt) > 500) ||
                          (match && match.issued_copies >= match.total_copies)
                        }
                      >
                        Submit
                      </Button>
                    </CardFooter>
                  </CardContent>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
