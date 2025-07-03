import { updateUserProfileImage } from "@/actions/user-actions";
import StudyListForMyPage from "@/components/user/StudyListForMyPage";
import MyPageTabs from "@/components/user/MyPageTabs";
import UploadAvatar from "@/components/user/UploadAvatar";
import { verifyAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function MyPage() {
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

  const userInfo = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      profileImage: true,
      nickname: true,
    },
  });

  return (
    <div className="min-h-screen max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">마이페이지</h1>
        <p className="text-gray-600">
          내가 작성한 글과 스크랩한 글을 관리하세요
        </p>
      </div>
      <UploadAvatar
        nickname={userInfo?.nickname ?? "닉네임"}
        defaultImage={userInfo?.profileImage ?? "/default-avatar.png"}
        onUpload={async (url) => {
          "use server";
          await updateUserProfileImage(user.id, url);
        }}
      />
      <MyPageTabs />
      <StudyListForMyPage userId={user.id} />
    </div>
  );
}
