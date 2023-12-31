import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { S3Service } from './s3/s3.service';
import { S3Controller } from './s3/s3.controller';
import { AwsS3Config } from 'aws-s3.config';

@Module({
  imports: [],
  controllers: [AppController, S3Controller],
  providers: [AppService, S3Service, AwsS3Config],
})
export class AppModule {}
