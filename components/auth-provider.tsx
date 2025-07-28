"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  id: string
  name: string
  username: string
  email: string
  avatar: string
  isAuthenticated: boolean
  followers: number
  following: number
  posts: number
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => void
  updateUserStats: (updates: Partial<Pick<User, "followers" | "following" | "posts">>) => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock user database
const mockUsers = [
  {
    email: "masood@example.com",
    password: "masood123",
    name: "Masood",
    username: "@masood",
    avatar: "/images/selfie2.jpeg",
  },
  {
    email: "demo@example.com",
    password: "demo123",
    name: "Demo User",
    username: "@demouser",
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem("vibe_user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const foundUser = mockUsers.find((u) => u.email === email && u.password === password)

    if (foundUser) {
      const newUser: User = {
        id: "me",
        name: foundUser.name,
        username: foundUser.username,
        email: foundUser.email,
        avatar: foundUser.avatar,
        isAuthenticated: true,
        followers: 0,
        following: 0,
        posts: 0,
      }
      setUser(newUser)
      localStorage.setItem("vibe_user", JSON.stringify(newUser))
      return true
    }
    return false
  }

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Check if user already exists
    const existingUser = mockUsers.find((u) => u.email === email)
    if (existingUser) {
      return false
    }

    const newUser: User = {
      id: "me",
      name,
      username: `@${name.toLowerCase().replace(/\s+/g, "")}`,
      email,
      avatar: "/images/selfie2.jpeg",
      isAuthenticated: true,
      followers: 0,
      following: 0,
      posts: 0,
    }

    // Add to mock database
    mockUsers.push({
      email,
      password,
      name,
      username: newUser.username,
      avatar: newUser.avatar,
    })

    setUser(newUser)
    localStorage.setItem("vibe_user", JSON.stringify(newUser))
    return true
  }

  const updateUserStats = (updates: Partial<Pick<User, "followers" | "following" | "posts">>) => {
    if (user) {
      const updatedUser = { ...user, ...updates }
      setUser(updatedUser)
      localStorage.setItem("vibe_user", JSON.stringify(updatedUser))
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("vibe_user")
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUserStats, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
