// import React, { useState } from "react";
// import { over } from 'sockjs';
// import SockJs from 'sockjs-client';

// //intializing Stomp Client to null. Once the user connects, this will have the value
// var stompClient = null;

// const ChatRoom = () => {

//     const [publicChats, setPublicChats] = useState([]);
//     const [privateChats, setPrivateChats] = useState(new Map());
//     const [tab, setTab] = useState("CHATROOM");

//     //this will holds the message details, connection details, and whether we are really connected to the server and all those things
//     const [userData, setUserData] = useState({
//         username: "",
//         receivername: "",
//         connected: false, //initially it'll be false
//         message: ""
//     })

//     const handleValue = (event) => {
//         const { value, name } = event.target;
//         setUserData({ ...userData, [name]: value });
//     }

//     const handleMessage = (event) => {
//         const { value } = event.target.value;
//         setUserData({ ...userData, "message": value });
//     }

//     const registerUser = () => {
//         //here we will create a new sockjs
//         //in this sockjs we need to give or url
//         //url is nothing but our server websocket url

//         //create a sock variable
//         let Sock = new SockJs("http://localhost:8086/ws");

//         stompClient = over(Sock);
//         stompClient.connect({}, onConnected, onError);
//     }

//     const onConnected = () => {
//         setUserData({ ...userData, "connected": true });

//         //whenever this "connected" is set to true, we will be getting rid of the registry screen and we'll be going to the chat box


//         //we need to subscribe to two different endpoints
//         //1. this user needs to listen to the chat room
//         //2. he needs to listen to himself

//         //stompClient.subscribe({topic_name},{callback_function})
//         //the callback_function receives the message
//         stompClient.subscribe('/chatroom/public', onPublicMessageReceived);
//         stompClient.subscribe('/user/' + userData.username + '/private', onPrivateMessageReceived);

//         userJoin();
//     }

//     const userJoin = () => {
//         if(stompClient) {
//             let chatMessage = {
//                 senderName: userData.username,
//                 status: "JOIN"
//             };

//             stompClient.send('/app/message',{},JSON.stringify(chatMessage));
//         }
//     }

//     const onPublicMessageReceived = (payload) => {
//         // we need to pass the payload body because a stomp message at the start adds its own header and all other details
//         let payloadData = JSON.parse(payload.body);

//         //simple switch condition to check what kind of message we are getting
//         switch (payloadData.status) { //this payloadData.status is nothing but the enum we are create in backend
//             case "JOIN":
//                 //check if the sender name is not present
//                 if (privateChats.get(payloadData.senderName)) {
//                     privateChats.set(payloadData.senderName, []);
//                     setPrivateChats(new Map(privateChats));
//                 }
//                 break;
//             case "MESSAGE":
//                 publicChats.push(payloadData);
//                 setPublicChats([...publicChats]);
//                 break;
//         }
//     }

//     const onPrivateMessageReceived = (payload) => {
//         let payloadData = JSON.parse(payload);
//         //check if the sender name is present
//         if (privateChats.get(payloadData.senderName)) {
//             privateChats.get(payloadData.senderName).push(payloadData);
//             setPrivateChats(new Map(privateChats));
//         }
//         else {
//             let list = [];
//             list.push(payloadData);

//             privateChats.set(payloadData.senderName, list);
//             setPrivateChats(new Map(privateChats));
//         }
//     }

//     const onError = (error) => {
//         console.log(error);
//     }

//     const sendPublicMessage = () => {
//         if(stompClient) {
//             let chatMessage = {
//                 senderName: userData.username,
//                 message: userData.message,
//                 status: "MESSAGE"
//             };

//             stompClient.send('/app/message',{},JSON.stringify(chatMessage));
//             setUserData({...userData, "message" : ""})
//         }
//     }

//     const sendPrivateMessage = () => {
//         if(stompClient) {
//             let chatMessage = {
//                 senderName: userData.username,
//                 receivername: tab,
//                 message: userData.message,
//                 status: "MESSAGE"
//             };
//             if(userData.username !== tab) {
//                 privateChats.get(tab).push(chatMessage);
//                 setPrivateChats(new Map(privateChats));
//             }
//             stompClient.send('/app/private-message',{},JSON.stringify(chatMessage));
//             setUserData({...userData, "message" : ""})
//         }
//     }

//     return (
//         //all these classnames are added in the index.css file
//         <div className="container">
//             {/* check whether the user is connected or not */}
//             {(() => {
//                 if (userData.connected) {
//                     // show the chat and then the chat box
//                     return (
//                         <div className="chat-box">
//                             <div className="member-list">
//                                 <ul>
//                                     <li onClick={() => setTab("CHATROOM")} className={`member ${tab === "CHATROOM" && "active"}`}>Chatroom</li>
//                                     {[...privateChats.keys()].map((name, index) => (
//                                         <li onClick={() => setTab(name)} className={`member ${tab === name && "active"}`} key={index}>

//                                         </li>
//                                     ))}
//                                 </ul>
//                             </div>
//                             {tab === "CHATROOM" && <div className="chat-content">
//                                 <ul className="chat-messages">
//                                     {[...publicChats.keys()].map((chat, index) => (
//                                         <li className="message" key={index}>
//                                             {chat.senderName !== userData.username && <div className="avatar">{chat.senderName}</div>}
//                                             <div className="message-data">{chat.message}</div>
//                                             {chat.senderName === userData.username && <div className="avatar-self">{chat.senderName}</div>}
//                                         </li>
//                                     ))}
//                                 </ul>

//                                 <div className="send-message">
//                                     <input type="text" className="input-message" name="message"
//                                         placeholder="Enter Public Message" value={userData.message} onChange={handleValue} />
//                                     <button type="button" className="send-button" onClick={sendPublicMessage}>send</button>
//                                 </div>
//                             </div>}
//                             {tab !== "CHATROOM" && <div className="chat-content">
//                                 <ul className="chat-messages">
//                                     {[...privateChats.get(tab)].map((chat, index) => (
//                                         <li className="message" key={index}>
//                                             {chat.senderName !== userData.username && <div className="avatar">{chat.senderName}</div>}
//                                             <div className="message-data">{chat.message}</div>
//                                             {chat.senderName === userData.username && <div className="avatar-self">{chat.senderName}</div>}
//                                         </li>
//                                     ))}
//                                 </ul>

//                                 <div className="send-message">
//                                     <input type="text" className="input-message" name="message"
//                                         placeholder={`Enter Private Message for ${tab}`} value={userData.message} onChange={handleValue} />
//                                     <button type="button" className="send-button" onClick={sendPrivateMessage}>send</button>
//                                 </div>
//                             </div>}
//                         </div>
//                     );
//                 }
//                 else {
//                     // show the registry dialog
//                     return (
//                         <div className="register">
//                             {/* this input elements the receives the name of the user */}
//                             <input
//                                 id="user-name"
//                                 name="username"
//                                 placeholder="Enter the user name"
//                                 value={userData.username}
//                                 onChange={handleValue}
//                             />
//                             <button type="button" onClick={registerUser}>
//                                 connect
//                             </button>
//                         </div>
//                     );
//                 }

//             })()}
//         </div>
//     )
// }

// export default ChatRoom;