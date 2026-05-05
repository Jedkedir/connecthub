import { useState } from "react"
import { motion } from "framer-motion"
import LoginForm from "./LoginForm"
import SignupForm from "./SignUpForm"

import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function Auth() {
  const [activeTab, setActiveTab] = useState("login")

  return (
    <div className="grid min-h-screen bg-background lg:grid-cols-2">
      <section className="hidden flex-col justify-center gap-8 p-16 lg:flex">
        <div className="flex flex-col gap-4">
          <h1 className="text-5xl font-bold tracking-normal">ConnectHub</h1>
          <p className="max-w-xl text-lg text-muted-foreground">
            The Digital Atelier. A curated space for visionaries to connect,
            create, and inspire.
          </p>
        </div>

        <Card className="overflow-hidden">
          <CardContent className="relative p-0">
            <img
              className="h-72 w-full object-cover"
              src="https://cdn.dribbble.com/userupload/22996840/file/original-222fd78c76cc385db7089a002c90902e.png?resize=752x&vertical=center"
              alt="ConnectHub preview"
            />
            <div className="absolute inset-0 bg-background/40" />
          </CardContent>
        </Card>

        <div className="flex flex-row items-center gap-4">
          <div className="flex">
            <Avatar className="size-8 border-2 border-background">
              <AvatarImage
                src="https://img.freepik.com/free-photo/beautiful-young-businesswoman-smiling-camera_74855-3966.jpg?semt=ais_incoming&w=740&q=80"
                alt="person-1"
              />
            </Avatar>
            <Avatar className="-ml-2 size-8 border-2 border-background">
              <AvatarImage
                src="https://media.gettyimages.com/id/1299077582/photo/positivity-puts-you-in-a-position-of-power.jpg?s=612x612&w=gi&k=20&c=xBZQF30WrZt9HWBKseqwDmKotwJGWe8jkEI9cajC1RM="
                alt="person-2"
              />
            </Avatar>
            <Avatar className="-ml-2 size-8 border-2 border-background">
              <AvatarImage
                src="https://images.stockcake.com/public/a/3/9/a398c3fc-790b-4c2c-8715-c8d5c627b08a_large/smiling-professional-man-stockcake.jpg"
                alt="person-3"
              />
            </Avatar>
          </div>
          <p className="text-muted-foreground">Join 12,000+ creators today</p>
        </div>
      </section>

      <section className="flex items-center justify-center p-6">
        <div className="flex w-full max-w-md flex-col gap-8">
          <Card>
            <CardContent className="flex flex-col gap-6 p-8">
              <div className="relative grid grid-cols-2 rounded-md bg-muted p-1">
                <motion.div
                  layoutId="auth-tab-pill"
                  className="absolute top-1 bottom-1 w-1/2 rounded-sm bg-background shadow-sm"
                  animate={{ left: activeTab === "login" ? "4px" : "50%" }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />

                <Button
                  className="relative z-10"
                  onClick={() => setActiveTab("login")}
                  type="button"
                  variant="ghost"
                >
                  Login
                </Button>
                <Button
                  className="relative z-10"
                  onClick={() => setActiveTab("signup")}
                  type="button"
                  variant="ghost"
                >
                  Sign Up
                </Button>
              </div>

              <div className="min-h-120">
                {activeTab === "login" ? <LoginForm /> : <SignupForm />}
              </div>
            </CardContent>
          </Card>

          <p className="text-center text-xs text-muted-foreground">
            @ 2026 ConnectHub Digital Atelier. Crafter with precision.
          </p>
        </div>
      </section>
    </div>
  )
}
