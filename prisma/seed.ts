import { PrismaClient } from '@prisma/client';
import { teacherPrompts } from '../app/example-prompts/data';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding example prompts...');
  
  // Create example prompts
  for (const prompt of teacherPrompts) {
    await prisma.examplePrompt.upsert({
      where: { 
        title_category_type: {
          title: prompt.title,
          category: prompt.category,
          type: prompt.type
        }
      },
      update: {}, // Do nothing if it exists
      create: {
        title: prompt.title,
        text: prompt.text,
        category: prompt.category,
        gradeLevel: prompt.gradeLevel,
        type: prompt.type
      }
    });
  }
  
  console.log('Example prompts seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 