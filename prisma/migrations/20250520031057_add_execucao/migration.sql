-- CreateTable
CREATE TABLE "Execucao" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "projeto" TEXT NOT NULL,
    "linguagem" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "entrada" TEXT NOT NULL,
    "saida" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Execucao_pkey" PRIMARY KEY ("id")
);
