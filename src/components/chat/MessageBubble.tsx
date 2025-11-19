import {Message} from "@/lib/types";

export const MessageBubble = ({message, isOwn}: {message: Message; isOwn: boolean}) => {
  const time = new Date(message.created_at).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});

  return (
    <div className={`flex w-full mb-2 ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[70%] px-4 py-2 rounded-lg break-all ${
          isOwn
            ? 'bg-blue-600 text-white rounded-br-none'
            : 'bg-gray-700 text-gray-200 rounded-bl-none'
        }`}
      >
        <p>{message.content}</p>
        <span className={`text-[10px] block text-right mt-1 ${isOwn ? 'text-blue-200' : 'text-gray-400'}`}>
          {time}
        </span>
      </div>
    </div>
  )
}