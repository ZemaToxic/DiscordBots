
// If the message is Quote.
if (command === "quote") {

    const splitMessage = message.content.split(' ')

    // If nothing apart form ~quote then return a random Quote.
    if (splitMessage.length == 1) {

        var RandomQuote = Math.floor(Math.random() * quote.length) + 1

        message.channel.send("Quote: " + RandomQuote + " -> " + quote[RandomQuote])
    }

    // Return what ever quote is asked for
    if (splitMessage.length == 2) {
        // second word is a number
        const quoteNumber = parseInt(splitMessage[1]) - 1

        if (quoteNumber >= 0) {
            if (quote.length > quoteNumber) {
                message.channel.send("[" + (quoteNumber + 1) + "/" + quote.length + "] " + quote[quoteNumber])
            } else {
                // If the number asked doesn't exist then error.
                message.channel.send("There is only " + quote.length + " quotes, choose a number from from 1 to " + quote.length + ".")
            }
        }
    }
    if (splitMessage.length < 3) {
        return
    }

    const subcommand = splitMessage[1]
    splitMessage.splice(0, 2)
    const sentence = splitMessage.join(' ')
    const quoteNumber = parseInt(splitMessage[0])

    console.log(quoteNumber)

    // ----------- Add -----------
    if (subcommand === 'add') {
        if (quote.indexOf(sentence) !== -1) {
            message.channel.send(sentence + " Is already a Quote.")
        } else {
            quote.push(sentence)
            saveQuotes(quote)
            message.channel.send(sentence + " Has been saved as !quote " + quote.length + ".")
        }
    }
    // ----------- Edit ----------
    if (subcommand === 'edit') {


        if (quote.indexOf(quoteNumber) !== -1) {
            quote.push(sentence)
            saveQuotes(quote)
            message.channel.send(sentence + " Has been saved.")
        } else {
            message.channel.send(sentence + " Is not a Quote.")

        }
    }
    // ----------- Delete --------
    else if (subcommand === 'del' || subcommand === 'delete' || subcommand === 'remove') {
        if (quote.indexOf(sentence) === -1) {
            message.channel.send(sentence + " Is not currently a Quote.")
        } else {
            quote.splice(quote.indexOf(sentence), 1)
            saveQuotes(quote)
            message.channel.send(sentence + " Has been deleted.")
        }
    }
}

if (command === "embed") {
    message.channel.send({
        embed: {
            color: 3447003,
            author: {
                name: client.user.username,
                icon_url: client.user.avatarURL
            },
            title: 'This is an embed',
            url: 'http://google.com',
            description: 'This is a test embed to showcase what they look like and what they can do.',
            fields: [{
                name: 'Fields',
                value: 'They can have different fields with small headlines.'
            },
            {
                name: 'Masked links',
                value: 'You can put [masked links](http://google.com) inside of rich embeds.'
            },
            {
                name: 'Markdown',
                value: 'You can put all the *usual* **__Markdown__** inside of them.'
            }
            ],
            timestamp: new Date(),
            footer: {
                icon_url: client.user.avatarURL,
                text: '© Example'
            }
        }
    });
}