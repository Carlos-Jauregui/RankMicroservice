var amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', function(error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function(error1, channel) {
    if (error1) {
      throw error1;
    }
    channel.assertQueue('', {
      durable: false
    }, function(error2, q) {
      if (error2) {
        throw error2;
      }
      var correlationId = generateUuid();
      console.log(' [x] Requesting Greeting');

      channel.consume(q.queue, function(msg) {
        if (msg.properties.correlationId == correlationId) {
          console.log(' [.]', msg.content.toString());
          setTimeout(function() {
            connection.close();
            process.exit(0)
          }, 500);
        }
      }, {
        noAck: true
      });
    
      

    

    
    
   

    /*
      let playerData = {
        "rank": 3,   
        "playerID": 2121,
        "playerName": "Aaron Rodgers",
        "position": "QB",
        "year": 2008
    }
    

    let playerData = 1234
    */ 
      channel.sendToQueue('rpc_queue',
        Buffer.from(Buffer.from(JSON.stringify(playerData))),{
          correlationId: correlationId,
          replyTo: q.queue });
    });
  });
});

function generateUuid() {
  return Math.random().toString() +
         Math.random().toString() +
         Math.random().toString();
}