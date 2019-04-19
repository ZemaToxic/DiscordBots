module.exports = {
    name: " ",
    description: " ",
    execute(client, options, message, args) {
        // Do command stuff here
    }
};
/*

if (command === "updateUsers") {
   //console.log(client.users);
   if (message.author.id === '171234951566589954') {

       // Get rid of clyde bot
       var userArray = client.users;
       userArray.delete('1');

       userArray.forEach(function (k, v) {
           var userID = k['id'];

           message.guild.member(userID).addRole('442136610218180609')
               .then(console.log)
               .catch(console.error);

           sleep(50);

       });
   }
}



_getRequest (path) {
    path = encodeURI(this._apiRoute + path)
    return new Promise((resolve, reject) =>
      https.get({ host: this._host, path }, (results) => {
        const chunks = []
        results
          .on('data', (chunk) => chunks.push(chunk))
          .on('end', () => {
            const json = JSON.parse(Buffer.concat(chunks))
            results.statusCode === 200
              ? resolve(json)
              : reject(json)
          })
      }).on('error', reject)
    )
    }
*/