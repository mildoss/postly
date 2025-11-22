import Image from "next/image";

type AvatarProps = {
  src?: string | null;
  alt?: string | null;
  fallback?: string;
  className?: string;
}

export const Avatar = ({
  src,
  alt,
  fallback,
  className = "w-10 h-10"
  }: AvatarProps) => {
  const letter = fallback?.charAt(0).toUpperCase() || "?";

  return (
    <div
      className={`rounded-full bg-blue-600 flex items-center justify-center text-white font-bold flex-shrink-0 relative overflow-hidden ${className}`}
    >
      {src ? (
        <Image
          src={src}
          alt={alt || "Avatar"}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      ) : (
        <span>{letter}</span>
      )}
    </div>
  );
}