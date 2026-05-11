import PostView from "@/features/posts/components/PostView"
import { useParams } from "react-router-dom"
export default function PostDetail() {
  const { id } = useParams()
  return <PostView postId={id} />
}
