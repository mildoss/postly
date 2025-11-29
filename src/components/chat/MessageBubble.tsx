import {Message} from "@/lib/types";
import {formatTime} from "@/lib/utils";
import {DeleteButton} from "@/components/ui/DeleteButton";

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
      {isOwn &&
        <DeleteButton onDelete={onDelete} absolute={true}/>
      }
    </div>
  )
}