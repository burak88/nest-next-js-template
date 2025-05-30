import { ForbiddenException, Injectable } from "@nestjs/common"
import { User } from "src/user/entities/user.entity"
import { UserService } from "src/user/user.service"
import * as bcrypt from 'bcrypt'
import { JwtService } from "@nestjs/jwt"

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email)
    if (user?.dataValues && await bcrypt.compare(password, user.dataValues.password)) {
      return user.dataValues
    }
    return null
  }

  async login(user: User) {
    const payload = { sub: user.id, email: user.email, role: user.role }
    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' })
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' })

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10)
    await this.usersService.updateRefreshToken(user.id, hashedRefreshToken)

    return { accessToken, refreshToken, user: { id: user.id, email: user.email, role: user.role } }
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.usersService.findById(userId)
    if (!user?.dataValues.refreshToken) throw new ForbiddenException()

    const isMatch = await bcrypt.compare(refreshToken, user.dataValues.refreshToken)
    if (!isMatch) throw new ForbiddenException()

    return this.login(user.dataValues)
  }

  async logout(userId: string) {
    await this.usersService.removeRefreshToken(userId)
  }
}
