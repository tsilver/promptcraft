# AI PromptCraft Analyzer

A Next.js application for teachers to input, evaluate, refine, and execute AI prompts.

## Features

- **Prompt Input and Evaluation**: Analyze prompts for effectiveness
- **Prompt Execution**: Test prompts with AI responses
- **Prompt Management**: Save and organize your prompts
- **Learning Resources**: Educational content on prompt engineering
- **User Authentication**: Secure login with Google via Supabase

## Tech Stack

- **Frontend**: Next.js 14 with App Router, React, and Tailwind CSS
- **Backend**: Next.js API routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Supabase

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables in `.env`:
   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/mydatabase"
   NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
   ```
4. Generate Prisma client:
   ```bash
   npm run prisma:generate
   ```
5. Create database schema:
   ```bash
   npm run prisma:push
   ```
6. Run the development server:
   ```bash
   npm run dev
   ```
7. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

- `app/`: Page components and API routes
- `components/`: Reusable UI components
- `lib/`: Utility functions and configurations
- `prisma/`: Database schema and configurations
- `public/`: Static assets

## Key Features Implementation

### Prompt Evaluation

The prompt evaluation feature analyzes user prompts based on several criteria:
- Tone/Persona
- Task Clarity
- Format & Output Specification
- Context & Background

The application then provides a detailed analysis with suggestions for improvement.

### Prompt Execution

The prompt execution feature sends the user's prompt to an AI model and displays the response, allowing users to:
- Test their prompts with real AI models
- Compare different versions of prompts
- Save successful prompts for future use

### My Prompts Management

Users can:
- Save prompts with versions
- Organize prompts by categories
- Mark favorites for quick access
- Track prompt performance and history

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Next.js team for the amazing framework
- Supabase for authentication and database solutions
- The developers of all the libraries used in this project 