import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from 'src/user/schema/user.schema';
import { validatePassword } from 'utils/helpers';
import { AuthCredentialsDto } from '../user/dto/auth-credentials.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(
    createUserDto: CreateUserDto,
  ): Promise<{ name: string; accessToken: string }> {
    const { email, password } = createUserDto;
    let token;
    let createdUser;

    // Check if user already exists
    const existingUser = await this.userService.findByEmail(email);

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Check Password Validation
    const passwordErrors = validatePassword(password);
    if (passwordErrors.length > 0) {
      throw new BadRequestException(passwordErrors.join('; '));
    }

    // Hash the password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const userToCreate = {
      ...createUserDto,
      password: hashedPassword,
    };

    try {
      createdUser = await this.userService.createUser(userToCreate);
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException(
          `Duplicate key found: ${JSON.stringify(error.keyValue)}`,
        );
      } else {
        throw new InternalServerErrorException('Error creating user');
      }
    }

    // User is valid, generate JWT
    const payload = { username: createdUser.username, id: createdUser._id };
    try {
      token = await this.jwtService.signAsync(payload);
    } catch (error) {
      throw new InternalServerErrorException('Token generation failed');
    }

    return { name: createUserDto?.username, accessToken: token };
  }

  async signIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ name: string; accessToken: string }> {
    let token: string;

    // Validate user credentials
    const user = await this.userService.validateUser(authCredentialsDto);

    // If validation fails, throw an unauthorized exception
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // User is valid, generate JWT
    const payload = { username: user.username, id: user._id };

    try {
      token = await this.jwtService.signAsync(payload);
    } catch (error) {
      throw new InternalServerErrorException('Token generation failed');
    }

    return { name: user?.username, accessToken: token };
  }
}
