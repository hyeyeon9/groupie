import CommentList from "@/components/comments/CommentList";
import { verifyAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import ViewCounter from "@/components/study/ViewCounter";
import MarkdownPreview from "@/components/markdown/MarkdownPreview";
import { formatRelativeTime } from "@/lib/date";
import Image from "next/image";
import ScrapButton from "@/components/ui/buttons/ScrapButton";
import ApplyButton from "@/components/ui/buttons/ApplyButton";
import StudyDeleteButton from "@/components/ui/buttons/StudyDeleteButton";

type StudyDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function StudyDetailPage({
  params,
}: StudyDetailPageProps) {
  const { id } = await params;
  const numberId = Number(id);
  const { user } = await verifyAuth();

  // 모든 필요한 데이터를 한 번에 병렬로 가져오기
  const [post, existingScrap] = await Promise.all([
    // 게시글과 댓글의 작성자 정보를 한 번에 가져오기
    prisma.study.findUnique({
      where: { id: numberId },
      include: {
        author: {
          select: {
            id: true,
            nickname: true,
            profileImage: true,
          },
        },
        comments: {
          include: {
            author: {
              select: {
                id: true,
                nickname: true,
                profileImage: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    }),
    // 스크랩 정보도 병렬로 가져오기 (사용자가 로그인된 경우에만)
    user
      ? prisma.scrap.findUnique({
          where: {
            userId_studyId: {
              userId: user.id,
              studyId: numberId,
            },
          },
        })
      : null,
  ]);

  if (!post) {
    return <p className="text-center mt-10">존재하지 않는 게시글입니다.</p>;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0); // 오늘 00:00:00

  const initiallyScraped = !!existingScrap;
  const comments = post.comments;

  return (
    <div className="flex flex-col max-w-3xl  mx-auto ">
      <ViewCounter id={post.id} />
      <div className="flex  flex-col w-full min-h-100 mt-10 px-6 md:py-6 shadow-sm bg-white ">
        <h1 className="text-4xl lg:text-5xl font-bold mb-4">{post.title}</h1>
        {post.author.id === user?.id ? (
          <div className="flex gap-3 justify-end mb-4">
            <Link href={`/study/${post.id}/edit`}>
              <button className="text-gray-400 hover:cursor-pointer">
                수정
              </button>
            </Link>
            <StudyDeleteButton postId={post.id} />
          </div>
        ) : (
          <ApplyButton post={post} isLoggedIn={!!user?.id} />
        )}

        <div className="flex justify-between">
          <div className="flex gap-3 items-center">
            <div className="w-8 h-8 rounded-full  overflow-hidden relative">
              <Image
                src={post.author.profileImage ?? "/default-avatar.png"}
                alt="프로필 사진"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex flex-col ">
              <p className="font-bold text-sm lg:text-base">
                {post.author.nickname}
              </p>
              <div className="flex gap-2 text-gray-500 text-sm lg:text-base">
                <p>{formatRelativeTime(post.createdAt)}</p>
                <p> 조회수 : {post.views}</p>
              </div>
            </div>
          </div>

          <ScrapButton
            studyId={post.id}
            initialScrapCount={post.scrap}
            initiallyScraped={initiallyScraped}
            isLoggedIn={!!user?.id}
          />
        </div>

        <div className="border-t-1 border-t-gray-200 mt-3 py-5 grid grid-cols-2 gap-y-4 lg:text-base text-sm ">
          <div className="flex gap-5">
            <p className="font-bold">카테고리 </p>
            <p className="bg-gray-200 text-sm w-fit px-3 py-1   rounded-full ">
              {post.category}
            </p>
          </div>
          <div className="flex gap-5">
            <p className="font-bold">진행 방식 </p>
            <p>{post.studyType}</p>
          </div>
          <div className="flex gap-5">
            <p className="font-bold">모집 인원 </p>
            <p>{post.maxParticipants}명</p>
          </div>
          <div className="flex gap-5">
            <p className="font-bold">시작 예정</p>
            <p>{post.startDate?.toISOString().split("T")[0]}</p>
          </div>
          <div className="flex gap-5">
            <p className="font-bold">연락 방법</p>
            <p>{post.contactMethod}</p>
          </div>
          <div className="flex gap-5">
            <p className="font-bold">모집 여부</p>
            <p
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                post.startDate && new Date(post.startDate) < today
                  ? "bg-gray-300 text-gray-800"
                  : "bg-green-200 text-gray-800"
              }`}
            >
              {" "}
              {post.startDate && new Date(post.startDate) < today
                ? "모집 마감"
                : "모집중"}
            </p>
          </div>
        </div>
        <div className="prose max-w-none py-6 lg:py-8 lg:px-2">
          {/* 썸네일 이미지 */}
          <div className=" w-full flex justify-center ">
            {post.image && (
              <div
                className="mb-6 flex justify-center w-[320px] h-[200px] 
            lg:w-full lg:h-[400px]"
              >
                <Image
                  src={post.image}
                  alt="썸네일"
                  width={800}
                  height={500}
                  className="w-full h-auto object-cover rounded"
                />
              </div>
            )}
          </div>

          {/* 마크다운 내용 */}
          <MarkdownPreview content={post.content} />
        </div>
      </div>
      <div className="mt-10 w-full px-5 lg:p-0 pb-20 ">
        <CommentList
          postId={post.id}
          initialComments={comments}
          currentUserId={user?.id}
        />
      </div>
    </div>
  );
}
