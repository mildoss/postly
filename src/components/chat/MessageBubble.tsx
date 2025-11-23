import {Message} from "@/lib/types";
import {formatTime} from "@/lib/utils";

export const MessageBubble = (
  {message, isOwn, onDelete}: {message: Message; isOwn: boolean, onDelete: () => void}) => {

  return (
    <div className={`relative flex w-full mb-2 ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[70%] px-4 py-2 rounded-lg break-all ${
          isOwn
            ? 'bg-primary text-primary-foreground rounded-br-none'
            : 'bg-card text-card-foreground border border-border rounded-bl-none'
        }`}
      >
        <p className="mt-2">{message.content}</p>
        <span className={`text-[10px] block text-right mt-1 ${isOwn ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
          {formatTime(message.created_at)}
        </span>
      </div>
      {isOwn && (<button
        onClick={onDelete}
        className="absolute w-5 h-5 flex items-center justify-center group cursor-pointer"
      >
        <span
          className="absolute top-1/2 left-1/2 w-4 h-1 bg-muted-foreground rotate-45 group-hover:bg-destructive transition-colors -translate-x-1/2 -translate-y-1/2">
        </span>
        <span
          className="absolute top-1/2 left-1/2 w-4 h-1 bg-muted-foreground -rotate-45 group-hover:bg-destructive transition-colors -translate-x-1/2 -translate-y-1/2">
        </span>
      </button>)}
    </div>
  )
}