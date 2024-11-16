import prisma from "@/lib/prisma"
import { Prisma } from "@prisma/client"
import { z } from "zod"

const NewRequestSchema = z.object({
  key: z.nullable(z.string()),
  type: z.enum(["TEXT", "FILE"]),
  mime: z.string(),
  expireAt: z.string()
    .refine((val) => !isNaN(new Date(val).getTime()), {
      message: "Invalid expireAt",
    }),
  accessCode: z.nullable(z.string()),
  language: z.string().min(1),
  content: z.string().min(1),
})
// TODO: Make sure the type is pair with Paste

export async function POST(req: Request) {
  const formData = await req.formData()
  const ipAddr = req.headers.get("x-forward-for")

  // Vaildate the data
  const parsedData = NewRequestSchema.safeParse({
    key: formData.get("key"),
    type: formData.get("type"),
    mime: formData.get("mime"),
    expireAt: formData.get("expireAt"),
    accessCode: formData.get("accessCode"),
    language: formData.get("language"),
    content: formData.get("content"),
  })

  if (!parsedData.success) {
    console.log(parsedData.error)
    const errors = parsedData.error.errors.map((err) => err.message)
    return new Response(
      JSON.stringify({
        err: errors.join(", "),
      }),
      { status: 400 }
    )
  }

  // Deal with the data
  if (parsedData.data.type === "FILE") {
    // TODO
    return new Response(
      JSON.stringify({
        err: "Not implemented",
      }),
      { status: 500 }
    )
  } else {
    if (!parsedData.data.key || parsedData.data.key === "") {
      parsedData.data.key = Math.random().toString(36).substring(2, 10)
    }
    const data = {
      author: "Anonmyous", // TODO: Update to actually user
      authorId: -1,
      key: parsedData.data.key,
      type: parsedData.data.type,
      mime: "Text/Plain",
      ip: ipAddr,
      expireAt: new Date(parsedData.data.expireAt),
      accessCode: parsedData.data.accessCode || null,
      language: parsedData.data.language,
      content: parsedData.data.content,
    }
    try {
      const write = await prisma.paste.create({ data })
      return new Response(
        JSON.stringify({
          key: write.key,
          path: `/s/${write.key}`,
        }),
        { status: 200 }
      )
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === "P2002"
      ) {
        return new Response(JSON.stringify({
          err: "Duplicate key error"
        }), { status: 409 })
      }
      throw e
    }
  }
}
