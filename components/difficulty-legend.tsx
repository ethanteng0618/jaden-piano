export function DifficultyLegend() {
    return (
        <div className="flex flex-wrap items-center gap-4 text-sm mb-4">
            <span className="font-semibold text-foreground">Difficulty Legend:</span>
            <div className="flex items-center gap-2 text-muted-foreground">
                <div className="w-4 h-4 rounded-full border-2 border-green-500 bg-green-50 dark:bg-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.3)]"></div>
                <span>Beginner</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
                <div className="w-4 h-4 rounded-full border-2 border-yellow-500 bg-yellow-50 dark:bg-yellow-500/20 shadow-[0_0_10px_rgba(234,179,8,0.3)]"></div>
                <span>Intermediate</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
                <div className="w-4 h-4 rounded-full border-2 border-red-500 bg-red-50 dark:bg-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.3)]"></div>
                <span>Advanced</span>
            </div>
        </div>
    )
}
