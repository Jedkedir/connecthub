import { useMemo, useRef, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Check, Image, Smile, X } from "lucide-react"
import { useAuthStore } from "@/features/auth"
import { useFeed } from "@/features/feed"
import { useUserSearch } from "@/features/profile/hooks/useUserSearch"
import {
  DEFAULT_TOPICS,
  extractMentionsFromContent,
  extractTopicsFromContent,
  getActiveToken,
  getMentionPayload,
  getTopicPayload,
  getUserId,
  renderHighlightedContent,
} from "@/features/posts/utils/contentTokens"

const EMOJI_GROUPS = [
  {
    label: "Smileys",
    emojis: ["😀", "😁", "😂", "😊", "😍", "🥰", "😎", "🤔", "😅", "🙌"],
  },
  {
    label: "Reactions",
    emojis: ["👍", "👏", "🔥", "✨", "💯", "❤️", "💙", "🎉", "🚀", "✅"],
  },
  {
    label: "Creative",
    emojis: ["🎨", "📸", "🎧", "📚", "💡", "✍️", "🌍", "☕", "🌟", "🧠"],
  },
]

const CreatePostForm = ({ onPostCreated }) => {
  const user = useAuthStore((state) => state.user)
  const { createPost } = useFeed()
  const [content, setContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeToken, setActiveToken] = useState(null)
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false)
  const [overlayScrollTop, setOverlayScrollTop] = useState(0)
  const [selectedMentionUsers, setSelectedMentionUsers] = useState({})
  const caretPositionRef = useRef(0)
  const textareaRef = useRef(null)

  const activeTopics = useMemo(() => extractTopicsFromContent(content), [content])
  const activeMentions = useMemo(() => extractMentionsFromContent(content), [content])
  const mentionQuery = activeToken?.type === "mention" ? activeToken.query : ""
  const { users: mentionSuggestions } = useUserSearch(mentionQuery, 5, {
    enabled: activeToken?.type === "mention",
    minLength: 0,
  })

  const topicSuggestions = useMemo(() => {
    const query = activeToken?.type === "topic" ? activeToken.query : ""
    return DEFAULT_TOPICS.filter((topic) =>
      topic.toLowerCase().includes(`#${query}`)
    ).slice(0, 5)
  }, [activeToken])

  const updateActiveToken = (text, caretIndex) => {
    caretPositionRef.current = caretIndex
    setActiveToken(getActiveToken(text, caretIndex))
  }

  const handleContentChange = (e) => {
    const newContent = e.target.value
    setContent(newContent)
    updateActiveToken(newContent, e.target.selectionStart)
  }

  const handleSelectToken = (value, selectedUser) => {
    if (!activeToken) return

    const nextContent = `${content.slice(0, activeToken.start)}${value} ${content.slice(activeToken.end)}`
    const nextCaretPosition = activeToken.start + value.length + 1

    if (selectedUser) {
      const userId = getUserId(selectedUser)
      setSelectedMentionUsers((prev) => ({
        ...prev,
        [value.toLowerCase()]: {
          id: userId,
          username: selectedUser.username,
        },
      }))
    }

    setContent(nextContent)
    setActiveToken(null)

    requestAnimationFrame(() => {
      textareaRef.current?.focus()
      textareaRef.current?.setSelectionRange(nextCaretPosition, nextCaretPosition)
    })
  }

  const handleInsertTopic = (topic) => {
    if (activeTopics.includes(topic)) {
      textareaRef.current?.focus()
      return
    }

    const spacer = content.trim() ? " " : ""
    const nextContent = `${content}${spacer}${topic} `
    setContent(nextContent)
    setActiveToken(null)

    requestAnimationFrame(() => {
      textareaRef.current?.focus()
      textareaRef.current?.setSelectionRange(nextContent.length, nextContent.length)
    })
  }

  const handleEmojiSelect = (emoji) => {
    const caretPosition =
      textareaRef.current?.selectionStart ?? caretPositionRef.current
    const nextContent = `${content.slice(0, caretPosition)}${emoji}${content.slice(caretPosition)}`
    const nextCaretPosition = caretPosition + emoji.length

    setContent(nextContent)
    setActiveToken(null)

    requestAnimationFrame(() => {
      textareaRef.current?.focus()
      textareaRef.current?.setSelectionRange(nextCaretPosition, nextCaretPosition)
      caretPositionRef.current = nextCaretPosition
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!content.trim()) return
    setIsSubmitting(true)
    try {
      const mentionPayload = getMentionPayload(content, selectedMentionUsers)

      await createPost({
        content,
        ...mentionPayload,
        ...getTopicPayload(content),
      })

      setContent("")
      setActiveToken(null)
      setIsEmojiPickerOpen(false)
      setSelectedMentionUsers({})
      onPostCreated()
      toast.success("Posted! Your post is live.")
    } catch (err) {
      console.error(err)
      toast.error("Could not create post.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const getInitials = (fullname) => {
    return fullname?.slice(0, 2).toUpperCase() || "U"
  }

  const showTopicSuggestions =
    activeToken?.type === "topic" && topicSuggestions.length > 0
  const showMentionSuggestions =
    activeToken?.type === "mention" && mentionSuggestions.length > 0

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
                  `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.fullname}`
                }
              />
              <AvatarFallback>{getInitials(user?.fullname)}</AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-2">
              <div className="relative">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 min-h-20 overflow-hidden whitespace-pre-wrap wrap-break-word p-2 text-base leading-normal text-foreground md:text-base"
                >
                  <div style={{ transform: `translateY(-${overlayScrollTop}px)` }}>
                    {content ? renderHighlightedContent(content) : null}
                  </div>
                </div>
                <Textarea
                  ref={textareaRef}
                  placeholder="What's happening? Use @mentions and #topics"
                  value={content}
                  onChange={handleContentChange}
                  onClick={(event) =>
                    updateActiveToken(content, event.currentTarget.selectionStart)
                  }
                  onKeyUp={(event) =>
                    updateActiveToken(content, event.currentTarget.selectionStart)
                  }
                  onScroll={(event) =>
                    setOverlayScrollTop(event.currentTarget.scrollTop)
                  }
                  className="relative z-10 min-h-20 resize-none rounded-none border-0 border-b border-gray-200 bg-transparent p-2 text-base leading-normal text-transparent caret-foreground placeholder:text-muted-foreground placeholder:opacity-100 focus-visible:border-gray-400 focus-visible:ring-0 dark:border-b dark:border-gray-700 md:text-base"
                  rows={3}
                  maxLength={500}
                />
                <div className="absolute bottom-2 right-2 z-20 text-xs text-muted-foreground">
                  {content.length}/500
                </div>
              </div>

              {(showTopicSuggestions || showMentionSuggestions) && (
                <div className="flex flex-wrap gap-2">
                  {showTopicSuggestions &&
                    topicSuggestions.map((topic) => (
                      <Button
                        key={topic}
                        type="button"
                        variant="outline"
                        size="sm"
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={() => handleSelectToken(topic)}
                        className="h-7 rounded-full px-3 text-sky-600 hover:text-sky-700"
                      >
                        {topic}
                      </Button>
                    ))}
                  {showMentionSuggestions &&
                    mentionSuggestions.map((suggestedUser) => (
                      <Button
                        key={getUserId(suggestedUser) || suggestedUser.username}
                        type="button"
                        variant="outline"
                        size="sm"
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={() =>
                          handleSelectToken(
                            `@${suggestedUser.username}`,
                            suggestedUser
                          )
                        }
                        className="h-7 rounded-full px-3 text-emerald-600 hover:text-emerald-700"
                      >
                        @{suggestedUser.username}
                      </Button>
                    ))}
                </div>
              )}

              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">
                  Topics
                </p>
                <div className="flex flex-wrap gap-2">
                  {DEFAULT_TOPICS.map((topic) => {
                    const isSelected = activeTopics.includes(topic)

                    return (
                      <Button
                        key={topic}
                        type="button"
                        variant={isSelected ? "secondary" : "outline"}
                        size="sm"
                        onClick={() => handleInsertTopic(topic)}
                        className="h-7 rounded-full px-3"
                      >
                        {isSelected && <Check className="mr-1 h-3 w-3" />}
                        {topic}
                      </Button>
                    )
                  })}
                </div>
              </div>

              {(activeTopics.length > 0 || activeMentions.length > 0) && (
                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                  {activeTopics.map((topic) => (
                    <span key={topic} className="text-sky-600">
                      {topic}
                    </span>
                  ))}
                  {activeMentions.map((mention) => (
                    <span key={mention} className="text-emerald-600">
                      {mention}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="relative flex gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full text-muted-foreground hover:text-blue-500 transition-colors"
                    onClick={() => toast.info("Image upload will be available soon!")}
                  >
                    <Image className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-expanded={isEmojiPickerOpen}
                    aria-label="Open emoji picker"
                    className="h-8 w-8 rounded-full text-muted-foreground hover:text-blue-500 transition-colors"
                    onClick={() => setIsEmojiPickerOpen((open) => !open)}
                  >
                    <Smile className="h-4 w-4" />
                  </Button>
                  {isEmojiPickerOpen && (
                    <div className="absolute bottom-10 left-0 z-30 max-h-72 w-[min(20rem,calc(100vw-2rem))] overflow-y-auto rounded-lg border bg-popover p-3 text-popover-foreground shadow-lg">
                      <div className="space-y-3">
                        {EMOJI_GROUPS.map((group) => (
                          <div key={group.label} className="space-y-2">
                            <p className="text-xs font-medium text-muted-foreground">
                              {group.label}
                            </p>
                            <div className="grid grid-cols-5 gap-1 sm:grid-cols-10">
                              {group.emojis.map((emoji) => (
                                <Button
                                  key={`${group.label}-${emoji}`}
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="h-9 w-9 rounded-md text-lg"
                                  onClick={() => handleEmojiSelect(emoji)}
                                >
                                  {emoji}
                                </Button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setContent("")
                      setActiveToken(null)
                      setIsEmojiPickerOpen(false)
                      setSelectedMentionUsers({})
                    }}
                    className="text-muted-foreground"
                  >
                    <X className="mr-1 h-3 w-3" />
                    Clear
                  </Button>
                  <Button
                    type="submit"
                    disabled={!content.trim() || isSubmitting}
                    className="light:bg-black light:text-white rounded-xl px-8 font-bold dark:bg-white dark:text-black transition-all hover:scale-105"
                  >
                    {isSubmitting ? "Posting..." : "Post"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export default CreatePostForm
