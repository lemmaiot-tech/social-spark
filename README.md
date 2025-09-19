<div align="center">
  <img width="1200" height="475" alt="Social Spark Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Social Spark — AI social content studio

Social Spark is a lightweight React + Vite app that generates social media posts, captions, and content ideas using generative AI. It's built as part of the LemmaIoT Cloud suite — a set of cloud services and developer tools from LemmaIoT (https://lemmaiot.com.ng) — and can be deployed standalone or integrated into LemmaIoT projects.

Key benefits
- Generate platform-optimized posts for Twitter, LinkedIn, Facebook, Instagram, TikTok, and more.
- Speed up content planning with topic-based idea generation, scheduling, and saved drafts.
- Lightweight: built with React + Vite for fast local development and easy deployment.
- Extensible: local service wrapper around an LLM (Gemini/OpenAI compatible) so you can swap or extend providers.

Features
- Topic-driven prompt builder and reusable templates (see `components/TopicInput.tsx` and `components/HandleInput.tsx`).
- Multi-platform output and platform selector UI (`components/PlatformSelector.tsx`).
- Schedule posts and save drafts (`components/SchedulePostModal.tsx`, `components/SavedPosts.tsx`).
- Built-in results preview, download, and copy actions (`components/ResultsDisplay.tsx`).
- Theme toggle, undo toast, and small UX niceties for polished interactions.

Quick start (local)

Prerequisites: Node.js (16+), an LLM API key (Gemini/OpenAI compatible)

1. Install dependencies

   ```powershell
   npm install
   ```

2. Configure environment

   - Create a `.env.local` file at the project root (do not commit it).
   - Add your LLM API key as `GEMINI_API_KEY` or the provider-specific key your deployment uses.

   Example `.env.local`:

   ```text
   GEMINI_API_KEY=your_api_key_here
   ```

3. Run the app in development

   ```powershell
   npm run dev
   ```

4. Build for production

   ```powershell
   npm run build; npm run preview
   ```

Configuration and services
- The UI interacts with a small service wrapper that calls the LLM (see `services/geminiService.ts`). You can replace or extend this file to integrate other providers or route requests through LemmaIoT Cloud services.
- When deploying to LemmaIoT Cloud, route LLM requests through your LemmaIoT-managed API gateway so secrets and usage can be centrally controlled.

Security
- Never commit `.env.local` or API keys to source control. Use environment secrets when deploying to LemmaIoT Cloud.

Project structure (high level)
- `components/` - React UI components used by the app.
- `services/` - LLM service wrapper.
- `package.json` - scripts: `dev`, `build`, `preview`.

Contributing
- Fork the repo and open a PR. If you add a new provider or integration with LemmaIoT Cloud, include tests and documentation.

About LemmaIoT Cloud

This project is a product of LemmaIoT Cloud (https://lemmaiot.com.ng). LemmaIoT Cloud provides managed IoT and cloud services, developer tools, and integrations to help teams build and operate intelligent connected applications. Social Spark demonstrates how LemmaIoT tooling can be used to build AI-powered developer-facing apps and internal tools while keeping keys and operational concerns managed centrally.

License
- Check the project root for licensing information. If you plan to redistribute, confirm licensing and third-party library terms.

Questions or help
- For assistance integrating with LemmaIoT Cloud or deploying to your LemmaIoT account, contact LemmaIoT support via https://lemmaiot.com.ng.
