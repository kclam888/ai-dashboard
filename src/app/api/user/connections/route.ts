import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const { provider } = await req.json();

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if user has other login methods before disconnecting
    const accounts = await prisma.account.findMany({
      where: { userId: user.id }
    })

    if (accounts.length <= 1) {
      return NextResponse.json(
        { error: "Cannot remove last login method" },
        { status: 400 }
      );
    }

    // Delete the connection
    await prisma.account.deleteMany({
      where: {
        userId: user.id,
        provider,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}