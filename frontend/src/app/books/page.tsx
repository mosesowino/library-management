"use client"

import Image from "next/image"
import Link from "next/link"
import {
  File,
  Home,
  LineChart,
  ListFilter,
  MoreHorizontal,
  BookOpenText,
  PanelLeft,
  PlusCircle,
  Search,
  Settings,
  Handshake,
  Users2,
  LucideInfo,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tabs,
  TabsContent,
} from "@/components/ui/tabs"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip"
import { useEffect, useState } from "react"
import AddBook from "./bookactions/addbook/page"
import UpdateBook from "./bookactions/updatebook/page"
import axios from "axios"
import AlertCard from "@/utilities/alertcard"
import { backendUrl } from "../page"

export default function Books() {
  const [books, setBooks] = useState<Book[]>([])
  const [showAddBookPanel, setShowAddBookPanel] = useState(false)
  const [editBook, setEditBook] = useState(false)
  const [currentBook, setCurrentBook] = useState()
  const [showAlert, setShowAlert] = useState(false)

  interface Book {
    author: string;
    id: number;
    cost_per_day: string;
    issued_copies: number;
    available_copies: number;
    title: string;
    total_copies: number;
  }

  // Function to fetch all books
  const fetchAllBooks = async () => {
    try {
      const result = await axios.get(`${backendUrl}/books`)
      if (result && result.data) {
        setBooks(result.data)
      }
    } catch (error) {
      console.error("Failed to fetch books:", error)
    }
  }

  useEffect(() => {
    fetchAllBooks()
  }, [])

  const handleAction = (type: [string?, string?, string?, string?, number?, number?]) => {
    console.log("Action chosen:", type)
    if (type[0] === "edit") {
      setCurrentBook({
        title: type[1]!,
        author: type[2]!,
        cost_per_day: type[3]!,
        total_copies: type[4]!,
        id: type[5]!,
      })
      console.log("current book", currentBook?.id)
      setEditBook(true)
    } else if (type[0] === "delete") {
      setCurrentBook({
        title: type[1]!,
        author: type[2]!,
        cost_per_day: type[3]!,
        total_copies: type[4]!,
        id: type[5]!,
      })
      setShowAlert(true)
    }
  }

  const handleActionFromUpdateBook = (type: string) => {
    console.log("Action chosen:", type)
    if (type === "update") {
      console.log("update book")
      fetchAllBooks() // Refetch the books after updating
      setTimeout(() => setEditBook(false), 5000)
    } else if (type === "cancel") {
      console.log("cancel update action")
      setEditBook(false)
    }
  }

  const handleActionFromAddBook = (type: string) => {
    if (type === "add") {
      console.log("add book")
      fetchAllBooks() // Refetch the books after adding
      setTimeout(() => setShowAddBookPanel(false), 5000)
    } else if (type === "cancel") {
      console.log("cancel add action")
      setShowAddBookPanel(false)
    }
  }

  const deleteBook = async () => {
    if (!currentBook?.id) return
    console.log("The id of this book bana, ", currentBook.id)

    try {
      const res = await fetch(`${backendUrl}/books/delete/${currentBook.id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        console.log("Book deleted successfully")
        // Refresh the books list
        fetchAllBooks()
      } else {
        console.error("Failed to delete book")
      }
    } catch (error) {
      console.error("Error deleting book:", error)
    } finally {
      setShowAlert(false)
    }
  }


  return (
    <div className="flex min-h-screen w-full flex-col bg-slate-800">
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
        <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
          <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                <Link
                    href="/"
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                >
                    <Home className="h-5 w-5" />
                    <span className="sr-only">Dashboard</span>
                </Link>
                </TooltipTrigger>
                <TooltipContent side="right">Dashboard</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                <Link
                    href="books/issued"
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                >
                    <Handshake className="h-5 w-5" />
                    <span className="sr-only">Issued</span>
                </Link>
                </TooltipTrigger>
                <TooltipContent side="right">Issued</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                <Link
                    href="/books"
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                >
                    <BookOpenText className="h-5 w-5" />
                    <span className="sr-only">books</span>
                </Link>
                </TooltipTrigger>
                <TooltipContent side="right">books</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                <Link
                    href="/members"
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                >
                    <Users2 className="h-5 w-5" />
                    <span className="sr-only">Members</span>
                </Link>
                </TooltipTrigger>
                <TooltipContent side="right">Members</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </nav>
        <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
          <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                <Link
                    href="#"
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                >
                    <Settings className="h-5 w-5" />
                    <span className="sr-only">Settings</span>
                </Link>
                </TooltipTrigger>
                <TooltipContent side="right">Settings</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </nav>
      </aside>
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline" className="sm:hidden">
                <PanelLeft className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="sm:max-w-xs">
              <nav className="grid gap-6 text-lg font-medium">
                <Link
                  href="/"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <Home className="h-5 w-5" />
                  Home
                </Link>
                <Link
                  href="#"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <Handshake className="h-5 w-5" />
                  Issued
                </Link>
                <Link
                  href="/books"
                  className="flex items-center gap-4 px-2.5 text-foreground"
                >
                  <BookOpenText className="h-5 w-5" />
                  books
                </Link>
                <Link
                  href="/members"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <Users2 className="h-5 w-5" />
                  Members
                </Link>
                <Link
                  href="#"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <LineChart className="h-5 w-5" />
                  Settings
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
          <Breadcrumb className="hidden md:flex">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/">Dashboard</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="#">books</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>All books</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="relative ml-auto flex-1 md:grow-0">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="overflow-hidden rounded-full"
              >
                A
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <Tabs defaultValue="all">
            <div className="flex items-center">
              <div className="ml-auto flex items-center gap-2">
                <Button size="sm" className="h-8 gap-1" onClick={()=>setShowAddBookPanel(!showAddBookPanel)}>
                  {showAddBookPanel?
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    show books
                  </span>:
                  <>
                  <PlusCircle className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Add Book
                  </span>
                  </>
                  }
                </Button>
              </div>
            </div>
            <TabsContent value="all">
            {showAddBookPanel ?
              <AddBook onAction={handleActionFromAddBook}/>:
              (editBook?
                 <UpdateBook onAction={handleActionFromUpdateBook} book={currentBook}/>:
              <Card x-chunk="dashboard-06-chunk-0">
                <CardHeader>
                  <CardTitle>books</CardTitle>
                  <CardDescription>
                    Manage your books.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Book Id</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="hidden md:table-cell">
                          Rent fee(ksh)
                        </TableHead>
                        <TableHead className="hidden md:table-cell">
                          quantity
                        </TableHead>
                        <TableHead className="hidden md:table-cell">
                          Issued
                        </TableHead>
                        <TableHead>
                          <span className="sr-only">Actions</span>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                        {books?
                            books.map((book)=>(
                            <TableRow key={book.id}>
                                <TableCell className="font-medium">
                                    <p className="font-bold">{book.title}</p>
                                    {/* <p className="bg-muted-accent">by {book.author}</p> */}
                                </TableCell>
                                <TableCell>
                                    {book.id}
                                </TableCell>
                                <TableCell>
                                <Badge variant="outline">
                                  {(book.total_copies <= book.issued_copies)?
                                   <p className="text-amber-400">not available</p>
                                   :
                                   <p className="text-green-400">available</p>
                                   }
                                </Badge>
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                    {book.cost_per_day}
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                    {book.total_copies}
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                    {book.issued_copies}
                                </TableCell>
                                <TableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                    <Button
                                        aria-haspopup="true"
                                        size="icon"
                                        variant="ghost"
                                    >
                                        <MoreHorizontal className="h-4 w-4" />
                                        <span className="sr-only">Toggle menu</span>
                                    </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuItem onClick={() => handleAction(["edit",book.title, book.author, book.cost_per_day, book.available_copies, book.id])}>Edit</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleAction(["delete",book.title, book.author, book.cost_per_day, book.available_copies, book.id])}>Delete</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                                </TableCell>
                            </TableRow>
                            )):''
                        }
                    </TableBody>
                  </Table>
                </CardContent>
                <CardFooter>
                  {showAlert && (
                        <AlertCard
                          title="Delete Book?"
                          description={`Are you sure you want to delete ${currentBook?.title}?`}
                          onConfirm={deleteBook}
                          onCancel={() => setShowAlert(false)}
                        />
                      )}
                </CardFooter>
              </Card>)
                }
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}


