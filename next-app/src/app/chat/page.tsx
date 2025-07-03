import ChatClient from "@/components/ChatClient";
import { verifyAuth } from "@/lib/auth";

export type UserInfo = {
  profileImage: string;
  nickname: string;
};


export default async function ChatPage() {
  const { user } = await verifyAuth();

  if (!user) {
    return (
      <div className="min-h-screen max-w-3xl mx-auto p-10">
        <div className="text-center py-12">
          <p className="text-red-500">유저가 없습니다.</p>
        </div>
      </div>
    );
  }

  const userInfo = await prisma?.user.findUnique({
    where: { id: user.id },
    select: {
      profileImage: true,
      nickname: true,
    },
  });

  return <ChatClient userInfo={userInfo} />;
}
