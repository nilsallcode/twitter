"use client";
import { useQuery, useMutation } from "@tanstack/react-query";
import api from "@/lib/axios";
import { redirect, useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Post from "@/components/Post";
import PageTitle from "@/components/PageTitle";

export default function Profile () {

    const {data: session} = useSession();
    const params = useParams();

    const user = useQuery({
        queryKey: ['user', params.userId],
        queryFn: () => api.getUser(params.userId as string)
    });

    const posts = useQuery({
        queryKey: ['posts', params.userId],
        queryFn: () => api.getUserPosts(params.userId as string)
    });

    const followUser = useMutation({
        mutationFn: () => api.followUser(params.userId as string),
        onSuccess: user.refetch
    });

    if (user.isError) {
        return redirect('/app');
    }

    return (
        <>
            <PageTitle pageTitle="Profile" />
            {user.isLoading ? <p>Loading...</p> : null}
            {user.isSuccess ? (
                <div className="flex justify-between p-6 border-b-2 border-gray-300">
                    <div className="flex items-center gap-4">
                        <img src={user.data.image} className="w-24 rounded-full" />
                        <div className="flex flex-col gap-2">
                            <h2 className="text-xl font-semibold">{user.data.name}</h2>
                            <h4>{user.data.email}</h4>
                        </div>
                    </div>
                    <div className="flex flex-col gap-4">
                        <div className="flex gap-4">
                            <div className="text-center">
                                <h3 className="font-semibold">{user.data.followed.length ?? "-"}</h3>
                                <h4>Followers</h4>
                            </div>
                            <div className="text-center">
                                <h3 className="font-semibold">{user.data.following.length ?? "-"}</h3>
                                <h4>Following</h4>
                            </div>
                        </div>
                        {user.data.email === session?.user?.email ? (
                            <button className="bg-blue-400 p-1 text-white rounded-full hover:bg-blue-500">Edit Profile</button>
                        ) : (
                            <button onClick={() => followUser.mutate()} className="bg-blue-400 p-1 text-white rounded-full hover:bg-blue-500">
                                {user.data.isFollowing ? "Unfollow" : "Follow"}
                            </button>
                        )}
                    </div>
                </div>
            ) : null}
            {posts.isSuccess ? (
                <>
                    {posts.data.map((post: any, index: any) => (
                        <Post post={post} key={index} />
                    ))}
                </>
            ) : null}
        </>
    );
}