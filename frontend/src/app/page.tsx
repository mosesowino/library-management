"use client"

import Link from "next/link"
import Image from "next/image"
import {
  Home,
  LineChart,
  ListFilter,
  BookOpenText,
  PanelLeft,
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
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip"
import { useEffect, useState } from "react"
import axios from "axios"
export const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;


export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const[books, setBooks] = useState<Book[]>([])
  const[totalCopies, setTotalCopies] = useState<number>()
  const[issuedCopies, setIssuedCopies] = useState<number>()
  const[transactionFilter, setTransactionFilter] = useState('all')
  const [transactions, setTransactions] = useState<T_actions[] | null>(null);
  const transactionFilterOptions = ['all', 'return', 'borrow', 'payment'];
  
  const filteredBooks = books.filter((book) => {
    const query = searchQuery.toLowerCase();
    return (
      book.title.toLowerCase().includes(query) ||
      book.author.toLowerCase().includes(query)
    );
  });
  
  

  interface Book {
    author: string;
    id: number;
    cost_per_day: string;
    issued_copies: number;
    available_copies: number;
    title: string;
    total_copies: number;
  }

  interface T_actions {
    book_id: number;
    book_title: string;
    author: string;
    fee: number;
    id: number;
    issue_date: string;
    member_id: number;
    member_name: string;
    return_date: string | null;
  }
  
  

  const filterTransactionsHandler = (filterOption: string) =>{
    setTransactionFilter(filterOption)
    if(transactionFilter === 'all'){
      setTransactions(transactionsList);
    } else {
      const filteredTransactions: { 
        name: string; 
        email: string; 
        type: string; 
        status: string; 
        date: string; 
        amount: string; 
      }[]= transactionsList.filter((t)=>
        (t.type === filterOption)
      )
      setTransactions(filteredTransactions);
    }
  }
  

  useEffect(()=>{
    const fetch_all_books = async() =>{
      const result = await axios.get(backendUrl + '/books')
      if(result && result.data){
        console.log("result ==>", result)
        setBooks(result.data)
      }
    }
    fetch_all_books()
  },[])

  useEffect(() => {
    const fetch_all_transactions = async() =>{
      const result = await axios.get(backendUrl + '/transactions')
      if(result && result.data){
        console.log("result ==>", result)
        setTransactions(result.data)
      }
    }
    fetch_all_transactions()
  }
  ,[])
  
  useEffect(() => {
    if (books.length > 0) {
      gettotalCopies();
    }
  }, [books]);


  
  
  const gettotalCopies = () =>{
      const availableArr: number[] = []
      books.map((book)=>availableArr.push(book.total_copies))
      const total_copies = availableArr.reduce((accumulator, value)=>accumulator+value, 0)
      setTotalCopies(total_copies)
      localStorage.setItem('initialBooks', JSON.stringify(books))

      const issuedArr: number[] = []
      books.map((book) => issuedArr.push(typeof book.issued_copies === 'number' ? book.issued_copies : 0))


      const issuedCopies = issuedArr.reduce((accumulator, value)=>accumulator+value, 0)
      setIssuedCopies(issuedCopies)
      
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
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
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
                  Home
                </Link>
                <Link
                  href="#"
                  className="flex items-center gap-4 px-2.5 text-foreground"
                >
                  <Handshake className="h-5 w-5" />
                  Issued
                </Link>
                <Link
                  href="/books"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
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
            </BreadcrumbList>
          </Breadcrumb>
          <div className="relative ml-auto flex-1 md:grow-0">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                placeholder="Search book..."
                className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
              />
              {showSuggestions && searchQuery && (
                <div className="absolute z-50 w-full bg-white border rounded-md mt-1 max-h-64 overflow-y-auto shadow-lg">
                  {filteredBooks.length > 0 ? (
                    filteredBooks.map((book) => (
                      <div
                        key={book.id}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          setSearchQuery(book.title);
                          setShowSuggestions(false);
                        }}
                      >
                        <div className="font-semibold text-black">{book.title}</div>
                        <div className="text-sm text-gray-800">{book.author}</div>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-sm text-gray-500">No matches found</div>
                  )}
                </div>
              )}
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
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
        <div>
              <Image
                  src="/images/libraryImage.png"
                  width={72}
                  height={72}
                  layout="responsive"
                  alt="Avatar"
                  className="overflow-hidden rounded-full"
                />
          </div>
          <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
              <Card
                className="sm:col-span-2" x-chunk="dashboard-05-chunk-0"
              >
                <CardHeader className="pb-3">
                  <CardTitle>Book issuance</CardTitle>
                  <CardDescription className="max-w-lg text-balance leading-relaxed">
                    Issue books easily to elligible members.
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                  <Link
                    href="transactions/borrowbook"
                  >
                    <Button>Issue Book</Button>
                  </Link>
                </CardFooter>
              </Card>
              <Card x-chunk="dashboard-05-chunk-1">
                <CardHeader className="pb-2">
                  <CardDescription>Total Books</CardDescription>
                  <CardTitle className="text-4xl">{totalCopies}</CardTitle>
                </CardHeader>
              </Card>
              <Card x-chunk="dashboard-05-chunk-2">
                <CardHeader className="pb-2">
                  <CardDescription>Issued Books</CardDescription>
                  <CardTitle className="text-4xl">{issuedCopies}</CardTitle>
                </CardHeader>
              </Card>
            </div>
            <Tabs defaultValue="week">
              <div className="flex items-center">
                {/* <TabsList>
                  <TabsTrigger value="week">Week</TabsTrigger>
                  <TabsTrigger value="month">Month</TabsTrigger>
                  <TabsTrigger value="year">Year</TabsTrigger>
                </TabsList> */}
                <div className="ml-auto flex items-center gap-2">
                  {/* <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 gap-1 text-sm"
                      >
                        <ListFilter className="h-3.5 w-3.5" />
                        <span className="sr-only sm:not-sr-only">Filter</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {transactionFilterOptions.map((filterOption)=>(
                        <DropdownMenuCheckboxItem key={filterOption} onClick={()=>filterTransactionsHandler(filterOption)} className=" cursor-pointer">
                          {filterOption}
                        </DropdownMenuCheckboxItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu> */}
                </div>
              </div>
              <TabsContent value="week">
                <Card x-chunk="dashboard-05-chunk-3">
                  <CardHeader className="px-7">
                    <CardTitle>Transactions</CardTitle>
                    <CardDescription>
                      Recent transactions.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Member</TableHead>
                          <TableHead className="hidden sm:table-cell">
                            Book
                          </TableHead>
                          <TableHead className="hidden sm:table-cell">
                            Borrowed
                          </TableHead>
                          <TableHead className="hidden md:table-cell">
                            Return
                          </TableHead>
                          <TableHead className="text-right">Fee</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {/* {let transactionArray = [];
                        transactionFilter.length > 0 ? transactions.map((transaction)=> (transaction.type === transactionFilter ? transactionArray.push(transaction):'')): console.log("no filtering")} */}
                        {transactions &&(
                          transactions.map((transaction)=>(
                            <TableRow className="bg-accent" key={transaction.id}>
                              <TableCell>
                                <div className="font-medium">{transaction.member_name}</div>
                                <div className="hidden text-sm text-muted-foreground md:inline">
                                  id: {transaction.member_id}
                                </div>
                              </TableCell>
                              <TableCell className="hidden sm:table-cell">
                                <div className="font-medium">{transaction.book_title}</div>
                                <div className="hidden text-sm text-muted-foreground md:inline">
                                  author: {transaction.author}
                                </div>
                              </TableCell>
                              <TableCell className="hidden sm:table-cell">
                                <Badge className="text-xs" variant="secondary">
                                  {(transaction.issue_date).split("T")[0].replace("-", ":")}
                                </Badge>
                              </TableCell>
                              <TableCell className="hidden md:table-cell">
                                <Badge className="text-xs" variant="secondary">
                                  {transaction.return_date? (transaction.return_date).split("T")[0].replace("-", ":"):'Not returned'}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">{transaction.fee}</TableCell>
                            </TableRow>
                          )))
                        }
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}

