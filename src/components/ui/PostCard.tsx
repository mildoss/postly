import {PostWithAuthor} from "@/lib/types";

export const PostCard = ({post}: {post: PostWithAuthor}) => {
  const username = post.users?.username || 'Anonymous';
  const postDate = new Date(post.created_at).toLocaleString();
  const avatarLetter = username.charAt(0).toUpperCase();

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow border border-gray-700">
      <div className="flex items-center mb-2 gap-2">
        <div
          className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold flex-shrink-0">
          {avatarLetter}
        </div>
        <span className="text-blue-400 font-bold">
          @{username}
        </span>
      </div>
      <p className="text-white mb-3">{post.content}</p>
      <span className="text-gray-500 text-sm">
        {postDate}
      </span>
    </div>
  )
}