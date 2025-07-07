import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { DataModule } from './data/data.module';
import { LogsModule } from './logs/logs.module';
import { SupabaseModule } from './supabase/supabase.module';
import { UserModule } from './users/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SupabaseModule,
    AuthModule,
    DataModule,
    UserModule,
    LogsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
