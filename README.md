
# 🚀 Apple's Bot

## 🛠️ Installation

Follow these steps to set up and run Apple's Bot for your project:

1. Create a `.env` file in your project's root directory.

   ```env
   TOKEN = your_application_token
   CLIENT_ID = your_bot_id
   GUILD_ID = testing_server_id
   NODE_ENV = development
   INDEX_FILE_FOLDER = src
   ```

   Make sure to replace the placeholder values with your actual application token, bot id, and testing server id.

2. Save the `.env` file.

3. Install the project dependencies using the following commands:

   ```bash
   npm i
   ```

4. To run the project in development mode, use:

   ```bash
   npm run dev
   ```

   This command sets the `NODE_ENV` to `development` and uses the `src` folder as the index file location.

5. If you want to build the project for production, update the `.env` file as follows:

   ```env
   NODE_ENV = production
   INDEX_FILE_FOLDER = dist
   ```

   Save the changes.

6. Execute the following commands to build and start the production version:

   ```bash
   npm run build
   npm run start
   ```

Your bot is now configured and ready to launch! 🚀

## ⚙️ Command Creation

To create a new command for your bot, follow these steps:

1. Navigate to the `/src/commands` directory in your project.

2. Create a new TypeScript file with the name of your command. The file should follow the naming convention `commandname.ts` (all lowercase). Replace "commandname" with the actual name of your command.

3. Inside the TypeScript file, define and export your command using the Discord.js slash command structure. Here's an example template:

   ```typescript
    import { SlashCommandBuilder, Client, CommandInteraction } from 'discord.js'

    export default {
        slashCommand: new SlashCommandBuilder()
            .setName('commandname')
            .setDescription('generic description.')
        ,
        callback: async(client: Client, interaction: CommandInteraction) => {
            try {
                await interaction.deferReply()
                await interaction.editReply('hello')
            } catch (error) {
                console.error('Error in "commandname.ts": ' + error)
            }
        }
    }

Customize the `setName` and `setDescription` fields according to your command.

1. Save the file.

2. Your commands are automatically registered and executed. No additional steps are needed in the main index file.

3. Restart your bot to apply the changes.
