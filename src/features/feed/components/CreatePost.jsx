import { useState } from "react"
import api from "@/services/apiClient"
import { endpoints } from "@/services/endpoints"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Image, Smile } from "lucide-react"
import { useAuthStore } from "@/features/auth"

const CreatePostForm = ({ onPostCreated }) => {
  const user = useAuthStore((state) => state.user)
  const [content, setContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!content.trim()) return
    setIsSubmitting(true)
    try {
      await api.post(endpoints.posts.create, { content })
      setContent("")
      onPostCreated() 
      toast.success("Posted! Your post is live.")
    } catch (err) {
      console.error(err)
      toast.error("Could not create post.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // TODO: Add image upload
  const handleImageClick = () => {
    toast.info("Image upload will be available soon!")
  }

  // TODO: Add emoji picker
  const handleEmojiClick = () => {
    toast.info("Emoji picker will be available soon!")
  }

  const getInitials = (username) => {
    return username?.slice(0, 2).toUpperCase() || "U"
  }

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <form onSubmit={handleSubmit}>
          <div className="flex gap-3">
            {/* Avatar */}
            <Avatar className="h-10 w-10 shrink-0">
              <AvatarImage
                src={
                  user?.profilePic ||
                  `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username}`
                }
              />
              <AvatarFallback>{getInitials(user?.username)}</AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-2">
              <Textarea
                placeholder="What's happening in your atelier?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-20 resize-none border-0 border-b border-gray-200 rounded-none p-2 text-base placeholder:text-base focus-visible:ring-0 focus-visible:border-gray-400 dark:border-b dark:border-gray-700"
                rows={3}
              />

              <div className="flex items-center justify-between">
                <div className="flex gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full text-muted-foreground"
                    onClick={handleImageClick}
                  >
                    <Image className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full text-muted-foreground"
                    onClick={handleEmojiClick}
                  >
                    <Smile className="h-4 w-4" />
                  </Button>
                </div>
                <Button                  
                  type="submit"
                  disabled={!content.trim() || isSubmitting}
                  className="rounded-xl dark:bg-white dark:text-black light:bg-black light:text-white font-bold px-8"
                >
                  {isSubmitting ? "Posting..." : "Post"}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export default CreatePostForm