"use client"


import Image from "next/image"
import Link from "next/link"
import {
  Home,
  LineChart,
  ListFilter,
  MoreHorizontal,
  BookOpenText,
  PanelLeft,
  Search,
  Settings,
  Handshake,
  Users2,
  LucideInfo,
} from "lucide-react"

// import { Badge } from "@/components/ui/badge"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
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

import { backendUrl } from "../../page"
import { useEffect, useState } from "react"
import ReturnBook from "@/app/transactions/returnbook/page"

export default function Issued() {
  const [issuedBooks, setIssuedBooks] = useState([])
  const [showReturnBookPanel, setShowReturnBookPanel] = useState(false)
  const [selectedBook, setSelectedBook] = useState(null)
  
  useEffect(() => {
    const fetchIssuedBooks = async () => {
      const response = await fetch(`${backendUrl}/issued_books`)
      if (!response.ok) {
        throw new Error("Failed to fetch issued books")
      }
      const data = await response.json()
      setIssuedBooks(data)
      console.log("Issued books data:", data)
    }
    fetchIssuedBooks()
  }, [])


  const handleActionFromReturnBook = (type: string) => {
    console.log("Action chosen:", type);
    if(type === "done"){
      console.log("return book")
      setTimeout(() => setShowReturnBookPanel(false), 5000)
    }else if(type === "cancel"){
      console.log("cancel return action")
      setShowReturnBookPanel(false)
    }
  }

  const handleClick = (action) => {
    if (action[0] === "return"){
      const today = new Date().toISOString().split("T")[0];
      const issueDate = new Date(action[5])
      const returnDate = new Date(today)
      console.log("Issue Date:", issueDate)
      console.log("Return Date:", returnDate)

      const durationInMs = returnDate - issueDate
      const durationInDays = Math.max(1, Math.ceil(durationInMs / (1000 * 60 * 60 * 24)))

      console.log("Duration:", durationInDays)

      const totalFee = action[4] * durationInDays
      console.log("Total Fee:", totalFee)
      setSelectedBook({id: action[1], name: action[2], title: action[3], fee: totalFee, date: action[5], member_id: action[6], initial_fee: action[4]})
      console.log("return book")
      setShowReturnBookPanel(true)
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
                    href="#"
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
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
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
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
                  Dashboard
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
                  <Link href="#">Issued</Link>
                </BreadcrumbLink>
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
              </div>
            </div>
            <TabsContent value="all">
              {showReturnBookPanel?
              <ReturnBook onAction={handleActionFromReturnBook} selectedBook={selectedBook}/>:
              <Card x-chunk="dashboard-06-chunk-0">
                <CardHeader>
                  <CardTitle>Issued Books</CardTitle>
                  <CardDescription>
                    View and manage returns of issued books.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Member</TableHead>
                        <TableHead>Book Title</TableHead>
                        <TableHead className="hidden md:table-cell">
                          Price
                        </TableHead>
                        <TableHead className="hidden md:table-cell">
                          Issue Date
                        </TableHead>
                        <TableHead>
                          <span className="sr-only">Actions</span>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {
                        issuedBooks.map((issued)=>(
                        <TableRow key={issued.book_id}>
                          <TableCell className="font-medium">
                            {issued.member_name}<br />
                            <p>Id:{issued.member_id}</p>
                          </TableCell>
                          <TableCell>
                            {issued.book_title}
                            {/* by{issued.author} */}
                            {/* <Badge variant="outline">Draft</Badge> */}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {issued.fee}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {issued.issue_date}
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
                                <DropdownMenuItem onClick={()=> handleClick(["return", issued.book_id, issued.member_name, issued.book_title, issued.fee, issued.issue_date, issued.member_id])}>Return Book</DropdownMenuItem>
                                {/* <DropdownMenuItem>Delete</DropdownMenuItem> */}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>

                        ))
                      }
                    </TableBody>
                  </Table>
                </CardContent>
                <CardFooter>
                  <div className="text-xs text-muted-foreground">
                    Showing <strong>1-10</strong> of <strong>32</strong>{" "}
                    books
                  </div>
                </CardFooter>
              </Card>
              }
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
