// s3.controller.ts
import { Controller, Get, Post, Req, Res, UseInterceptors } from '@nestjs/common';
import { Request, Response } from 'express';
import { S3Service } from './s3.service';
import { multerConfig } from './multer.config';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('s3')
export class S3Controller {
  constructor(private readonly s3Service: S3Service) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@Req() req: Request, @Res() res: Response) {
    try {
        // Access the uploaded file from the request
        const uploadedFile = req.file;
  
        if (!uploadedFile) {
          res.status(400).send('No file provided');
          return;
        }
  
        // Upload the file to S3 using the S3Service
        await this.s3Service.uploadFile(uploadedFile.originalname, uploadedFile.buffer);
  
        // Respond with a success message
        res.status(200).send('File uploaded successfully');
      } catch (error) {
        // Handle errors and respond with an error message
        console.error('Error uploading file:', error);
        res.status(500).send('File upload failed');
      }
    }

  @Get('download')
  async downloadFile(@Req() req: Request, @Res() res: Response) {
    try {
      // Implement the file download logic here using the S3Service.
      // You can retrieve the file requested by the client from your S3 bucket using the S3Service,
      // and then send it as a response to the client.
    } catch (error) {
      // Handle any errors that occur during the download process.
      // You can respond with an error message or appropriate status code.
    }
  }
}

