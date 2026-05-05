import { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import LoginForm from "./LoginForm";
import SignupForm from "./SignUpForm";

export default function Auth() {
  const [activeTab, setActiveTab] = useState("login");

  return (
    <>
      <div className="flex h-screen bg-background">
        {/* Left Side */}
        <div className="w-1/2 flex flex-col justify-center px-16">
          <h1 className="text-5xl font-bold mb-4">
            ConnectHub
          </h1>
          <p className="text-primary text-lg mb-8">
            The Digital Atelier. A curated space for visionaries to connect,
            create, and inspire.
          </p>
          <div className="relative w-full h-72 bg-card rounded-xl mb-4 flex items-center justify-center">
            <img
              className="rounded-3xl w-full h-72 object-cover"
              src="https://cdn.dribbble.com/userupload/22996840/file/original-222fd78c76cc385db7089a002c90902e.png?resize=752x&vertical=center"
              alt="Logo"
            />
            <div className="absolute inset-0 bg-background/40" />
          </div>
          <div className="ml-5 mt-7 flex flex-row space-x-4 items-center">
            <div className="flex">
              <img
                className="w-8 h-8 rounded-full object-cover border-2 border-foreground/20"
                src="https://img.freepik.com/free-photo/beautiful-young-businesswoman-smiling-camera_74855-3966.jpg?semt=ais_incoming&w=740&q=80"
                alt="person-1"
              />
              <img
                className="w-8 h-8 rounded-full object-cover border-2 border-foreground/20 -ml-3"
                src="https://media.gettyimages.com/id/1299077582/photo/positivity-puts-you-in-a-position-of-power.jpg?s=612x612&w=gi&k=20&c=xBZQF30WrZt9HWBKseqwDmKotwJGWe8jkEI9cajC1RM="
                alt="person-2"
              />
              <img
                className="w-8 h-8 rounded-full object-cover border-2 border-foreground/20 -ml-3"
                src="https://images.stockcake.com/public/a/3/9/a398c3fc-790b-4c2c-8715-c8d5c627b08a_large/smiling-professional-man-stockcake.jpg"
                alt="person-3"
              />
            </div>
            <p className="text-muted-foreground">Join 12,000+ creators today</p>
          </div>
        </div>

        {/* Right Side */}
        <div className="w-1/2 flex items-center justify-center">
          <div className="relative w-105">
            {/* Glow layer */}
            <div className="absolute -inset-4 bg-linear-to-r from-foreground/60 via-foreground/50 to-foreground/20 blur-3xl opacity-5 rounded-3xl" />

            {/* Glass card */}
            <div className="flex flex-col items-center w-105 relative mt-15">
              <div className="bg-foreground/2 backdrop-blur-xl w-full border border-border rounded-4xl p-8 flex flex-col gap-6 shadow-2xl">
                {/* Tab Selection */}
                <div className="relative flex flex-row items-center mx-3 bg-background/30 rounded-4xl p-1">
                  {/* Sliding pill — always rendered, just moves */}
                  <motion.div
                    layoutId="pill"
                    className="absolute top-1 bottom-1 w-1/2 bg-foreground/10 rounded-4xl"
                    animate={{ left: activeTab === "login" ? "4px" : "50%" }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />

                  <button
                    onClick={() => setActiveTab("login")}
                    className="relative flex-1 py-1.5 z-10 text-sm"
                  >
                    <span
                      className={
                        activeTab === "login"
                          ? "text-foreground/90"
                          : "text-foreground/50"
                      }
                    >
                      Login
                    </span>
                  </button>

                  <button
                    onClick={() => setActiveTab("signup")}
                    className="relative flex-1 py-1.5 z-10 text-sm"
                  >
                    <span
                      className={
                        activeTab === "signup"
                          ? "text-foreground/90"
                          : "text-foreground/50"
                      }
                    >
                      Sign Up
                    </span>
                  </button>
                </div>

                {/* Form Content */}
                {/* Form Content */}
                <div className="h-120">
                  {activeTab === "login" ? <LoginForm /> : <SignupForm />}
                </div>
              </div>

              <p className="text-foreground/30 text-xs mt-10">
                @ 2026 ConnectHub Digital Atelier. Crafter with precision.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}