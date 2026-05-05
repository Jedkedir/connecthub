export default function Footer() {
    return(
        <div className="text-center text-primary/50 text-xs md:text-md leading-relaxed max-x-2xl mx-auto border-t border-primary/10 py-5">
            <p>© {new Date().getFullYear()} ConnectHub. All rights reserved.</p>
        </div>
    )
}