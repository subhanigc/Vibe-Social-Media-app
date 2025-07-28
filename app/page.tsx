"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Heart,
  MessageCircle,
  Share2,
  Send,
  Users,
  Zap,
  MapPin,
  Sparkles,
  UserPlus,
  Bell,
  Search,
  Home,
  User,
  Camera,
  Mic,
  TrendingUp,
  Bot,
  LogOut,
  Lightbulb,
  Brain,
  Target,
  X,
} from "lucide-react"
import { AuthProvider, useAuth } from "@/components/auth-provider"
import LoginForm from "@/components/login-form"

// Update the users array with simple names and new locations
const users = [
  {
    id: "asad",
    name: "Asad",
    username: "@asad",
    avatar: "/placeholder.svg?height=40&width=40",
    mood: "creative",
    location: "Sona Valley",
    isOnline: true,
  },
  {
    id: "abdullah",
    name: "Abdullah",
    username: "@abdullah",
    avatar: "/images/masoodprofile.jpeg",
    mood: "peaceful",
    location: "Rose Valley",
    isOnline: true,
  },
  {
    id: "asim",
    name: "Asim",
    username: "@asim",
    avatar: "/images/casual2.jpeg",
    mood: "contemplative",
    location: "Mangla Dam",
    isOnline: true,
  },
]

const aiSuggestions = [
  "Nature walks are great for mindfulness!",
  "Try a new recipe today!",
  "Explore local art galleries!",
]

