import { FaApple, FaGoogle } from "react-icons/fa";
import { FaMicrosoft } from "react-icons/fa";

export default function SignupForm() {
  return (
    <div className="flex flex-col space-y-7 mt-4">
      <div className="flex flex-col space-y-2">
        <label htmlFor="" className="text-muted-foreground font-semibold text-xs pl-2">
          Fullname
        </label>
        <input
          type="text"
          placeholder="John Doe"
          className="w-full bg-background/30 text-foreground/60 rounded-2xl py-3 px-5 focus:outline-none focus:ring-2 focus:ring-ring/30 transition-all duration-100"
        />
      </div>
      <div className="flex flex-col space-y-2">
        <label htmlFor="" className="text-muted-foreground font-semibold text-xs pl-2">
          Email or Username
        </label>
        <input
          type="text"
          placeholder="@name@atelier.com"
          className="w-full bg-background/30 text-foreground/60 rounded-2xl py-3 px-5 focus:outline-none focus:ring-2 focus:ring-ring/30 transition-all duration-100"
        />
      </div>

      <div className="flex flex-col space-y-2">
        <label htmlFor="" className="text-muted-foreground font-semibold text-xs pl-2">
          Password
        </label>
        <input
          type="password"
          placeholder="•••••••••••"
          className="w-full bg-background/30 text-foreground/60 rounded-2xl py-3 px-5 focus:outline-none focus:ring-2 focus:ring-ring/30 transition-all duration-100"
        />
      </div>

      <button className="w-full rounded-4xl bg-linear-to-r from-foreground/50 via-foreground/40 to-foreground/30 text-background font-semibold py-3 px-5 hover:bg-foreground/20 cursor-pointer transition-all duration-100">
        Register
      </button>

      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-foreground/10" />
        <span className="text-foreground/30 text-xs tracking-widest">
          OR CONTINUE WITH
        </span>
        <div className="flex-1 h-px bg-foreground/10" />
      </div>

      <div>
        <div className="flex flex-row space-x-5">
          <button className="flex-1 flex items-center justify-center py-3 rounded-2xl bg-foreground/5 border border-border hover:bg-foreground/10 transition-all duration-300">
            <FaGoogle src="google-icon-url" className="w-5 h-5 text-foreground/70" />
          </button>
          <button className="flex-1 flex items-center justify-center py-3 rounded-2xl bg-foreground/5 border border-border hover:bg-foreground/10 transition-all duration-300">
            <FaApple className="w-5 h-5 text-foreground/70" />
          </button>
          <button className="flex-1 flex items-center justify-center py-3 rounded-2xl bg-foreground/5 border border-border hover:bg-foreground/10 transition-all duration-300">
            <FaMicrosoft className="w-5 h-5 text-foreground/70" />
          </button>
        </div>
      </div>
    </div>
  );
}