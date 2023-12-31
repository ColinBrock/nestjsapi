import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { AwsS3Config } from 'aws-s3.config';
import { Readable } from 'stream';
import { ManagedUpload } from 'aws-sdk/clients/s3';

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

  async uploadFile(fileKey: string, fileBuffer: Buffer): Promise<ManagedUpload.SendData> {
    const params = {
      Bucket: 'callitsomethingcool',
      Key: fileKey,
      Body: fileBuffer,
    }
    console.log(params);
    const result = await this.s3.upload(params).promise();
  
    // Work on this next
    return result;
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
  async deleteFile(bucketName: string, filename: string): Promise<void> {
    const params = {
      Bucket: bucketName,
      Key: filename,
    };

    await this.s3.deleteObject(params).promise();
}
async downloadFile(bucketName: string, filename: string): Promise<NodeJS.ReadableStream> {
  const params = {
    Bucket: bucketName,
    Key: filename,
  };

  const object = await this.s3.getObject(params).promise();
  return object.Body as Readable;
}

}
