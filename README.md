To use this microservice, your program must be able to connect to RabbitMQ

This is language dependent so it is asssumed that the user already has RabbitMQ installed and they have followed the tutorials on the website that allows them to connect to RabbitMQ

for the client to properly interact with the server, it must be able to both produce messages and consume messaged. 

Currently, there is a specific schema that this program allows. ALL data beign stored must follow this schema:
{
  rank: { type: Number, required: true },
  playerID: { type: Number, required: true },
  playerName: { type: String, required: true },
  position: { type: String, required: true },
  year: { type: Number, required: true }
}


In order to save entries in the database the data must be in a JavScript Object Notation as seen below:
    playerData ={
            "rank": 3,   
            "playerID": 2121,
            "playerName": "Aaron Rodgers",
            "position": "QB",
            "year": 2008
            }

In adition to this format. Player Data must be sent as a string.
An example of sending data in javascript can be seen below:

    let playerData ={
            "rank": 3,   
            "playerID": 2121,
            "playerName": "Aaron Rodgers",
            "position": "QB",
            "year": 2008
            }

    channel.sendToQueue('rpc_queue',
            Buffer.from(Buffer.from(JSON.stringify(playerData))),{
            correlationId: correlationId,
            replyTo: q.queue });

When the data is stored in the database it will respond with a message confirming that the save was successful.



In adition to this format. Player Data must be sent as a string.
An example of sending data in javascript can be seen below:

    channel.sendToQueue('rpc_queue',
            Buffer.from(Buffer.from(JSON.stringify(playerData))),{
            correlationId: correlationId,
            replyTo: q.queue });

When the data is stored in the database it will respond with a message confirming that the save was successful.

If you want to retrieve data from the database. Simply send the ID number of the Player who's data/rank you wish to see.
for example:

    let playerData = 1234

      channel.sendToQueue('rpc_queue',
        Buffer.from(Buffer.from(JSON.stringify(playerData))),{
          correlationId: correlationId,
          replyTo: q.queue });

This will signal the server to pull from the database and send a message back to the client containing player data/ranks in a stringified
JavScript Object Notation

Sequence Diagram:

![Alt text](./UML.png?raw=true "UML Sequence")


Data Flow:

![Alt text](./umldiagram.png?raw=true "UML")



