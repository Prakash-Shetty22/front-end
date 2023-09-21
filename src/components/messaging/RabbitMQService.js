// import Stomp from 'stompjs';

// export function connectToRabbitMQ() {
//     const socket = new WebSocket('ws://localhost:15674/ws');
//     const client = Stomp.over(socket);

//     client.connect('guest', 'guest', () => {
//         console.log('Connected to RabbitMQ');
        
//         // Subscribe to the relevant queue
//         client.subscribe('/queue/admins_queue', (message) => {
//             const body = JSON.parse(message.body);
//             // Handle received message
//             console.log('Received message:', body);
//         });
//     });
// }

// export function sendMessage(message) {
//     client.send('/exchange/admins-exchange', {}, JSON.stringify(message));
// }
