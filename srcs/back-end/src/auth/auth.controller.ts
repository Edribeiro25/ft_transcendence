import {
	Body,
	Controller,
	Post,
	Req,
	UseGuards,
	Get,
	Res,Param,ParseIntPipe
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './Guard/jwt-guard';
import { FortyTwoAuthGuard } from './Guard/42-auth.guard';
import { Button2FADto, Code2faDto, InvitedUserDto, activate2faDto } from './auth.dto';

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	@Get('42/callback')
	@UseGuards(FortyTwoAuthGuard)
	async login(@Req() req: any, @Res() res: any) {
		const user = await this.authService.login(req.user._json.id);
		if(user == null)
		{
			res.redirect('http://localhost:5173/login')
			return res
		}
		const jwt = await this.authService.tokenreturn(user);
		res.cookie('access_token', jwt);
		res.redirect('http://localhost:5173/');
		return res;
	}

	@Post('Inviter')
	async loginInviter(@Body() nbr: InvitedUserDto, @Res() res: any) {
		const user = await this.authService.loginInviter(nbr.id);
		if(user == null)
		{
			res.json({ redirect: '/' });
			return res;
		}
		const jwt = await this.authService.tokenreturn(user);
		res.cookie('access_token', jwt);
		res.json({ redirect: '/' });
		return res;
	}

	@Get('Me')
	@UseGuards(JwtAuthGuard)
	async GetUser(@Req() req: any) {
		const decode = this.authService.decodedtok(req.cookies.access_token);
		const user = await this.authService.loginInfo(decode);
		return user;
	}

	@Post('Button2FA')
	@UseGuards(JwtAuthGuard)
	async Button2FA(@Body() nbr: Button2FADto) {
		const good = this.authService.changeotp(nbr.id);
		return good;
	}


	@Post('Activate2Fa')
	@UseGuards(JwtAuthGuard)
	async Activate2FA(@Body() nbr:activate2faDto, @Req() req: any) {
		const bool = await this.authService.verify( nbr.code, req.cookies.access_token);
		if (bool === true) 
		{
			this.authService.changeotp(nbr.id);
		}
		return bool;
	}

	@Post('Generate2FA')
	@UseGuards(JwtAuthGuard)
	async GenerateQR(@Req() req: any) {
		const qrcode = this.authService.generateCode(req.cookies.access_token);
		return qrcode;
	}

	@Post('Verify2FA')
	@UseGuards(JwtAuthGuard)
	async Verify(@Req() req: any, @Body() nbr: Code2faDto) {
		const bool = await this.authService.verify( nbr.code, req.cookies.access_token);
		if (bool === true) 
		this.authService.validate2FA(req.cookies.access_token);
		return bool;
	}

	@Get('Delete/:id')
	@UseGuards(JwtAuthGuard)
	async Delete2FA(@Param('id', ParseIntPipe) id: number,) {
		await this.authService.delete2FA(id)
		return true;
	}
}
