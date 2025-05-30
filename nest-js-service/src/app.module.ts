import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductModule } from './product/product.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { dataBaseConfig } from './database/database.config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { AuthGuard } from './auth/auth.guard';

@Module({
  imports: [ProductModule,SequelizeModule.forRoot(dataBaseConfig), UserModule,AuthModule],
  controllers: [AppController],
  providers: [AppService,{provide: 'APP_GUARD', useClass: AuthGuard}],
})
export class AppModule {}
