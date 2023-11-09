import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET (request: NextRequest) {

    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user?.email ?? "" },
        include: { following: true }
    });

    if (!user) {
        return NextResponse.json({ message: "User could not be found" }, { status: 402 });
    }

    const posts = await prisma.post.findMany({
        include: { user: true, likes: true, replies: true },
        orderBy: {
            created_at: 'desc'
        }
    });

    let response = [];
    for (let post of posts) {

        let postWithLikeStatus = {
            ...post,
            requesterHasLiked: false
        };
        for (const like of post.likes) {
            if (like.userId === user.id) {
                postWithLikeStatus = {
                    ...post,
                    requesterHasLiked: true
                }
                break;
            } else {
                postWithLikeStatus = {
                    ...post,
                    requesterHasLiked: false
                }
            }
        }

        for (const follow of user.following) {
            if (follow.followedId === post.userId) {
                response.push(postWithLikeStatus);
            }
        }

        if (post.userId === user.id) {
            response.push(postWithLikeStatus);
        }
    }

    return NextResponse.json(response, { status: 200 });

}