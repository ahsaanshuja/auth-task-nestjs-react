import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import * as bcrypt from 'bcryptjs';
import { UserService } from 'src/user/user.service';
import { SafeUser } from 'utils/interface';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      usernameField: 'email',
    });
  }

  async validate(email: string, password: string): Promise<SafeUser> {
    // Fetch the user by email
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    // Compare passwords
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    // Omit sensitive data
    const { ...result } = user;
    return result as SafeUser;
  }
}
