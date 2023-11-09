import api from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCopyToClipboard } from 'usehooks-ts';
import Link from "next/link";

export default function Post ({ post }) {

    const queryClient = useQueryClient();

    const [value, copy] = useCopyToClipboard();

    const likePost = useMutation({
        mutationFn: () => api.likePost(post.id as string),
        onSuccess: () => queryClient.invalidateQueries()
    });

    return (
        <div className="flex flex-col gap-2 border-b-2 border-gray-300">
            <div className="flex gap-2 p-4">
                <img src={post.user.image} className="w-14 h-14 rounded-full" /> 
                <div className="flex flex-col">
                    <Link href={"/app/profile/" + post.userId} className="font-semibold text-lg">{post.user.name}</Link>
                    <h4 className="text-sm text-gray-600">{post.user.email}</h4>
                </div>
            </div>
            <p className="px-4">
                {post.content}
            </p>
            <div className="flex justify-between text-center items-center mt-4">
                <Link href={"/app/post/" + post.id} className="w-full p-2 border-t-2 border-gray-300">
                    {post.replies.length} Replies
                </Link>
                <button 
                    onClick={() => likePost.mutate()} 
                    className={post.requesterHasLiked ? "text-blue-500 font-semibold w-full p-2 border-x-2 border-t-2 border-gray-300" : "w-full p-2 border-x-2 border-t-2 border-gray-300"}>
                    {post.likes.length} Likes
                </button>
                <button onClick={() => copy(process.env.NEXT_PUBLIC_BASE_URL + '/app/post/' + post.id)} className="w-full p-2 border-t-2 border-gray-300">
                    {value ? "Copied to clipboard!" : "Share"}
                </button>
            </div>
        </div>
    );
}