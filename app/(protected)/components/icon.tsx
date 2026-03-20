export default function Icon({ src, className = "" }: { src: string, className?: string }) {
    return (
        <div
            className={`w-5 h-5 bg-current ${className}`}
            style={{
                maskImage: `url(${src})`,
                WebkitMaskImage: `url(${src})`,
                maskSize: 'contain',
                WebkitMaskSize: 'contain',
                maskRepeat: 'no-repeat',
                WebkitMaskRepeat: 'no-repeat',
                maskPosition: 'center',
                WebkitMaskPosition: 'center',
            }}
        />
    );
}