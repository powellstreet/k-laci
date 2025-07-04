import {
  Body,
  Controller,
  Get,
  Headers,
  HttpStatus,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import {
  CompleteSignupDto,
  CompleteSignupResponseDto,
} from './dto/complete-signup.dto';
import {
  SendVerificationEmailDto,
  SendVerificationEmailResponseDto,
} from './dto/send-verification-email.dto';
import { SignInDto, SignInResponseDto } from './dto/sign-in.dto';
import { SignUpDto, SignUpResponseDto } from './dto/sign-up.dto';
import {
  SendVerificationCodeDto,
  SendVerificationCodeResponseDto,
  VerifyCodeDto,
  VerifyCodeResponseDto,
} from './dto/verification-code.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('send-verification-email')
  @ApiOperation({ summary: 'Send verification email for signup' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Verification email sent successfully',
    type: SendVerificationEmailResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid email format' })
  @ApiResponse({
    status: 401,
    description: 'Email already exists or other error',
  })
  async sendVerificationEmail(
    @Body() dto: SendVerificationEmailDto,
  ): Promise<SendVerificationEmailResponseDto> {
    return this.authService.sendVerificationEmail(dto);
  }

  @Public()
  @Post('send-verification-code')
  @ApiOperation({ summary: 'Send verification code for signup' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Verification code sent successfully',
    type: SendVerificationCodeResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid email format' })
  @ApiResponse({
    status: 401,
    description: 'Email already exists or other error',
  })
  async sendVerificationCode(
    @Body() dto: SendVerificationCodeDto,
  ): Promise<SendVerificationCodeResponseDto> {
    return this.authService.sendVerificationCode(dto);
  }

  @Public()
  @Post('verify-code')
  @ApiOperation({ summary: 'Verify email verification code' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Code verification result',
    type: VerifyCodeResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid code format' })
  @ApiResponse({
    status: 401,
    description: 'Invalid or expired code',
  })
  async verifyCode(@Body() dto: VerifyCodeDto): Promise<VerifyCodeResponseDto> {
    return this.authService.verifyCode(dto);
  }

  @Public()
  @Post('complete-signup')
  @ApiOperation({ summary: 'Complete signup process' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Signup completed successfully',
    type: CompleteSignupResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({
    status: 401,
    description: 'Invalid token or missing required agreements',
  })
  async completeSignup(
    @Body() dto: CompleteSignupDto,
  ): Promise<CompleteSignupResponseDto> {
    return this.authService.completeSignup(dto);
  }

  @Public()
  @Post('sign-up')
  @ApiOperation({ summary: 'Sign up new user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User signed up successfully',
    type: SignUpResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({
    status: 401,
    description: 'Signup failed',
  })
  async signUp(@Body() dto: SignUpDto): Promise<SignUpResponseDto> {
    return this.authService.signup(dto);
  }

  @Post('sign-out')
  @ApiOperation({ summary: 'Sign out user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User signed out successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Signout failed',
  })
  async signOut(@Headers('authorization') authHeader: string) {
    // Authorization 헤더에서 토큰 추출
    const token = authHeader?.replace('Bearer ', '');
    if (!token) {
      throw new UnauthorizedException('Authorization token is required');
    }

    return this.authService.signOut(token);
  }

  @Get('profile')
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User profile retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async getProfile() {
    return this.authService.getSession();
  }

  @Public()
  @Post('sign-in')
  @ApiOperation({ summary: 'Sign in user with email and password' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User signed in successfully',
    type: SignInResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({
    status: 401,
    description: 'Invalid email or password',
  })
  async signIn(@Body() dto: SignInDto): Promise<SignInResponseDto> {
    return this.authService.signIn(dto);
  }
}
