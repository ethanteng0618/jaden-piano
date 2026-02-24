export function ShinyText({
    text,
    disabled = false,
    speed = 3,
    className = '',
}: {
    text: string;
    disabled?: boolean;
    speed?: number;
    className?: string;
}) {
    const animationDuration = `${speed}s`;

    return (
        <div
            className={`text-muted-foreground/80 bg-clip-text inline-block ${disabled ? '' : 'animate-shine hover:text-foreground transition-colors duration-500'} ${className}`}
            style={{
                backgroundImage: 'linear-gradient(120deg, rgba(255, 255, 255, 0) 40%, rgba(255, 255, 255, 0.8) 50%, rgba(255, 255, 255, 0) 60%)',
                backgroundSize: '200% 100%',
                WebkitBackgroundClip: 'text',
                animationDuration,
            }}
        >
            {text}
        </div>
    );
}
