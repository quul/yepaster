import prisma from "@/lib/prisma"
import { Prisma } from "@prisma/client"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ key: string }> }
) {
  const { searchParams } = new URL(req.url)
  const accessCode = searchParams.get("accessCode")
  const { key } = await params

  if (!key) {
    return new Response("Key is required", { status: 400 })
  }

  try {
    const paste = await prisma.paste.findUniqueOrThrow({
      where: {
        key,
      },
    })

    if (!paste.expireAt.getTime() && paste.expireAt < new Date()) {
      return new Response("This paste has expired", { status: 403 })
    }

    if (paste.accessCode || paste.accessCode === "") {
      if (!accessCode || accessCode === "") {
        return new Response("Access Code Required", { status: 403 })
      } else if (accessCode !== paste.accessCode) {
        return new Response("Access Code Incorrect", { status: 403 })
      } else {
        return new Response(paste.content, {
          headers: {
            "Content-Type": "text/plain"
          }
        })
      }
    }

    return new Response(paste.content, {
      headers: {
        "Content-Type": "text/plain",
      },
    })
  } catch (e) {
    if (
      e instanceof Prisma.PrismaClientKnownRequestError &&
      e.code === "P2025"
    ) {
      return new Response("Paste not found", { status: 404 })
    }
    return new Response("Internal Server Error", { status: 500 })
  }
}
