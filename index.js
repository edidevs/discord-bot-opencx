require('dotenv').config();
const { Client, GatewayIntentBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
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
const OPEN_CX_API_BASE_URL = 'https://api.open.cx/email';
const OPEN_CX_API_KEY = process.env.OPEN_CX_API_KEY;
const FROM_EMAIL = process.env.FROM_EMAIL;

// Function to send email using OpenCX
async function sendEmail(toEmail, subject, body) {
    try {
        const response = await axios.post(OPEN_CX_API_BASE_URL, {
            from_email: FROM_EMAIL,
            recipients: [
                {
                    to_email: toEmail,
                    email_subject: subject,
                    email_body: body,
                    // email_sender_name: 'Name or Company',
                    email_is_transactional: true
                }
            ]
        }, {
            headers: {
                Authorization: `Bearer ${OPEN_CX_API_KEY}`,
                'Content-Type': 'application/json',
            },
        });

        return response.data;
    } catch (error) {
        console.error('Error sending email:', error.response ? error.response.data : error.message);
        throw new Error('Failed to send email.');
    }
}

// When the bot is ready
client.once('ready', async () => {
    console.log(`✅ Logged in as ${client.user.tag}!`);

    // Send the support message to a specific channel
    const channelId = '1310971036526706772'; // Replace with actual Discord channel ID
    const channel = await client.channels.fetch(channelId);

    if (channel) {
        // Create an embedded message
        const embed = {
            color: 0xFF5733, // Red/Orange border
            title: '**Need urgent support?**',
            description: '💥 **Our customer support team works 24/7** to fulfill your needs or help you overcome issues.\n\n' +
                         '👇 **Click the button below to send us an email** 👇',
            thumbnail: {
                url: 'https://your-image-url.com/support-icon.png' // Replace with actual image URL
            },
            footer: {
                text: 'We are here to help!',
                icon_url: 'https://your-image-url.com/footer-icon.png' // Replace with actual image URL
            }
        };

        // Create a button for sending an email
        const emailButton = new ButtonBuilder()
            .setCustomId('send_email')
            .setLabel('📧 Send an Email')
            .setStyle(ButtonStyle.Primary);

        const row = new ActionRowBuilder().addComponents(emailButton);

        await channel.send({
            embeds: [embed],
            components: [row]
        });
    }
});

// Handle button clicks
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isButton()) return;

    if (interaction.customId === 'send_email') {
        // Show input modal for email details
        const modal = new ModalBuilder()
            .setCustomId('email_form')
            .setTitle('Compose Your Email');

        const toEmailInput = new TextInputBuilder()
            .setCustomId('to_email')
            .setLabel('Recipient Email Address')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('recipient@example.com')
            .setRequired(true);

        const subjectInput = new TextInputBuilder()
            .setCustomId('email_subject')
            .setLabel('Email Subject')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('Enter subject here...')
            .setRequired(true);

        const bodyInput = new TextInputBuilder()
            .setCustomId('email_body')
            .setLabel('Email Content')
            .setStyle(TextInputStyle.Paragraph)
            .setPlaceholder('Enter your message here...')
            .setRequired(true);

        const firstRow = new ActionRowBuilder().addComponents(toEmailInput);
        const secondRow = new ActionRowBuilder().addComponents(subjectInput);
        const thirdRow = new ActionRowBuilder().addComponents(bodyInput);

        modal.addComponents(firstRow, secondRow, thirdRow);

        await interaction.showModal(modal);
    }
});

// Handle email modal submission
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isModalSubmit()) return;

    if (interaction.customId === 'email_form') {
        const toEmail = interaction.fields.getTextInputValue('to_email');
        const subject = interaction.fields.getTextInputValue('email_subject');
        const body = interaction.fields.getTextInputValue('email_body');

        try {
            await sendEmail(toEmail, subject, body);
            await interaction.reply(`✅ Email sent successfully to **${toEmail}**!`);
        } catch (error) {
            await interaction.reply(`❌ Failed to send email: ${error.message}`);
        }
    }
});

// Log in the bot
client.login(process.env.DISCORD_BOT_TOKEN);
