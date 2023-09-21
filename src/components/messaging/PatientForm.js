import React, { useState } from 'react';
import axios from 'axios';

// import React, { useEffect } from 'react';
// import { connectToRabbitMQ, sendMessage } from './RabbitMQService';

const PatientForm = () => {
      const [patientData, setPatientData] = useState({
        name: '',
        issue: '',
        adminUsername: '',
      });

      const handleSubmit = async (e) => {
        e.preventDefault();

        try {
          await axios.post('/api/patients', patientData);
          alert('Message sent successfully!');
          setPatientData({ name: '', issue: '', adminUsername: '' });
        } catch (error) {
          console.error(error);
          alert('Failed to send message.');
        }
      };

      return (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Your name"
            value={patientData.name}
            onChange={(e) =>
              setPatientData({ ...patientData, name: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Health issue"
            value={patientData.issue}
            onChange={(e) =>
              setPatientData({ ...patientData, issue: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Hospital admin username"
            value={patientData.adminUsername}
            onChange={(e) =>
              setPatientData({ ...patientData, adminUsername: e.target.value })
            }
          />
          <button type="submit">Send Message</button>
        </form>
      );

    // useEffect(() => {
    //     connectToRabbitMQ();
    // }, []);

    // const handleSendMessage = () => {
    //     sendMessage({ text: 'Hello from frontend!' });
    // };

    // return (
    //     <div>
    //         <button onClick={handleSendMessage}>Send Message</button>
    //     </div>
    // );
};

export default PatientForm;
