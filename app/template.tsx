export default function Template({ children }: { children: React.ReactNode }) {
    return (
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out fill-mode-both">
            {children}
        </div>
    )
}
