import { SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server , Socket} from "socket.io";

import { StateService } from "./state.service";

@WebSocketGateway({
	cors: {
		origin: 'http://localhost:5173',
	},
	namespace: 'state',
})
export class StateGateway {
	constructor(private stateservice : StateService) {
    }

	@WebSocketServer()
	server: Server;

    @SubscribeMessage('Connect')
    async Connect(client :Socket, id  : number){
        await this.stateservice.connection(client,id)
        this.server.emit('ref')
    }

    async handleDisconnect(client :Socket){
        await this.stateservice.disconnect(client)
        this.server.emit('ref')
    }

    @SubscribeMessage('game')
    async Gameconnection(client :Socket){
        await this.stateservice.Game(client)
        this.server.emit('ref')
    }

    @SubscribeMessage('Change')
    async Change(client :Socket){
        await this.stateservice.Change(client)
        this.server.emit('ref')
    }

    @SubscribeMessage('Invite')
    async Invite(client :Socket,id : number){
        await this.stateservice.invite(client,id)
    }

    @SubscribeMessage('Accepted')
    async Accepte(client :Socket,id : number){
        await this.stateservice.accept(client,id)
    }

    @SubscribeMessage('Refused')
    async Refused(client :Socket,id : number){
        await this.stateservice.refused(client,id)
    }

    @SubscribeMessage('AFK')
    async afk(client :Socket){
        await this.stateservice.afk(client)
    }
}