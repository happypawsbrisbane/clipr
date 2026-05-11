-- CreateTable
CREATE TABLE "VerificationReport" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "offerId" TEXT NOT NULL,
    "vote" TEXT NOT NULL,
    "comment" TEXT,
    "anonId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE INDEX "VerificationReport_offerId_idx" ON "VerificationReport"("offerId");

-- CreateIndex
CREATE INDEX "VerificationReport_anonId_idx" ON "VerificationReport"("anonId");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationReport_offerId_anonId_key" ON "VerificationReport"("offerId", "anonId");
