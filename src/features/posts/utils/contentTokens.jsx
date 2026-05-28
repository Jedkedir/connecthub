import { profileService } from "@/features/profile/services/profile.service"

const TOKEN_PATTERN = /([@#][A-Za-z0-9_]+)/g

export const DEFAULT_TOPICS = ["#connecthub", "#community"]

export const normalizeTopic = (rawTopic) => {
  const value = rawTopic.trim().replace(/^#+/, "")
  const slug = value.match(/^[A-Za-z0-9_]+/)?.[0]
  return slug ? `#${slug.toLowerCase()}` : ""
}

export const normalizeMention = (rawMention) => {
  const value = rawMention.trim().replace(/^@+/, "")
  const username = value.match(/^[A-Za-z0-9_]+/)?.[0]
  return username ? `@${username.toLowerCase()}` : ""
}

export const extractTopicsFromContent = (text) => {
  const hashtags = text.match(/#[A-Za-z0-9_]+/g) || []
  return [...new Set(hashtags.map(normalizeTopic).filter(Boolean))]
}

export const extractMentionsFromContent = (text) => {
  const mentions = text.match(/@[A-Za-z0-9_]+/g) || []
  return [...new Set(mentions.map(normalizeMention).filter(Boolean))]
}

export const getActiveToken = (text, caretIndex) => {
  const beforeCaret = text.slice(0, caretIndex)
  const match = beforeCaret.match(/(^|\s)([@#][A-Za-z0-9_]*)$/)

  if (!match) return null

  const token = match[2]
  return {
    end: caretIndex,
    query: token.slice(1).toLowerCase(),
    start: caretIndex - token.length,
    type: token[0] === "@" ? "mention" : "topic",
  }
}

export const getUserId = (user) => user?._id || user?.id || user?.userId?._id

export const getUsername = (user) => {
  if (typeof user === "string") return user.replace(/^@/, "")
  return user?.username || user?.userId?.username || ""
}

export const getMentionLookup = (...mentionGroups) => {
  return mentionGroups.flat().reduce((lookup, mention) => {
    const username = getUsername(mention)
    const id = getUserId(mention)

    if (username && id) {
      lookup[`@${username.toLowerCase()}`] = id
    }

    return lookup
  }, {})
}

export const getMentionPayload = (content, selectedMentionUsers = {}) => {
  const mentions = extractMentionsFromContent(content)
  const mentionedUsers = mentions
    .map((mention) => selectedMentionUsers[mention]?.id)
    .filter(Boolean)

  return {
    mentionedUsers: [...new Set(mentionedUsers)],
    mentions,
  }
}

export const getTopicPayload = (content) => ({
  topics: extractTopicsFromContent(content),
})

const normalizeUserResponse = (response) => {
  if (!response) return null
  return response.user || response.data?.user || response.data || response
}

const getUserByMention = async (mention) => {
  const username = mention.replace(/^@/, "")

  if (!username) return null

  try {
    const response = await profileService.getUserByUsername(username)
    console.log("User search response for mention", mention, normalizeUserResponse(response))
    return normalizeUserResponse(response)
  } catch (error) {
    console.error("Could not resolve mentioned user", error)
    return null
  }
}

export const renderHighlightedContent = (text) => {
  if (!text) return null

  const parts = []
  let lastIndex = 0
  let match

  while ((match = TOKEN_PATTERN.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index))
    }

    const token = match[0]
    const isMention = token.startsWith("@")
    parts.push(
      <span
        key={`${token}-${match.index}`}
        className={isMention ? "text-emerald-600" : "text-sky-600"}
      >
        {token}
      </span>
    )
    lastIndex = match.index + token.length
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex))
  }

  return parts
}

export const renderInteractiveContent = ({
  className = "",
  mentionLookup = {},
  navigate,
  text,
}) => {
  if (!text) return null

  const parts = []
  let lastIndex = 0
  let match

  while ((match = TOKEN_PATTERN.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index))
    }

    const token = match[0]
    const normalizedToken = token.toLowerCase()
    const isMention = token.startsWith("@")
    const profileId = mentionLookup[normalizedToken]
    const clickable = true

    parts.push(
      <button
        key={`${token}-${match.index}`}
        type="button"
        onClick={async (event) => {
          event.stopPropagation()
          if (isMention) {
            const resolvedUser = profileId ? null : await getUserByMention(token)
            const  resolvedProfileId = profileId ||await  getUserId(resolvedUser)
            console.log("Resolved profile ID for mention", token, resolvedProfileId)
            
            if (resolvedProfileId) {
              navigate(`/profile/${resolvedProfileId}`)
            }
          } else if (!isMention) {
            navigate(`/explore?search=${encodeURIComponent(token)}`)
          }
        }}
        className={`inline p-0 text-left font-medium ${
          isMention ? "text-emerald-600" : "text-sky-600"
        } ${clickable ? "cursor-pointer hover:underline" : "cursor-text"}`}
      >
        {token}
      </button>
    )

    lastIndex = match.index + token.length
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex))
  }

  return <span className={className}>{parts}</span>
}
