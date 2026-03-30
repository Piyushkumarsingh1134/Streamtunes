# Streamtunes

Streamtunes is a platform designed for creators to interact with their audience through music. It allows viewers to vote on what songs should play next during a live stream, making the experience more engaging for everyone involved.

## Features

- Fan Interaction: Let your audience have a say in the music choice.
- Platform Support: Works with major services like Twitch, YouTube, and Spotify.
- Real-time Updates: The queue updates instantly as fans vote.

## Screenshots

### Application Landing Page
![Landing Page](./public/screenshots/landing.png)

### User Dashboard (After Sign In)
![Dashboard Page](./public/screenshots/dashboard.png)

### Video Queue and Voting
The dashboard allows creators to manage their stream's music queue effectively. Fans can see what's playing and vote for the next tracks.

![Queue Management](./public/screenshots/dashboard_queue.png)

## Getting Started

### Prerequisites

You will need the following installed:
- Node.js
- PostgreSQL database

### Installation and Setup

1. Clone the repository to your local machine:
   ```bash
   git clone https://github.com/Piyushkumarsingh1134/Streamtunes.git
   ```

2. Install the necessary dependencies:
   ```bash
   npm install
   ```

3. Configure your environment variables. Create a .env file and include the following:
   ```env
   GOOGLE_CLIENT_ID=your_id
   GOOGLE_CLIENT_SECRET=your_secret
   DATABASE_URL="postgresql://user:password@localhost:5432/db"
   NEXTAUTH_SECRET="your_secret"
   ```

4. Set up the database schema using Prisma:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. Run the application in development mode:
   ```bash
   npm run dev
   ```

The application will be available at http://localhost:3000.

## Contributions

If you would like to contribute to the project, feel free to open a pull request or report any issues you find.

This project was built using Next.js and Prisma.
