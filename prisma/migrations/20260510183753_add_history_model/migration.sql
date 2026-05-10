-- CreateEnum
CREATE TYPE "HISTORY_STATUS" AS ENUM ('PENDING', 'SUCCESS', 'FAILED');

-- CreateTable
CREATE TABLE "History" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "workspaceName" TEXT NOT NULL,
    "collectionId" TEXT,
    "collectionName" TEXT,
    "requestId" TEXT,
    "requestName" TEXT NOT NULL,
    "method" "REST_METHOD" NOT NULL,
    "url" TEXT NOT NULL,
    "status" "HISTORY_STATUS" NOT NULL DEFAULT 'PENDING',
    "httpStatus" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "History_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "History_userId_createdAt_idx" ON "History"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "History_workspaceId_createdAt_idx" ON "History"("workspaceId", "createdAt");

-- AddForeignKey
ALTER TABLE "History" ADD CONSTRAINT "History_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
