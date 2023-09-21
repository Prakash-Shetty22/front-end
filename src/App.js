import logo from './logo.svg';
import './App.css';
import LoginPage from './components/Login';
import Header from './components/Header';
import FloatingActionButtonZoom from './components/FloatingActionButtonZoom';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Routing from './components/routing/Routing';
import PatientForm from './components/messaging/PatientForm';
import ChatRoom from './components/messaging/ChatRoom';
import MessageScreen from './components/messaging/MessageScreen';
import ChatApp from './components/messaging/ChatApp';
import ChatUI from './components/messaging/ChatUI';
import PatientChat from './components/messaging/PatientChat';
import ContactList from './components/messaging/ContactList';

function App() {
  return (
    <div className="App">
      {console.log("Inside App")}
      <Router>
        {/* <Header /> */}
        <Routing />
        {/* <PatientForm /> */}
        {/* <ChatRoom /> */}
        {/* <MessageScreen /> */}
        {/* <ChatApp /> */}
        {/* <ChatUI /> */}
        {/* <PatientChat /> */}
        {/* <ContactList /> */}
      </Router>
    </div>
  );
}

export default App;
