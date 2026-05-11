import ProfileView from "@/features/profile/components/ProfileView"
import { useParams } from "react-router-dom"
export default function Profile() {
  const { id } = useParams()
  return <ProfileView userId={id} />
}
