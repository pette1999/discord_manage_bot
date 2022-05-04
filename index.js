require('module-alias/register')

// const Discord = require('discord.js')
// const client = new Discord.Client()

const { MongoClient } = require('mongodb')
const MongoDBProvider = require('commando-provider-mongo')
const path = require('path')
const Commando = require('discord.js-commando')

const config = require('@root/config.json')
const { loadLanguages } = require('@util/language')
const loadFeatures = require('@root/features/load-features')

const client = new Commando.CommandoClient({
    owner: '594946541387513858',
    commandPrefix: config.prefix,
})

client.setProvider(
    MongoClient.connect(config.mongoPath, {
        useUnifiedTopology: true,
    })
    .then((client) => {
        return new MongoDBProvider(client, 'haichen')
    })
    .catch((err) => {
        console.error(err)
    })
)

client.on('ready', async() => {
    console.log('The client is ready!')

    client.registry
        .registerGroups([
            ['misc', 'misc commands'],
            ['moderation', 'moderation commands'],
            ['economy', 'Commands for the economy system'],
            ['games', 'Commands to handle games'],
        ])
        .registerDefaults()
        .registerCommandsIn(path.join(__dirname, 'cmds'))

    loadFeatures(client)
})

client.login(config.token)