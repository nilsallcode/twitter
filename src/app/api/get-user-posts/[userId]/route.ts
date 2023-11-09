import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET (request: NextRequest, { params }: { params: { userId: string } }) {

    const session = await getServerSession(authOptions);
    const userId = params.userId;

    if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
        where: { id: userId }
    });

    if (!user) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const posts = await prisma.post.findMany({
        where: { userId: user.id },
        include: { user: true, likes: true, replies: true },
        orderBy: {
            created_at: 'desc'
        }
    });

    let response = [];
    for (const post of posts) {
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
        response.push(postWithLikeStatus);
    }

    return NextResponse.json(response, { status: 200 });

}