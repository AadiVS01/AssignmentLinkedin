# Full-Stack Social Feed Application

This is a complete full-stack web application built with **Next.js**, featuring user authentication, a public post feed, user profiles, and post creation. It serves as a robust foundation for a modern social media platform.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
- [Deployment](#deployment)

---

## Features

- ✅ **User Authentication**: Secure sign-up and sign-in functionality using NextAuth.js
- 📰 **Public Feed**: A homepage that displays all user posts in reverse chronological order
- 📝 **Post Creation**: Authenticated users can create new posts with a title and content
- 👤 **Dynamic User Profiles**: View user profiles and the posts they have created
- 🔁 **Full-Stack Architecture**: Utilizes Next.js App Router for both front-end UI and back-end API routes
- 🗃️ **Database Integration**: Uses Prisma as an ORM to interact with a PostgreSQL database

---

## Tech Stack

| Feature        | Tech Stack                                |
|----------------|--------------------------------------------|
| Framework      | [Next.js (App Router)](https://nextjs.org) |
| Language       | TypeScript                                 |
| Authentication | [NextAuth.js](https://next-auth.js.org)    |
| ORM            | [Prisma](https://www.prisma.io)            |
| Database       | PostgreSQL                                 |
| Styling        | [Tailwind CSS](https://tailwindcss.com)    |
| Package Manager| pnpm                                       |

---


---

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing.

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or later)
- [pnpm](https://pnpm.io/)
- [Git](https://git-scm.com/)
- A running PostgreSQL database instance

---

### Installation

Clone the repository:

```bash
git clone https://github.com/AadiVS01/AssignmentLinkedin.git
cd AssignmentLinkedin
pnpm install
cp .env.example .env
pnpm prisma migrate dev
pnpm dev
```


Now open http://localhost:3000 in your browser.

Environment Variables
Your .env file must contain the following variables:

# PostgreSQL connection string
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"

# Application URL (for NextAuth redirects)
NEXTAUTH_URL="http://localhost:3000"

# Secret for securing JWT tokens
NEXTAUTH_SECRET="your_secret_here"


---

🔐 You can generate a strong NEXTAUTH_SECRET using:
```bash
openssl rand -base64 32
```
--- 


# Deployment
The recommended deployment platform is Vercel, the creators of Next.js.

Steps to Deploy:
Push your code to GitHub, GitLab, or Bitbucket

Import the project into Vercel

Set the environment variables in Vercel Project Settings

Vercel will:

Build and deploy your app automatically

Run prisma generate during build



