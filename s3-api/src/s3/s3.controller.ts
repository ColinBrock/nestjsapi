// s3.controller.ts
import { Controller, Get, Post, Req, Res, UseInterceptors } from '@nestjs/common';
import { Request, Response } from 'express';
import { S3Service } from './s3.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('s3')
export class S3Controller {
  constructor(private readonly s3Service: S3Service) {}

  @Get('filenames')
  async listFileNames(@Res() res: Response){
    try{
        const filenames = await this.s3Service.listFileNames();
        res.status(200).json({filenames});
    } catch (error){
        console.log(error);
        res.status(500).json({error: 'Failed to list the files :(',
                            message: error.message,})
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

