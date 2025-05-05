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
  PlusCircle,
  Search,
  Settings,
  Handshake,
  Users2,
  LucideInfo,
} from "lucide-react"

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
import { Badge } from '@/components/ui/badge';

import { useEffect, useState } from "react"
import axios from "axios"
import AddMember from "./memberactions/addmember/page"
import UpdateMember from "./memberactions/updatemember/page"
import MakePayment from "../transactions/makepayment/page"
import AlertCard from "@/utilities/alertcard"
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;



export default function Members() {

  const[showAddMemberPane, setShowAddMemberPane] = useState(false)
  const[showEditMemberPane, setShowEditMemberPane] = useState(false)
  const[showPaymentPane, setShowPaymentPane] = useState(false)
  const[memberData, setMemberData] = useState<Members[]|null>(null)
  const[currentMember, setCurrentMember] = useState<Members|null>(null)
  const[showAlert, setShowAlert] = useState(false)
  

    interface Members{
      id:number;
      name:string;
      debt:string;
    }

    useEffect(()=>{
      const fetched_members = async() =>{
        const results = await axios.get(backendUrl + '/members')
        console.log(results.data)
        if(results && results.data){
          localStorage.setItem('members',JSON.stringify(results.data))
          setMemberData(results.data)
        }
      }
      fetched_members()
    },[])


    const handleActionsClick = (action: [string, number?, string?, string?]) => {
      switch(action[0]){
        case "payment":
          setCurrentMember({id:action[1]!, name:action[2]!, debt:action[3]!})
          setShowPaymentPane(true)
          break;
        case "edit":
          setCurrentMember({id:action[1]!, name:action[2]!, debt:action[3]!})
          setShowEditMemberPane(!showEditMemberPane)
          break;
        case "delete":
          setCurrentMember({id:action[1]!, name:action[2]!, debt:action[3]!})
          setShowAlert(true)
          break;
        default:
          console.log("Invalid action")
      }
    }


    const handleMemberClick = () => {
      setShowAddMemberPane(!showAddMemberPane)
      setShowEditMemberPane(false)
    }

    const handleUpdateMemberAction = (action:string) => {
      switch(action){
        case "cancel":
          setShowEditMemberPane(!showEditMemberPane)
          break;
        case "update":
          setTimeout(() => setShowEditMemberPane(false), 5000)
          break;
        default:
          console.log("Invalid action")
      }
    }

    const handleActionFromAddMember = (action:string) => {
      if(action === "cancel"){
        setShowAddMemberPane(!showAddMemberPane)
      }else if(action === "add"){
        console.log("Add clicked")
        setTimeout(() => setShowAddMemberPane(false), 5000)
      }
    }

    const handleActionFromMakePayment = (action:string) => {
      if(action === "cancel"){
        setShowPaymentPane(false)
      }else if(action === "done"){
        console.log("Payment done")
        setTimeout(() => setShowPaymentPane(false), 5000)
      }
    }


    const deleteMember = async () => {
      if (!currentMember?.id) return;
    
      try {
        const res = await fetch(`${backendUrl}/members/delete/${currentMember.id}`, {
          method: 'DELETE',
        });
    
        if (res.ok) {
          console.log("Member deleted successfully");
        } else {
          console.error("Failed to delete member");
        }
      } catch (error) {
        console.error("Error deleting member:", error);
      } finally {
        setShowAlert(false);
      }
    };
    


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
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
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
                  <Link href="#">Members</Link>
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
                <Button size="sm" className="h-8 gap-1" onClick={handleMemberClick}>
                  {showAddMemberPane||showEditMemberPane ? '' : <PlusCircle className="h-3.5 w-3.5" />}
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    {showAddMemberPane||showEditMemberPane? "show members":"Add Member"}
                  </span>
                </Button>
              </div>
            </div>
            <TabsContent value="all">
              {showPaymentPane ?
                <MakePayment onAction={handleActionFromMakePayment} member={currentMember}/>:
                <>
                  {
                    showEditMemberPane ?
                    <UpdateMember onAction={handleUpdateMemberAction} member={currentMember}/>:
                  <>
                  {
                    showAddMemberPane ? 
                    <AddMember onAction={handleActionFromAddMember}/>:
                    <Card x-chunk="dashboard-06-chunk-0">
                      <CardHeader>
                        <CardTitle>members</CardTitle>
                        <CardDescription>
                          Manage members and update payments.
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Name</TableHead>
                              <TableHead>status</TableHead>
                              <TableHead className="hidden md:table-cell">
                                debt
                              </TableHead>
                              <TableHead>
                                <span className="sr-only">Actions</span>
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                              {memberData?
                                  memberData.map((member)=>(
                                  <TableRow key={member.id}>
                                      <TableCell className="font-medium">
                                          <p>{member.name}</p>
                                          <p>id: {member.id}</p>
                                      </TableCell>
                                      <TableCell>
                                        <Badge variant="outline">
                                          {
                                          parseInt(member.debt) < 500 ? 
                                            <p className="text-green-400">Eligible</p>:
                                            <p className="text-amber-400">not Eligible</p>
                                          }
                                          </Badge>
                                      </TableCell>
                                      <TableCell className="hidden md:table-cell">
                                          {member.debt}
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
                                          {
                                            parseInt(member.debt) > 0 ?
                                            <DropdownMenuItem onClick={() => handleActionsClick(["payment", member.id, member.name, member.debt])}>Pay debt</DropdownMenuItem>
                                            :
                                            ''
                                          }
                                          <DropdownMenuItem onClick={() => handleActionsClick(["edit", member.id, member.name, member.debt])}>Edit</DropdownMenuItem>
                                          <DropdownMenuItem onClick={() => handleActionsClick(["delete", member.id, member.name, member.debt])}>Delete</DropdownMenuItem>
                                          </DropdownMenuContent>
                                      </DropdownMenu>
                                      </TableCell>
                                  </TableRow>
                                  )):''
                              }
                          </TableBody>
                        </Table>
                      </CardContent>

                      {showAlert && (
                            <AlertCard
                              title="Delete Member?"
                              description={`Are you sure you want to delete ${currentMember?.name}?`}
                              onConfirm={deleteMember}
                              onCancel={() => setShowAlert(false)}
                            />
                          )}
                    </Card>
                  }
                  </>
                  }
                </>
              }
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
