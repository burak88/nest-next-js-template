import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { UserModule } from 'src/user/user.module';
import { RefreshStrategy } from './refresh.strategy';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      global :true,
      secret: "process.env.ACCESS_SECRET",
      signOptions: { expiresIn: '15m' },
    }),
  ], // içe aktarıyoruz
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, RefreshStrategy],
  exports: [AuthService], // UserService'i diğer modüllerle paylaşmak için exports ekleniyor
})
export class AuthModule {}
