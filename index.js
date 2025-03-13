require('dotenv').config();
const { 
    Client, 
    GatewayIntentBits, 
    ActionRowBuilder, 
    ButtonBuilder, 
    ButtonStyle, 
    ModalBuilder, 
    TextInputBuilder, 
    TextInputStyle, 
    InteractionType
} = require('discord.js');
const axios = require('axios');

// Initialize Discord Client
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]
});

// OpenCX API Configuration
const OPEN_CX_API_BASE_URL = 'https://api.open.cx';
const OPEN_CX_API_KEY = process.env.OPEN_CX_API_KEY;


// Function to create a contact
async function createContact(email) {
    try {
        const response = await axios.post(`${OPEN_CX_API_BASE_URL}/contacts`, {
           "contact": {
            "email": email,
            "phone": "",
            "name": "",
            "custom_data": {}
        }
        }, {
            headers: {
                Authorization: `Bearer ${OPEN_CX_API_KEY}`,
                'Content-Type': 'application/json',
            },
        });

        return response.data.id; // Return the contact ID
    } catch (error) {
        console.error('Error creating contact:', error.response ? error.response.data : error.message);
        throw new Error('Failed to create contact.');
    }
}

// Function to create a chat session
async function createChatSession() {
    try {
        
        const response = await axios.post(`${OPEN_CX_API_BASE_URL}/chat/sessions`, {
            //contact_id: contact_id,
            channel: {
                type:"email"
            }
        }, {
            headers: {
                Authorization: `Bearer ${OPEN_CX_API_KEY}`,
                'Content-Type': 'application/json',
            },
        });

        return response.data.id; // Extract session ID correctly
    } catch (error) {
        console.error('Error creating chat session:', error);
        throw new Error('Failed to create chat session.');
    }
}

// Function to send a chat message with user email
async function sendChatMessage(sessionId, message, email) {
    try {
        const response = await axios.post(`${OPEN_CX_API_BASE_URL}/chat/sessions/${sessionId}/send`, {
            sender: "contact",
            message: {
                type: "text",
                text: message
            },
            contact:{
                email:email
            }
        }, {
            headers: {
                Authorization: `Bearer ${OPEN_CX_API_KEY}`,
                'Content-Type': 'application/json',
            },
        });

        return response.data;
    } catch (error) {
        console.error('Error sending chat message:', error.response ? error.response.data : error.message);
        throw new Error('Failed to send chat message.');
    }
}

// When the bot is ready
client.once('ready', async () => {
    console.log(`✅ Logged in as ${client.user.tag}!`);

    // Send the support message to a specific channel
    const channelId = '1310969905910386788'; // Replace with actual Discord channel ID
    const channel = await client.channels.fetch(channelId);

    if (channel) {
        // Create an embedded message
        const embed = {
            color: 0xFF5733, // Red/Orange border
            title: '**Need urgent support?**',
            description: '💬 **Our customer support team is available 24/7 to assist you.**\n\n' +
                         '👇 **Click the button below to start a chat with our team!** 👇',
            thumbnail: {
                url: 'https://your-image-url.com/support-icon.png' // Replace with actual image URL
            },
            footer: {
                text: 'We are here to help!',
                icon_url: 'https://your-image-url.com/footer-icon.png' // Replace with actual image URL
            }
        };

        // Create a button for starting a chat
        const chatButton = new ButtonBuilder()
            .setCustomId('start_chat')
            .setLabel('📧 Send your message')
            .setStyle(ButtonStyle.Primary);

        const row = new ActionRowBuilder().addComponents(chatButton);

        await channel.send({
            embeds: [embed],
            components: [row]
        });
    }
});

// Handle button clicks
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isButton()) return;

    if (interaction.customId === 'start_chat') {
        // Create a single modal for email and message input
        const modal = new ModalBuilder()
            .setCustomId('chat_form')
            .setTitle('Start a Support Chat');

        const emailInput = new TextInputBuilder()
            .setCustomId('user_email')
            .setLabel('Your Email Address')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('Enter your email...')
            .setRequired(true);

        const messageInput = new TextInputBuilder()
            .setCustomId('chat_message')
            .setLabel('Your Message')
            .setStyle(TextInputStyle.Paragraph)
            .setPlaceholder('Enter your message here...')
            .setRequired(true);

        const emailRow = new ActionRowBuilder().addComponents(emailInput);
        const messageRow = new ActionRowBuilder().addComponents(messageInput);
        modal.addComponents(emailRow, messageRow);

        await interaction.showModal(modal).catch(err => console.error("Modal Error:", err));
    }
});

// Handle modal submission (chat_form)
client.on('interactionCreate', async (interaction) => {
    if (interaction.type !== InteractionType.ModalSubmit) return;
    if (interaction.customId !== 'chat_form') return;

    const email = interaction.fields.getTextInputValue('user_email');
    const message = interaction.fields.getTextInputValue('chat_message');

    try {
        // **ACKNOWLEDGE THE INTERACTION IMMEDIATELY**
        await interaction.deferReply({ ephemeral: true });

        // Get contact id 
        // const contact_id = await createContact(email); I will disable first 

       

        // Create chat session
        const sessionId = await createChatSession();

        // Send chat message with email
        await sendChatMessage(sessionId, message, email);

        // Send final response
        await interaction.followUp({ content: `✅ Your message has been sent successfully!`, ephemeral: true });
    } catch (error) {
        await interaction.followUp({ content: `❌ Failed to send message: ${error.message}`, ephemeral: true });
    }
});

// Log in the bot
client.login(process.env.DISCORD_BOT_TOKEN);
