const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const botConfig = require('../botConfig.json') // Used to import the required C.AI tokens.

// Define the C.AI module
const CharacterAI = require('node_characterai');
const characterAI = new CharacterAI();

module.exports = {

    data: new SlashCommandBuilder() // The slashCommandBuilder feature from Discord.JS, the lines below are to set data for discord to handle (Name, Desc, options, etc.)
        .setName('imagecreator') 
        .setDescription('Создает изображение на основе вашего запроса')
        .addStringOption(option =>
            option.setName('prompt')
                .setDescription('Опишите изображение, которое вы хотите создать.')
                .setRequired(true)
            ),

    async execute(client, interaction) {
        const prompt = interaction.options.getString('prompt') // Receive the user input
        if (!prompt) return interaction.reply({ content: `Запрос не был отправлен.`, ephemeral: true }) // If there's no prompt, stop the command and reply to the user.

        interaction.reply({ content: `Пожалуйста, подождите, изображение создается..` }) // Wait message (Discord automatically stops interactions that take too long to reply, this way we avoid that issue)
        // Feel free to change this message to whatever you like, could be an image, embed, different text, etc.

        async function imageCreator(prompt) {
            try {
                if (!characterAI.isAuthenticated()) { // Check if the connection is already up
                    await characterAI.authenticateWithToken(botConfig.authToken); // If the connection isn't up, then open the connection with the auth data.
                    // Image generation requires you to be Authenticated, auth as a quest won't work here
                }
        
                const chat = await characterAI.createOrContinueChat(botConfig.characterID);
                const response = await chat.generateImage(prompt);
        
                return response;
            } catch (error) {
                if (error.message.includes("Не удалось создать изображение")) {
                    // Handle the specific error case when image generation fails, feel free to add console.log() here if you want to log this event
                    return response = null
                } else {
                    // Handle other potential errors, feel free to add console.log() here if you want to log this event
                    return response = null
                }
            }
        }

        let response = await imageCreator(prompt)
        if (!response) return interaction.editReply(`Не удалось сгенерировать ваш запрос.`) // IMG generation failure is most likely due to prompts being too nsfw for C.AI. (Nudity, Inappropriate or Gore)

        let imageEmbed = new EmbedBuilder() // Create a Discord embed with the following data:
            .setTitle(`AI генератор изображений`)
            .setDescription(`Запрос: ${prompt}`)
            .setColor(`Зелёный`)
            .setImage(response)
            .setFooter({ text: `Генерация изображений - это экспериментальная функция.` }) // Change the footer to whatever you like

        return interaction.editReply({ content: ``, embeds: [imageEmbed] }) // The last step! Updating the message with the embed (the content: `` line makes sure the msg text is removed.)
    },
}