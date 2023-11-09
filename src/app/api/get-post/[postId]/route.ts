import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET (request: NextRequest, { params }: { params: { postId: string } }) {

    const session = await getServerSession(authOptions);
    const postId = params.postId;

    if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const requester = await prisma.user.findUnique({
        where: { email: session?.user?.email ?? "" }
    });

    if (!requester) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const post = await prisma.post.findUnique({
        where: { id: postId },
        include: {
            user: true, 
            likes: true, 
            replies: {
                include: { user: true },
                orderBy: {
                    created_at: 'desc'
                }
            } 
        }
    });

    if (!post) {
        return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    let postWithLikeStatus = {
        ...post,
        requesterHasLiked: false
    }

    for (const like of post.likes) {
        if (like.userId === requester.id) {
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

    return NextResponse.json(postWithLikeStatus, { status: 200 });

}