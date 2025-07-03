import StudyFilterButtons from "@/components/study/filters/StudyFilterButtons";
import StudyList from "@/components/study/StudyList";
import SearchBar from "@/components/study/filters/SearchBar";

import NewStudyButton from "@/components/ui/buttons/NewStudyButton";
import { verifyAuth } from "@/lib/auth";
import TopStudyCard from "@/components/ui/card/TopStudyCard";

export default async function StudyHomePage() {
  const { user } = await verifyAuth();
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-8">
        {/* Top3 카드 섹션 */}

        <TopStudyCard />

        {/* 검색 및 스터디 모집 섹션 */}
        <div>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex-1 w-full sm:max-w-md ">
              <SearchBar />
            </div>
            <NewStudyButton isLoggedIn={!!user?.id} />
          </div>
          <div className="mt-6">
            <StudyFilterButtons />
          </div>
        </div>

        {/* 스터디 목록 섹션 */}
        <StudyList />
      </div>
    </div>
  );
}
