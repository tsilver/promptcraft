-- CreateTable
CREATE TABLE "ExamplePrompt" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "gradeLevel" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "useCount" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "ExamplePrompt_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ExamplePrompt_category_idx" ON "ExamplePrompt"("category");

-- CreateIndex
CREATE INDEX "ExamplePrompt_gradeLevel_idx" ON "ExamplePrompt"("gradeLevel");

-- CreateIndex
CREATE INDEX "ExamplePrompt_type_idx" ON "ExamplePrompt"("type");

-- CreateIndex
CREATE INDEX "ExamplePrompt_useCount_idx" ON "ExamplePrompt"("useCount");
