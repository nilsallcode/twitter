import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST (request: NextRequest) {

    const session = await getServerSession(authOptions);
    const searchData = await request.json();

    if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (!searchData.content) {
        return NextResponse.json({ message: "You've left empty fields" }, { status: 402 });
    }

    const results = await prisma.user.findMany({
        where: {
            name: {
                contains: searchData.content
            }
        }
    });

    return NextResponse.json(results, { status: 200 });

}