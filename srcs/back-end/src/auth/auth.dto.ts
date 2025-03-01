
import {IsNotEmpty,IsInt, IsString} from 'class-validator';

export class InvitedUserDto{
  
    @IsNotEmpty()
    id: number;
}

export class Button2FADto{
    @IsInt()
    id : number;
}


export class Code2faDto{
    @IsString()
    @IsNotEmpty()
    code : string;
}

export class activate2faDto{
    @IsInt()
    id : number;

    @IsString()
    @IsNotEmpty()
    code : string;
}

