import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { AwsS3Config } from 'aws-s3.config';

@Injectable()
export class S3Service {
  private s3: S3;
  private bucketName: string;
  
  constructor(private readonly awsS3Config: AwsS3Config) {
    this.s3 = new S3({
      accessKeyId: awsS3Config.accessKeyId,
      secretAccessKey: awsS3Config.secretAccessKey,
      region: awsS3Config.region,
    });
    this.bucketName = awsS3Config.bucketName;
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
  async listFileNames(bucketName: string): Promise<string[]> {
    const params = {
        Bucket: bucketName,
    };
    try {
        const data = await this.s3.listObjectsV2(params).promise();
        if (data.Contents){
            const filenames = data.Contents.map((object) => object.Key);
            return filenames;
        } else{
            return [];
        }
    } catch (error){
        throw error;
    }
  }
}


