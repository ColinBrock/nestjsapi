import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { AwsS3Config } from 'aws-s3.config';

@Injectable()
export class S3Service {
  private s3: S3;

  constructor(private readonly awsS3Config: AwsS3Config) {
    this.s3 = new S3({
      accessKeyId: awsS3Config.accessKeyId,
      secretAccessKey: awsS3Config.secretAccessKey,
      region: awsS3Config.region,
    });
  }

  async uploadFile(fileKey: string, fileBuffer: Buffer): Promise<void> {
    await this.s3
      .upload({
        Bucket: this.awsS3Config.bucketName,
        Key: fileKey,
        Body: fileBuffer,
      })
      .promise();
  }

  async getFile(fileKey: string): Promise<Buffer> {
    const response = await this.s3
      .getObject({
        Bucket: this.awsS3Config.bucketName,
        Key: fileKey,
      })
      .promise();

    return response.Body as Buffer;
  }
}

