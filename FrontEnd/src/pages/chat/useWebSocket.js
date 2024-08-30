import { Client } from '@stomp/stompjs';
import { useCallback, useRef, useState } from 'react';
import SockJS from 'sockjs-client';

const useWebSocket = () => {
  const [isConnected, setIsConnected] = useState(false);
  const stompClient = useRef(null);

  const connectWebSocket = useCallback(() => {
    return new Promise((resolve, reject) => {  // resolve와 reject를 명시적으로 정의
      const socket = new SockJS(`${process.env.REACT_APP_API_URL}/ws`);
      const client = new Client({
        webSocketFactory: () => socket,
        onConnect: () => {
          console.log('Connected to WebSocket');
          setIsConnected(true);
          resolve();  // 연결 성공 시 Promise resolve
        },
        onDisconnect: () => {
          console.log('Disconnected from WebSocket');
          setIsConnected(false);
        },
        onStompError: (frame) => {
          console.error('Broker reported error: ' + frame.headers['message']);
          console.error('Additional details: ' + frame.body);
          reject(new Error('WebSocket connection error'));  // 연결 실패 시 Promise reject
        },
      });
      client.activate();
      stompClient.current = client;
    });
  }, []);

  const disconnectWebSocket = useCallback(() => {
    if (stompClient.current) {
      stompClient.current.deactivate();
    }
  }, []);

  const subscribeToChatRoom = useCallback((roomId, callback) => {
    if (stompClient.current?.connected) {
      return stompClient.current.subscribe(`/topic/chatroom.${roomId}`, (message) => {
        const receivedMessage = JSON.parse(message.body);
        callback(receivedMessage);
      });
    }
  }, []);

  const sendMessage = useCallback((destination, message) => {
    if (stompClient.current?.connected) {
      stompClient.current.publish({
        destination,
        body: JSON.stringify(message)
      });
    }
  }, []);

  return {
    isConnected,
    connectWebSocket,
    disconnectWebSocket,
    subscribeToChatRoom,
    sendMessage
  };
};

export default useWebSocket;