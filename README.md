# Postly

_Postly_ is a **mini social network web application** built with [Next.js](https://nextjs.org), designed to let users share posts, react, comment, and chat in real time. It integrates authentication and user profiles, uses [Supabase](https://supabase.com/) as its backend database and authentication provider, and delivers a modern interactive UX.

## 🚀 Live Demo

🌎 Visit the deployed app on Vercel: [https://postly-psi.vercel.app/](https://postly-psi.vercel.app/)

## Features

- **User Authentication:** Register, log in, and manage profiles via Supabase.
- **Public Feed:** View, create, and interact with posts.
- **Reactions:** Like or dislike posts and comments.
- **Comments:** Engage in discussions publicly within posts.
- **Chat:** Start private conversations with other users, real-time chat.
- **Profile Pages:** View and edit profiles, including avatar and bio.
- **Responsive Design:** Modern UI with Vercel’s Geist font, mobile-friendly layout.

## Getting Started

To set up Postly locally:

1. **Clone the repository**
    ```bash
    git clone https://github.com/mildoss/postly.git
    cd postly
    ```

2. **Install dependencies**
    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    # or
    bun install
    ```

3. **Set up environment variables**

    Create a `.env.local` file based on `.env.example`, and add your Supabase Project details:
    ```
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

4. **Run the development server**
    ```bash
    npm run dev
    # or
    yarn dev
    # or
    pnpm dev
    # or
    bun dev
    ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to get started.

## Project Structure

- `src/app/(main)/page.tsx` – Main feed, post creation, and listing.
- `src/app/(auth)/*` – Authentication layouts and pages.
- `src/components/posts/` – Post creation and feed components.
- `src/components/profile/` – Profile display and chat start.
- `src/components/chat/` – Real-time chat and messaging.
- `src/lib/` – Supabase integration and utilities.

## Technologies

- **Frontend:** Next.js, React
- **UI Design:** Tailwind CSS, Geist font, reusable custom components
- **Backend:** Supabase (auth, database, storage)
- **Deployment:** [Vercel](https://vercel.com/)

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Vercel Deployment Guide](https://vercel.com/docs/concepts/deployments)

## License

This project is licensed under the [MIT License](LICENSE).

---

**Maintainer:** [mildoss](https://github.com/mildoss)

```
