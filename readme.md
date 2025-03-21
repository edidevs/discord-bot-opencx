# Discord Bot Opencx CS Support Setup & Running with PM2

This guide explains how to **create, set up, install dependencies, and run** the **Discord bot integration with opencx** using **Node.js v18.20.7** and **PM2** for persistent execution.

---

## Prerequisites
Before starting, ensure you have the following installed:  
**Node.js v18.20.7** ([Download Node.js](https://nodejs.org))  
**npm (Node Package Manager)** (comes with Node.js)  
**PM2 Process Manager**  

Also, make sure to have:
- A Discord account
- A Discord server where you have permission to add bots
- Access to the Discord Developer Portal

---

## Creating the Discord Bot

### Step-by-step Guide:

1. **Navigate to the [Discord Developer Portal](https://discord.com/developers/applications)**.
2. **Click "New Application"** and give your bot a name (e.g., Opencx CS Bot).
3. After creating the application, navigate to the **Bot** tab and click **"Add Bot"**.
4. Under the Bot page, click **"Reset Token"** to generate your bot's token (save this safely).
5. **Enable the necessary bot permissions**:
   - MESSAGE CONTENT INTENT
   - SERVER MEMBERS INTENT
   - PRESENCE INTENT (optional)
6. Navigate to the **OAuth2 > URL Generator** page:
   - Check the "bot" scope.
   - Select the appropriate permissions for your bot.
   - Copy the generated URL and paste it into your browser to invite the bot to your server.

---

## Set Up Your Bot Locally

### Clone or download the repository:
```sh
git clone <repository-url>
```

### Configure environment variables:

Create a `.env` file in the project root directory and add your Discord bot token:

```sh
DISCORD_TOKEN=your-discord-bot-token
```

---

## Install Dependencies
Navigate to your bot folder and install required dependencies:
```sh
npm install
```

This installs the required packages from `package.json`:
- `discord.js`
- `dotenv`
- `axios`

---

## Running the Bot with PM2

PM2 ensures the bot **runs persistently** and restarts if it crashes.

### Start the Bot with PM2
```sh
npm install -g pm2  # Install PM2 globally if not already installed
pm2 start index.js --name discord-bot-opencx
```

### Save PM2 Process (Auto-Restart on Reboot)
```sh
pm2 save
pm2 startup
```

### Check Bot Logs
To monitor logs in real-time:
```sh
pm2 logs discord-bot-opencx 
```

---

## Managing the Bot
Use the following PM2 commands to manage the bot:

| Command | Description |
|---------|-------------|
| `pm2 list` | Shows all running processes |
| `pm2 restart discord-bot-opencx` | Restarts the bot |
| `pm2 stop discord-bot-opencx` | Stops the bot |
| `pm2 delete discord-bot-opencx` | Removes the bot from PM2 |

---

## Stopping and Removing PM2
If you want to stop PM2 completely:
```sh
pm2 stop all
pm2 delete all
```

---

## Summary
- **Use Node.js v18.20.7** for compatibility.
- **Create your bot on Discord Developer Portal** and get the bot token.
- **Configure your bot locally** with the token.
- **Run `npm install`** to install dependencies.
- **Start the bot using PM2** for persistence.
- **Monitor logs & restart the bot easily** with PM2 commands.

