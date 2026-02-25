export default function Template({ children }: { children: React.ReactNode }) {
    return (
        <div className="animate-in slide-in-from-bottom-2 duration-300 ease-out">
            {children}
        </div>
    )
}
