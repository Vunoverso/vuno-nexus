/*
  Warnings:

  - You are about to drop the `PromptHistory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "PromptHistory";

-- CreateTable
CREATE TABLE "LogExecucao" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "project" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "result" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LogExecucao_pkey" PRIMARY KEY ("id")
);
