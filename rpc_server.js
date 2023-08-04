

const express = require('express');
const mongoose = require('mongoose')
const amqp = require('amqplib/callback_api');
const env = require('dotenv/config')
const app = express();

console.log(process.env.MONGODB_CONNECT_STRING)

mongoose.connect(
  process.env.MONGODB_CONNECT_STRING,
  { useNewUrlParser: true }
);

// Connect to to the database
const db = mongoose.connection;

const playerRankSchema = mongoose.Schema({
  rank: { type: Number, required: true },
  playerID: { type: Number, required: true },
  playerName: { type: String, required: true },
  position: { type: String, required: true },
  year: { type: Number, required: true }
});

const Player = mongoose.model("Player", playerRankSchema);





amqp.connect('amqp://localhost', function(error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function(error1, channel) {
    if (error1) {
      throw error1;
    }
    var queue = 'rpc_queue';

    channel.assertQueue(queue, {
      durable: false
    });
    channel.prefetch(1);
    console.log(' [x] Awaiting RPC requests');
    channel.consume(queue, function reply(msg) {
      var n = msg.content.toString();
      
      if (!isNaN(n)){
        (async () => {
          try {
            const player = await Player.find({ playerID: n });
            console.log(player);
            channel.sendToQueue(msg.properties.replyTo,
              Buffer.from(player.toString()), {
                correlationId: msg.properties.correlationId
              });
          } catch (error) {
            console.error(error);
            // Handle the error appropriately, e.g., sending an error response to the client.
          }
        })();
          channel.ack(msg);
      } else {

        n = JSON.parse(n)
        let player = new Player ({
          rank: n.rank, 
          playerID: n.playerID,
          playerName: n.playerName,
          position: n.position,
          year: n.year
        })
        console.log(n.playerName)
        console.log(player)
        player.save()
        const successString = 'Ranking has been saved' 
        channel.sendToQueue(msg.properties.replyTo,
          Buffer.from(successString), {
            correlationId: msg.properties.correlationId
          });
        channel.ack(msg);
      }

    });
  });
});