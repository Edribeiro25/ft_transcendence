import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import * as QRCode from 'qrcode';
import { authenticator } from 'otplib';

@Injectable({})
export class AuthService {
	constructor(
		private jwtService: JwtService,
		private prismaService: PrismaService,
	) {}

	async login(id: number) {
		try {
			const users = await this.prismaService.user.findUniqueOrThrow({
				where: { id42: id },
			});
			if(users.otpvalider == true){
				await this.prismaService.user.update({where : {id42 : id},data : {otpenable : true , otpvalider : false}})
			}
			if(users.state != 'Disconected')
			{
				return null
			}
			return users;
		} catch (error) {
			const user = await this.prismaService.user.create({
				data: {
					id42: id,
					avatar: './storage/uploads/default.jpg',
				},
			});
			return user;
		}
	}

	async tokenreturn(User: any) {
		const payload = {
			id: User.id,
			Profile: User.profilefinish,
			TwoFa: User.otpenable,
			Connected: User.state,
		};
		const jwt = await this.jwtService.signAsync(payload);
		return jwt;
	}

	decodedtok(token: string) {
		const decode = this.jwtService.decode(token);
		return decode;
	}

	async loginInviter(id: number) {
		try {
			const users = await this.prismaService.user.findUniqueOrThrow({
				where: { id42: id },
			});
			if(users.otpvalider == true){
				await this.prismaService.user.update({where : {id42 : id},data : {otpenable : true , otpvalider : false}})
			}
			if(users.state != 'Disconected')
			{
				return null
			}
			return users;
		} catch (error) {
			const user = await this.prismaService.user.create({
				data: {
					avatar: './storage/uploads/default.jpg',
					id42: id,
				},
			});
			return user;
		}
	}

	async changeotp(id: number) {
		try {
			const users = await this.prismaService.user.findUniqueOrThrow({
				where: { id: id },
			});
			let user: any;
			if (users.otpenable == true)
				user = await this.prismaService.user.update({
					where: { id: id },
					data: { otpenable: false, otpvalider: false },
				});
			else
				user = await this.prismaService.user.update({
					where: { id: id },
					data: { otpenable: true, otpvalider: true },
				});
			return users.otpenable;
		} catch (error) {
			throw new BadRequestException();
		}
	}

	async loginInfo(token: any) {
		try {
			const user = await this.prismaService.user.findUniqueOrThrow({
				where: { id: token.id },
				select: {
					id: true,
					name: true,
					profilefinish: true,
					otpenable: true,
					otpvalider: true,
					state: true,
				},
			});
			return user;
		} catch (error) {
			throw new BadRequestException();
		}
	}

	async generateCode(token: string) {
		try {
			const decode = this.jwtService.verify(token);
			const user = await this.prismaService.user.findFirstOrThrow({
				where: { id: decode.id },
			});
			if (user.name == null) return false;
			const secret: string = authenticator.generateSecret();
			await this.prismaService.user.update({
				where: { id: decode.id },
				data: { otpcode: secret, otpvalider: false , otpenable : false},
			});
			const uri = authenticator.keyuri(user.name, 'GROSSECRETS', secret);
			const code = await QRCode.toDataURL(uri);
			return code;
		} catch (error) {
			return null;
		}
	}

	async verify(code: string, token: string) {
		const decode = this.jwtService.verify(token);
		try {
			const user = await this.prismaService.user.findFirstOrThrow({
				where: { id: decode.id },
			});
			let verify: boolean;
			if (user.otpcode) {
				verify = authenticator.check(code, user.otpcode);
				return verify;
			}
			return false;
		} catch (error) {
			return false;
		}
	}

	async validate2FA(token: string) {
		const decode = this.jwtService.verify(token);
		try {
			const user = await this.prismaService.user.findFirstOrThrow({
				where: { id: decode.id },
			});
			await this.prismaService.user.update({
				where: { id: decode.id },
				data: { otpvalider: true },
			});
		} catch (error) {
			console.log(error)
			return false;
		}
	}

	async delete2FA(id : number) {
		try {
			await this.prismaService.user.update({
				where: { id: id },
				data: { otpvalider: false, otpenable : false , otpcode : ''},
			});
		} catch (error) {
			console.log(error)
			return false;
		}
	}
}
