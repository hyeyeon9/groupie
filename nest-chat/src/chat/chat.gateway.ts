import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

// 웹소켓 게이트웨이 선언
@WebSocketGateway({ cors: true }) // cors 방지
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  afterInit(server: Server) {
    console.log('WebSocket server initialized');
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  // 'chat'이라는 이벤트를 구독하고, 메시지가 오면 실행
  @SubscribeMessage('chat')
  handleChat(
    @MessageBody() data: { nickname: string; message: string }, // 받은 메시지
    @ConnectedSocket() client: Socket, // 메시지가 보낸 클라이언트
  ) {
    console.log(`${data.nickname}: ${data.message}`);
    // 현재 클라이언트를 제외한 다른 모든 클라이언트에게 메시지 브로드캐스트
    client.broadcast.emit('chat', data);
  }
}
