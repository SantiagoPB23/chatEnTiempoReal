import React, { useEffect, useState } from "react";
import { CardContent, Card, Message, MessageHeader, Divider, Form, FormField, Input, Container, Icon } from 'semantic-ui-react';
import ScrollToBottom from 'react-scroll-to-bottom';

const Chat = ({ socket, username, room }) => {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  
  const sendMessage = async () => {
    if (username && currentMessage) {
      const time = new Date();
      const info = {
        message: currentMessage,
        room,
        author: username,
        time: `${time.getHours()}:${time.getMinutes()}`,
      };
      socket.emit("send_message", info);  
      setMessageList((list) => [...list, info]);  
      setCurrentMessage("");  
    }
  };

  
  useEffect(() => {
    const messageHandle = (data) => {
      setMessageList((list) => [...list, data]);  
    };

    if (socket) {
      socket.on("receive_message", messageHandle);  
    }

    return () => {
      if (socket) {
        socket.off("receive_message", messageHandle);  
      }
    };
  }, [socket]); 

  return (
    <Container>
      <Card fluid>
        <CardContent header="Chat en vivo" />
        <ScrollToBottom>
          <CardContent style={{ height: "400px", padding: "5px" }}>
            Mensajes
            {messageList.map((item, i) => {
              return (
                <span key={i}>
                  <Message
                    style={{ textAlign: username === item.author ? 'right' : 'left' }}
                    success={username === item.author}
                    info={username !== item.author}
                  >
                    <MessageHeader>{item.message}</MessageHeader>
                    <p>Enviado por: <strong>{item.author}</strong>, a las {" "}<i>{item.time}</i></p>
                  </Message>
                  <Divider />
                </span>
              );
            })}
          </CardContent>
        </ScrollToBottom>
        <CardContent extra>
          <Form>
            <Form.Field>
              <div className="ui action input">
                <Input
                  type="text"
                  placeholder="Escribe un mensaje"
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') sendMessage();
                  }}
                />
                <button
                  type="button"
                  onClick={() => sendMessage()}
                  className="ui teal icon right labeled button"
                >
                  <Icon name="send" />
                  Enviar
                </button>
              </div>
            </Form.Field>
          </Form>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Chat;
