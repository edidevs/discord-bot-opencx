# Discord Bot Opencx CS Support Setup & Running with PM2

This guide explains how to **set up, install dependencies, and run** the **Discord bot integration with opencx** using **Node.js v18.20.7** and **PM2** for persistent execution.

---

## **1️⃣ Prerequisites**
Before starting, ensure you have the following installed:  
**Node.js v18.20.7** ([Download Node.js](https://nodejs.org))  
**npm (Node Package Manager)** (comes with Node.js)  
**PM2 Process Manager**  

---

## **2️ Install Dependencies**
After cloning/downloading the bot, navigate to its folder and install required dependencies:
```sh
npm install
```
This installs the required packages from `package.json`:
- `discord.js`
- `dotenv`
- `axios`


---

## **3️⃣ Install and Running the Bot with PM2**

PM2 ensures that the bot **runs persistently** and restarts if it crashes.

### ** Start the Bot with PM2**
```sh
npm install -g pm2  # Install PM2 globally if not already installed
pm2 start index.js --name discord-bot-opencx
```
This starts the bot and assigns it the name `discord-bot` in PM2.

### ** Save PM2 Process (Auto-Restart on Reboot)**
```sh
pm2 save
pm2 startup
```

### ** Check Bot Logs**
To monitor logs in real-time:
```sh
pm2 logs discord-bot-opencx 
```

---

## **4️⃣ Managing the Bot**
Use the following PM2 commands to manage the bot:

| Command | Description |
|---------|-------------|
| `pm2 list` | Shows all running processes |
| `pm2 restart discord-bot-opencx` | Restarts the bot |
| `pm2 stop discord-bot-opencx` | Stops the bot |
| `pm2 delete discord-bot-opencx` | Removes the bot from PM2 |

---

## **5️⃣ Stopping and Removing PM2**
If you want to stop PM2 completely:
```sh
pm2 stop all
pm2 delete all
```

---

## **🎯 Summary**
**Use Node.js v18.20.7** for compatibility.  
**Run `npm install`** to install dependencies.  
**Start the bot using PM2** for persistence.  
**Monitor logs & restart the bot easily** with PM2 commands.  