function VibeSocialApp() {
  const { user, logout, updateUserStats } = useAuth()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [posts, setPosts] = useState([
    {
      id: 1,
      user: users[1], // Abdullah
      content: "Embracing the tranquility of nature 🌿 Sometimes the best conversations happen in silence.",
      image: "/images/masoodprofile.jpeg",
      timestamp: "2 hours ago",
      likes: 24,
      comments: 8,
      shares: 3,
      mood: "peaceful",
      pulseScore: 85,
      isLiked: false,
      location: "Rose Valley Park",
      aiInsight: "This post resonates with users seeking mindfulness content",
    },
    {
      id: 2,
      user: users[2], // Asim
      content: "Golden hour reflections by the water 🌅 Every sunset brings the promise of a new dawn.",
      image: "/images/casual2.jpeg",
      timestamp: "4 hours ago",
      likes: 42,
      comments: 12,
      shares: 7,
      mood: "contemplative",
      pulseScore: 92,
      isLiked: true,
      location: "Mangla Dam",
      aiInsight: "High engagement expected - sunset content performs 40% better",
    },
  ])

  const [newPost, setNewPost] = useState("")
  const [selectedMood, setSelectedMood] = useState("happy")
  const [activeTab, setActiveTab] = useState("home")
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [requests, setRequests] = useState([
    { id: 1, user: users[0], mutualFriends: 3 },
    { id: 2, user: users[1], mutualFriends: 7 },
  ])
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "like",
      user: users[0],
      postId: 1,
      timestamp: "5 minutes ago",
      read: false,
    },
    {
      id: 2,
      type: "share",
      user: users[1],
      postId: 2,
      timestamp: "1 hour ago",
      read: false,
    },
  ])
  const [showAiSuggestions, setShowAiSuggestions] = useState(false)
  const [aiReply, setAiReply] = useState("")

  const moods = [
    { name: "happy", emoji: "😊", color: "bg-yellow-50 text-yellow-700 border-yellow-200" },
    { name: "adventurous", emoji: "🏔️", color: "bg-green-50 text-green-700 border-green-200" },
    { name: "peaceful", emoji: "🧘", color: "bg-blue-50 text-blue-700 border-blue-200" },
    { name: "creative", emoji: "🎨", color: "bg-purple-50 text-purple-700 border-purple-200" },
    { name: "contemplative", emoji: "🤔", color: "bg-gray-50 text-gray-700 border-gray-200" },
    { name: "inspired", emoji: "✨", color: "bg-pink-50 text-pink-700 border-pink-200" },
  ]

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleLike = (postId: number) => {
    setPosts(
      posts.map((post) =>
        post.id === postId
          ? { ...post, likes: post.isLiked ? post.likes - 1 : post.likes + 1, isLiked: !post.isLiked }
          : post,
      ),
    )

    // Add notification for like
    if (!posts.find((p) => p.id === postId)?.isLiked) {
      const newNotification = {
        id: notifications.length + 1,
        type: "like",
        user: users[0],
        postId,
        timestamp: "now",
        read: false,
      }
      setNotifications([newNotification, ...notifications])
    }
  }

  const handleShare = (postId: number) => {
    setPosts(posts.map((post) => (post.id === postId ? { ...post, shares: post.shares + 1 } : post)))

    // Add notification for share
    const newNotification = {
      id: notifications.length + 1,
      type: "share",
      user: users[1],
      postId,
      timestamp: "now",
      read: false,
    }
    setNotifications([newNotification, ...notifications])
  }

  const handleAcceptRequest = (requestId: number) => {
    setRequests(requests.filter((req) => req.id !== requestId))
    // Update followers count
    if (user) {
      updateUserStats({ followers: user.followers + 1 })
    }
  }

  const createPost = () => {
    if (!newPost.trim() && !selectedImage) return

    // Update the currentUser location
    const currentUser = {
      id: user?.id || "me",
      name: user?.name || "You",
      username: user?.username || "@you",
      avatar: user?.avatar || "/images/selfie2.jpeg",
      mood: selectedMood,
      location: user?.name === "Masood" ? "Sona Valley" : "Your Location",
      isOnline: true,
    }

    const post = {
      id: posts.length + 1,
      user: currentUser,
      content: newPost,
      image: selectedImage,
      timestamp: "now",
      likes: 0,
      comments: 0,
      shares: 0,
      mood: selectedMood,
      pulseScore: Math.floor(Math.random() * 40) + 60,
      isLiked: false,
      location: "Your Location",
      aiInsight: "AI analyzing engagement potential...",
    }

    setPosts([post, ...posts])
    setNewPost("")
    setSelectedImage(null)
    setShowAiSuggestions(false)

    // Update posts count
    if (user) {
      updateUserStats({ posts: user.posts + 1 })
    }
  }

  const generateAiReply = (postContent: string) => {
    const replies = [
      "That's a beautiful perspective! 🌟",
      "Thanks for sharing this moment with us!",
      "This really resonates with me 💭",
      "Love the positive energy! ✨",
      "Such an inspiring view! 🙌",
    ]
    setAiReply(replies[Math.floor(Math.random() * replies.length)])
  }

  const handleProfileClick = () => {
    setActiveTab("profile")
  }

  const handleNotificationClick = () => {
    setActiveTab("connect")
    // Mark notifications as read
    setNotifications(notifications.map((n) => ({ ...n, read: true })))
  }

  const unreadNotifications = notifications.filter((n) => !n.read).length

  if (!user) {
    return <LoginForm />
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-800">Vibe</h1>
          </div>

          {/* Update the header section to conditionally show profile picture */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-800">
              <Search className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="relative text-slate-600 hover:text-slate-800"
              onClick={handleNotificationClick}
            >
              <Bell className="w-4 h-4" />
              {unreadNotifications > 0 && (
                <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-red-500 text-white text-xs">
                  {unreadNotifications}
                </Badge>
              )}
            </Button>
            {user?.name === "Masood" && (
              <button onClick={handleProfileClick}>
                <Avatar className="w-8 h-8 ring-2 ring-blue-200 cursor-pointer hover:ring-blue-300 transition-all">
                  <AvatarImage src={user.avatar || "/placeholder.svg"} />
                  <AvatarFallback>{user.name[0]}</AvatarFallback>
                </Avatar>
              </button>
            )}
            <Button variant="ghost" size="sm" onClick={logout} className="text-slate-600 hover:text-slate-800">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-6 bg-white border border-slate-200">
            <TabsTrigger
              value="home"
              className="flex items-center gap-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
            >
              <Home className="w-4 h-4" />
              Home
            </TabsTrigger>
            <TabsTrigger
              value="ai"
              className="flex items-center gap-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
            >
              <Bot className="w-4 h-4" />
              AI Hub
            </TabsTrigger>
            <TabsTrigger
              value="pulse"
              className="flex items-center gap-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
            >
              <TrendingUp className="w-4 h-4" />
              Pulse
            </TabsTrigger>
            <TabsTrigger
              value="connect"
              className="flex items-center gap-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
            >
              <Users className="w-4 h-4" />
              Connect
              {unreadNotifications > 0 && (
                <Badge className="ml-1 w-4 h-4 p-0 flex items-center justify-center bg-red-500 text-white text-xs">
                  {unreadNotifications}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="profile"
              className="flex items-center gap-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
            >
              <User className="w-4 h-4" />
              Profile
            </TabsTrigger>
          </TabsList>

          <TabsContent value="home" className="space-y-6">
            {/* Create Post */}
            <Card className="bg-white border-slate-200 shadow-sm">
              <CardHeader className="pb-3">
                {/* Update the create post section to use conditional avatar */}
                <div className="flex items-center gap-3">
                  {user?.name === "Masood" && (
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={user.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{user.name[0]}</AvatarFallback>
                    </Avatar>
                  )}
                  <div className="flex-1">
                    <Textarea
                      placeholder="What's your vibe today?"
                      value={newPost}
                      onChange={(e) => setNewPost(e.target.value)}
                      className="min-h-[80px] border-slate-200 focus:border-blue-500 focus:ring-blue-500 resize-none"
                    />
                  </div>
                </div>

                {selectedImage && (
                  <div className="relative mt-3">
                    <img
                      src={selectedImage || "/placeholder.svg"}
                      alt="Selected"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedImage(null)}
                      className="absolute top-2 right-2 bg-black/50 text-white hover:bg-black/70"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}

                {showAiSuggestions && (
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Bot className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-800">AI Suggestions</span>
                    </div>
                    <div className="space-y-2">
                      {aiSuggestions.slice(0, 3).map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => setNewPost(suggestion)}
                          className="block w-full text-left text-sm text-blue-700 hover:text-blue-800 hover:bg-blue-100 p-2 rounded"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </CardHeader>
              <CardFooter className="pt-0 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-slate-600 hover:text-slate-800"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Camera className="w-4 h-4 mr-1" />
                    Photo
                  </Button>
                  <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-800">
                    <Mic className="w-4 h-4 mr-1" />
                    Voice
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAiSuggestions(!showAiSuggestions)}
                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                  >
                    <Bot className="w-4 h-4 mr-1" />
                    AI Help
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={selectedMood}
                    onChange={(e) => setSelectedMood(e.target.value)}
                    className="text-sm bg-transparent border border-slate-200 rounded px-2 py-1 focus:border-blue-500 focus:ring-blue-500"
                  >
                    {moods.map((mood) => (
                      <option key={mood.name} value={mood.name}>
                        {mood.emoji} {mood.name}
                      </option>
                    ))}
                  </select>
                  <Button
                    onClick={createPost}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    disabled={!newPost.trim() && !selectedImage}
                  >
                    <Send className="w-4 h-4 mr-1" />
                    Share
                  </Button>
                </div>
              </CardFooter>
            </Card>

            {/* Posts Feed */}
            <div className="space-y-6">
              {posts.map((post) => (
                <Card key={post.id} className="bg-white border-slate-200 shadow-sm overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10 ring-2 ring-slate-200">
                          <AvatarImage src={post.user.avatar || "/placeholder.svg"} />
                          <AvatarFallback>{post.user.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-slate-900">{post.user.name}</h3>
                            <Badge className={`text-xs border ${moods.find((m) => m.name === post.mood)?.color}`}>
                              {moods.find((m) => m.name === post.mood)?.emoji} {post.mood}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-slate-500">
                            <span>{post.timestamp}</span>
                            <span>•</span>
                            <MapPin className="w-3 h-3" />
                            <span>{post.location}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="bg-slate-100 text-slate-700 border border-slate-200">
                          <Sparkles className="w-3 h-3 mr-1" />
                          {post.pulseScore}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pb-3">
                    <p className="text-slate-800 mb-3">{post.content}</p>
                    {post.image && (
                      <div className="rounded-lg overflow-hidden">
                        <img
                          src={post.image || "/placeholder.svg"}
                          alt="Post content"
                          className="w-full h-auto object-cover"
                        />
                      </div>
                    )}
                    {post.aiInsight && (
                      <div className="mt-3 p-2 bg-slate-50 rounded border border-slate-200">
                        <div className="flex items-center gap-2">
                          <Brain className="w-3 h-3 text-slate-600" />
                          <span className="text-xs text-slate-600">{post.aiInsight}</span>
                        </div>
                      </div>
                    )}
                  </CardContent>

                  <CardFooter className="pt-0">
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleLike(post.id)}
                          className={
                            post.isLiked ? "text-red-500 hover:text-red-600" : "text-slate-600 hover:text-slate-800"
                          }
                        >
                          <Heart className={`w-4 h-4 mr-1 ${post.isLiked ? "fill-current" : ""}`} />
                          {post.likes}
                        </Button>
                        <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-800">
                          <MessageCircle className="w-4 h-4 mr-1" />
                          {post.comments}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-slate-600 hover:text-slate-800"
                          onClick={() => handleShare(post.id)}
                        >
                          <Share2 className="w-4 h-4 mr-1" />
                          {post.shares}
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => generateAiReply(post.content)}
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      >
                        <Bot className="w-4 h-4 mr-1" />
                        AI Reply
                      </Button>
                    </div>
                    {aiReply && (
                      <div className="mt-3 p-2 bg-blue-50 rounded border border-blue-200">
                        <div className="flex items-center gap-2">
                          <Bot className="w-4 h-4 text-blue-600" />
                          <span className="text-sm text-blue-800">{aiReply}</span>
                        </div>
                      </div>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="ai" className="space-y-6">
            <Card className="bg-white border-slate-200 shadow-sm">
              <CardHeader>
                <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800">
                  <Bot className="w-5 h-5 text-blue-600" />
                  AI-Powered Features
                </h2>
                <p className="text-slate-600">Enhance your social experience with artificial intelligence</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-3 mb-2">
                      <Lightbulb className="w-5 h-5 text-blue-600" />
                      <h3 className="font-semibold text-blue-800">Smart Suggestions</h3>
                    </div>
                    <p className="text-sm text-blue-700">Get AI-powered content ideas based on trending topics</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-3 mb-2">
                      <Target className="w-5 h-5 text-green-600" />
                      <h3 className="font-semibold text-green-800">Engagement Predictor</h3>
                    </div>
                    <p className="text-sm text-green-700">AI analyzes your posts to predict engagement levels</p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="flex items-center gap-3 mb-2">
                      <Brain className="w-5 h-5 text-purple-600" />
                      <h3 className="font-semibold text-purple-800">Smart Replies</h3>
                    </div>
                    <p className="text-sm text-purple-700">Generate contextual replies with AI assistance</p>
                  </div>
                  <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <div className="flex items-center gap-3 mb-2">
                      <TrendingUp className="w-5 h-5 text-orange-600" />
                      <h3 className="font-semibold text-orange-800">Trend Analysis</h3>
                    </div>
                    <p className="text-sm text-orange-700">Discover trending topics in your network</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pulse" className="space-y-6">
            <Card className="bg-white border-slate-200 shadow-sm">
              <CardHeader>
                <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  Vibe Trends
                </h2>
                <p className="text-slate-600">Discover what's resonating with your community</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {moods.map((mood) => (
                    <div key={mood.name} className={`p-4 rounded-lg border ${mood.color} text-center`}>
                      <div className="text-2xl mb-2">{mood.emoji}</div>
                      <div className="font-semibold capitalize">{mood.name}</div>
                      <div className="text-sm opacity-75">{Math.floor(Math.random() * 100) + 50} vibes</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="connect" className="space-y-6">
            {/* Notifications */}
            {notifications.length > 0 && (
              <Card className="bg-white border-slate-200 shadow-sm">
                <CardHeader>
                  <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800">
                    <Bell className="w-5 h-5 text-blue-600" />
                    Notifications
                  </h2>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`flex items-center gap-3 p-3 rounded-lg border ${
                          notification.read ? "bg-slate-50 border-slate-200" : "bg-blue-50 border-blue-200"
                        }`}
                      >
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={notification.user.avatar || "/placeholder.svg"} />
                          <AvatarFallback>{notification.user.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="text-sm">
                            <span className="font-semibold">{notification.user.name}</span>
                            {notification.type === "like" && " liked your post"}
                            {notification.type === "share" && " shared your post"}
                            {notification.type === "comment" && " commented on your post"}
                            {notification.type === "friend_request" && " sent you a friend request"}
                          </p>
                          <p className="text-xs text-slate-500">{notification.timestamp}</p>
                        </div>
                        {notification.type === "like" && <Heart className="w-4 h-4 text-red-500" />}
                        {notification.type === "share" && <Share2 className="w-4 h-4 text-blue-500" />}
                        {notification.type === "comment" && <MessageCircle className="w-4 h-4 text-green-500" />}
                        {notification.type === "friend_request" && <UserPlus className="w-4 h-4 text-purple-500" />}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Friend Requests */}
            {requests.length > 0 && (
              <Card className="bg-white border-slate-200 shadow-sm">
                <CardHeader>
                  <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800">
                    <UserPlus className="w-5 h-5 text-blue-600" />
                    Friend Requests
                  </h2>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {requests.map((request) => (
                      <div
                        key={request.id}
                        className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={request.user.avatar || "/placeholder.svg"} />
                            <AvatarFallback>{request.user.name[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold text-slate-800">{request.user.name}</h3>
                            <p className="text-sm text-slate-600">{request.mutualFriends} mutual friends</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleAcceptRequest(request.id)}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            Accept
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-slate-300 text-slate-600 hover:bg-slate-50 bg-transparent"
                          >
                            Decline
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Online Friends */}
            <Card className="bg-white border-slate-200 shadow-sm">
              <CardHeader>
                <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800">
                  <Users className="w-5 h-5 text-blue-600" />
                  Online Friends
                </h2>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {users
                    .filter((user) => user.isOnline)
                    .map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200"
                      >
                        <div className="relative">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={user.avatar || "/placeholder.svg"} />
                            <AvatarFallback>{user.name[0]}</AvatarFallback>
                          </Avatar>
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-800">{user.name}</h3>
                          <p className="text-sm text-slate-600 flex items-center gap-1">
                            {moods.find((m) => m.name === user.mood)?.emoji} {user.mood}
                          </p>
                        </div>
                        <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-800">
                          <MessageCircle className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Update the profile tab to conditionally show avatar */}
          <TabsContent value="profile" className="space-y-6">
            <Card className="bg-white border-slate-200 shadow-sm">
              <CardHeader>
                <div className="flex items-center gap-4">
                  {user?.name === "Masood" && (
                    <Avatar className="w-20 h-20 ring-4 ring-blue-200">
                      <AvatarImage src={user.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{user.name[0]}</AvatarFallback>
                    </Avatar>
                  )}
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800">{user.name}</h2>
                    <p className="text-slate-600">{user.username}</p>
                    <p className="text-sm text-slate-500">{user.email}</p>
                    <Badge className="mt-2 bg-blue-50 text-blue-700 border border-blue-200">✨ New Member</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">{user.posts}</div>
                    <div className="text-sm text-slate-600">Posts</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">{user.followers}</div>
                    <div className="text-sm text-slate-600">Followers</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">{user.following}</div>
                    <div className="text-sm text-slate-600">Following</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <VibeSocialApp />
    </AuthProvider>
  )
}
