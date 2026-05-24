import { useCallback, useMemo, useState } from "react"
import { EyeIcon, EyeOffIcon, Loader2 } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Field, FieldLabel } from "@/components/ui/field"
import {
  InputGroup,
  InputGroupInput,
  InputGroupButton,
} from "@/components/ui/input-group"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { useProfile } from "@/features/profile/hooks/useProfile"
import { cn } from "@/shared/utils/cn"

// Dicebear avatar seed options
const AVATAR_SEEDS = [
  "Alice",
  "Bob",
  "Charlie",
  "Diana",
  "Eve",
  "Frank",
  "Grace",
  "Henry",
  "Iris",
  "Jack",
  "Kate",
  "Leo",
  "Mina",
  "Noah",
  "Olivia",
  "Paul",
  "Quinn",
  "Rachel",
  "Sam",
  "Tara",
]

function generateAvatarUrl(seed) {
  const url = new URL("https://api.dicebear.com/9.x/adventurer-neutral/svg")
  url.searchParams.set("seed", seed)
  url.searchParams.set("size", "256")
  url.searchParams.set("randomizeIds", "false")
  return url.href
}

export default function EditProfile() {
  const { user, changePassword, changePasswordState, updateUser } = useAuth()

  const { updateProfile, updateProfileState } = useProfile()

  // Form state
  const [fullName, setFullName] = useState(user?.fullname || "")
  const [bio, setBio] = useState(user?.bio || "")
  const [selectedAvatarSeed, setSelectedAvatarSeed] = useState(
    user?.fullname || "Alice"
  )
  const [showAvatarDialog, setShowAvatarDialog] = useState(false)

  // Password state
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [passwordError, setPasswordError] = useState("")

  const avatarUrl = useMemo(
    () => generateAvatarUrl(selectedAvatarSeed),
    [selectedAvatarSeed]
  )

  const profileChanged = useMemo(() => {
    return (
      fullName !== (user?.fullname || "") ||
      bio !== (user?.bio || "") ||
      selectedAvatarSeed !== (user?.fullname || "Alice")
    )
  }, [fullName, bio, selectedAvatarSeed, user])

  const passwordValid = useMemo(() => {
    const currentValid = currentPassword.length >= 6
    const newValid = newPassword.length >= 6
    const match = newPassword === confirmPassword
    return currentValid && newValid && match && newPassword !== currentPassword
  }, [currentPassword, newPassword, confirmPassword])

  const handleUpdateProfile = useCallback(async () => {
    if (!profileChanged) return

    try {
      const result = await updateProfile({
        fullname: fullName,
        bio,
        profilePic: avatarUrl,
      })

      // Update auth store with new user data
      if (result?.user) {
        updateUser(result.user)
      }
    } catch (error) {
      console.error("Error updating profile:", error)
    }
  }, [profileChanged, fullName, bio, avatarUrl, updateProfile, updateUser])

  const handleChangePassword = useCallback(async () => {
    setPasswordError("")

    if (!passwordValid) {
      setPasswordError("Password requirements not met")
      return
    }

    if (newPassword === currentPassword) {
      setPasswordError("New password must be different from current password")
      return
    }

    try {
      await changePassword({
        currentPassword,
        newPassword,
      })

      // Clear form
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      setShowPasswordForm(false)
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to change password"
      setPasswordError(message)
    }
  }, [passwordValid, newPassword, currentPassword, changePassword])

  const isLoading =
    updateProfileState.isLoading || changePasswordState.isLoading

  return (
    <div className="space-y-6">
      {/* Profile Picture Section */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Picture</CardTitle>
          <CardDescription>
            Choose from our collection of avatars
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-6 sm:flex-row">
          <Avatar className="h-24 w-24 sm:h-32 sm:w-32">
            <AvatarImage src={avatarUrl} alt={fullName} />
            <AvatarFallback>
              {fullName.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <Button
            variant="outline"
            onClick={() => setShowAvatarDialog(true)}
            className="w-full sm:w-auto"
          >
            Choose Avatar
          </Button>
        </CardContent>
      </Card>

      {/* Avatar Selection Dialog */}
      <Dialog open={showAvatarDialog} onOpenChange={setShowAvatarDialog}>
        <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Select Your Avatar</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
            {AVATAR_SEEDS.map((seed) => (
              <button
                key={seed}
                onClick={() => {
                  setSelectedAvatarSeed(seed)
                  setShowAvatarDialog(false)
                }}
                className={cn(
                  "flex flex-col items-center gap-2 rounded-lg p-2 transition-colors hover:bg-accent",
                  selectedAvatarSeed === seed &&
                    "border-2 border-primary bg-primary/5"
                )}
              >
                <Avatar className="h-12 w-12 sm:h-16 sm:w-16">
                  <AvatarImage src={generateAvatarUrl(seed)} alt={seed} />
                  <AvatarFallback>{seed.slice(0, 2)}</AvatarFallback>
                </Avatar>
                <span className="text-xs text-muted-foreground">{seed}</span>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Profile Information Section */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Update your profile details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Field>
            <FieldLabel htmlFor="fullname" className="text-muted-foreground">
              Full Name
            </FieldLabel>
            <InputGroup>
              <InputGroupInput
                id="fullname"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </InputGroup>
          </Field>

          <Field>
            <FieldLabel htmlFor="bio" className="text-muted-foreground">
              Bio
            </FieldLabel>
            <Textarea
              id="bio"
              placeholder="Tell us about yourself"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              maxLength={160}
              rows={4}
              className="resize-none"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              {bio.length} / 160 characters
            </p>
          </Field>

          <Button
            onClick={handleUpdateProfile}
            disabled={!profileChanged || isLoading}
            className="w-full sm:w-auto"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Profile"
            )}
          </Button>

          {updateProfileState.error && (
            <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
              {updateProfileState.error?.response?.data?.message ||
                updateProfileState.error?.message ||
                "Failed to update profile"}
            </div>
          )}
        </CardContent>
      </Card>

      <Separator />

      {/* Password Section */}
      <Card>
        <CardHeader>
          <CardTitle>Password</CardTitle>
          <CardDescription>Manage your account password</CardDescription>
        </CardHeader>
        <CardContent>
          {!showPasswordForm ? (
            <Button
              variant="outline"
              onClick={() => setShowPasswordForm(true)}
              className="w-full sm:w-auto"
            >
              Change Password
            </Button>
          ) : (
            <div className="space-y-4">
              <Field>
                <FieldLabel
                  htmlFor="current-password"
                  className="text-muted-foreground"
                >
                  Current Password
                </FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    id="current-password"
                    type={showCurrentPassword ? "text" : "password"}
                    placeholder="Enter current password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                  <InputGroupButton
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="cursor-pointer"
                  >
                    {showCurrentPassword ? <EyeIcon /> : <EyeOffIcon />}
                  </InputGroupButton>
                </InputGroup>
              </Field>

              <Field>
                <FieldLabel
                  htmlFor="new-password"
                  className="text-muted-foreground"
                >
                  New Password
                </FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    id="new-password"
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Enter new password (min. 6 characters)"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <InputGroupButton
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="cursor-pointer"
                  >
                    {showNewPassword ? <EyeIcon /> : <EyeOffIcon />}
                  </InputGroupButton>
                </InputGroup>
              </Field>

              <Field>
                <FieldLabel
                  htmlFor="confirm-password"
                  className="text-muted-foreground"
                >
                  Confirm Password
                </FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    id="confirm-password"
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </InputGroup>
                {confirmPassword && newPassword !== confirmPassword && (
                  <p className="mt-1 text-xs text-destructive">
                    Passwords do not match
                  </p>
                )}
              </Field>

              {passwordError && (
                <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
                  {passwordError}
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  onClick={handleChangePassword}
                  disabled={!passwordValid || isLoading}
                  className="flex-1 sm:flex-initial"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Update Password"
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowPasswordForm(false)
                    setCurrentPassword("")
                    setNewPassword("")
                    setConfirmPassword("")
                    setPasswordError("")
                  }}
                  className="flex-1 sm:flex-initial"
                  disabled={isLoading}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
