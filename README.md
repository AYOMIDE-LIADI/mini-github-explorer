# Mini GitHub Explorer

A simple Next.js + TypeScript app that lets users search GitHub profiles and view their latest repositories.

## Features

- Sign in with Google or GitHub
- Search GitHub users by username
- View user profile info: avatar, name, bio, followers, repos
- View latest 5 repositories with stars and last updated date
- Dark/Light mode toggle
- Fully responsive design

## Installation

Clone the repo:

```bash
git clone https://github.com/AYOMIDE-LIADI/mini-github-explorer.git
cd mini-github-explorer

#install depensencies

npm install

#start server

npm run dev


## Environment Variables

Create a `.env.local` file:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=any-random-string
GITHUB_ID=your_github_client_id
GITHUB_SECRET=your_github_client_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret


Replace your google_client_id / your_google_client_secret with credentials from your Google OAuth app.

Replace your github_id / your github_secret with credentials from your GitHub OAuth app.

Replace your NEXTAUTH_SECRET with a random string 


#Usage

Sign in using Google or GitHub

Search for any GitHub username

Explore the user’s profile and latest repositories

Toggle between dark and light mode using the top-right icon

