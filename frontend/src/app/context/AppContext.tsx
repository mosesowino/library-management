"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"
import axios from "axios"

interface Members {
  id: number;
  name: string;
  debt: string;
}

interface AppContextType {
  memberData: Members[] | null;
  setMemberData: React.Dispatch<React.SetStateAction<Members[] | null>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [memberData, setMemberData] = useState<Members[] | null>(null)

  useEffect(() => {
    const fetchMembers = async () => {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL
      const results = await axios.get(backendUrl + '/members')
      if (results?.data) {
        localStorage.setItem("members", JSON.stringify(results.data))
        setMemberData(results.data)
      }
    }

    fetchMembers()
  }, [])

  return (
    <AppContext.Provider value={{ memberData, setMemberData }}>
      {children}
    </AppContext.Provider>
  )
}

export const useAppContext = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider")
  }
  return context
}
