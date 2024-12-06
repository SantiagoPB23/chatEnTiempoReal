import { useState } from 'react';
import './App.css';
import io from 'socket.io-client';
import Chat from './Chat';
import { FormField, Button, Form, CardContent, Card, Container } from 'semantic-ui-react';

const socket = io.connect("http://localhost:3001");

function App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setshowChat] = useState(false);

  
  const joinRoom = () => {
    if (username !== "" && room !== "") {
      socket.emit("join_room", room);  
      setshowChat(true);  
    }
  };

  return (
    <>
      <Container>
        {!showChat ? (
          <Card fluid>
            <CardContent header={`Chat en vivo | Sala: ${room}`} />
            <CardContent>
              <Form>
                <FormField>
                  <label>Nombre de usuario</label>
                  <input
                    type="text"
                    placeholder="Chris..."
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </FormField>
                <FormField>
                  <label>Sala:</label>
                  <input
                    type="text"
                    placeholder="ID de la sala"
                    onChange={(e) => setRoom(e.target.value)}
                  />
                </FormField>
                <Button onClick={joinRoom}>Unirme</Button>
              </Form>
            </CardContent>
          </Card>
        ) : (
          <Chat socket={socket} username={username} room={room} />
        )}
      </Container>
    </>
  );
}

export default App;
