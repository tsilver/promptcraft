/*
  Warnings:

  - A unique constraint covering the columns `[title,category,type]` on the table `ExamplePrompt` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ExamplePrompt_title_category_type_key" ON "ExamplePrompt"("title", "category", "type");
