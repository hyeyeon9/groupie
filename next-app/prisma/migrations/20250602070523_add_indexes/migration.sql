-- CreateIndex
CREATE INDEX "idx_comment_study_id" ON "Comment"("studyId");

-- CreateIndex
CREATE INDEX "idx_study_performance" ON "Study"("scrap" DESC, "views" DESC, "createdAt" DESC);
