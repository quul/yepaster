import AccessCodeRequired from "@/components/AccessCodeRequired"
import DisplayPaste from "@/components/DisplayPaste"
import Page403 from "@/components/Page403"
import Page404 from "@/components/Page404"
import prisma from "@/lib/prisma"
import { Prisma } from "@prisma/client"

export default async function RawView({
  params,
  searchParams,
}: {
  params: Promise<{ key: string }>
  searchParams: Promise<{ accessCode: string }>
}) {
  const { key } = await params
  try {
    const paste = await prisma.paste.findUniqueOrThrow({
      where: {
        key,
      },
    })
    if (!paste.expireAt.getTime() && paste.expireAt < new Date()) {
      return <Page403 message="This paste has expired" />
    }
    if (paste.accessCode) {
      const { accessCode } = await searchParams
      if (!accessCode) {
        return <AccessCodeRequired />
      } else if (accessCode === paste.accessCode) {
        return <DisplayPaste paste={paste} />
      } else {
        return <Page403 message="Access Code Incorrect" />
      }
    } else {
      return <DisplayPaste paste={paste} />
    }
  } catch (e) {
    if (
      e instanceof Prisma.PrismaClientKnownRequestError &&
      e.code === "P2025"
    ) {
      return <Page404 />
    }
  }
}
