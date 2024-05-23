const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const botConfig = require('../botConfig.json')
const CharacterAI = require('node_characterai');
const characterAI = new CharacterAI();

module.exports = {

    data: new SlashCommandBuilder() // The slashCommandBuilder feature from Discord.JS, the lines below are to set data for discord to handle (Name, Desc, options, etc.)
        .setName('clearchat')
        .setDescription('Сохраняет и начинает новый чат с вашим персонажем.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels), // User needs the manage channels permission to be able to use this command

    async execute(client, interaction) {
 
        try {

            if (!characterAI.isAuthenticated()) { // Check if connection is up and authenticated
                await characterAI.authenticateWithToken(botConfig.authToken); // If the connection isn't up, the start the connection and authenticate it
            }

            // Get the chat from the character
            const chat = await characterAI.createOrContinueChat(botConfig.characterID);
            chat.saveAndStartNewChat() // Start a new chat.

            return interaction.reply("AI чат был удален!") // Return feedback to the user

        } catch (error) { // If something goes wrong:
            return interaction.reply("Что-то пошло не так, чат не был очищен.") // Return feedback to the user
        }
    }
}