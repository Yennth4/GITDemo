import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import { toast } from "react-toastify";

let stompClient = null;

export const connectStompClient = () => {
  const socket = new SockJS(
    "http://localhost:6789/portal-projects-websocket-endpoint"
  );
  stompClient = Stomp.over(socket);

  stompClient.onWebSocketClose(() => {
    toast.info("Mất kết nối đến máy chủ !");

    setTimeout(() => {
      toast.info("Đang kết nối lại với máy chủ ...");
      connectStompClient();
    }, 5000);
  });

  stompClient.activate();
};

export const getStompClient = () => stompClient;
