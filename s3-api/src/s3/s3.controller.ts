// s3.controller.ts
import { Controller, Get, Post, Req, Res, Param, UseInterceptors, Delete } from '@nestjs/common';
import { Request, Response } from 'express';
import { S3Service } from './s3.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('s3')
export class S3Controller {
  constructor(private readonly s3Service: S3Service) {}
 
  @Get('filenames/:bucketName')
  async listFileNames(@Param('bucketName') bucketName: string, @Res() res: Response){
    try{
        
        const filenames = await this.s3Service.listFileNames(bucketName);
        console.log(filenames);
        res.status(200).json({filenames});
    } catch (error){
        console.log(error);
        res.status(500).json({error: `Failed to list the files from ${bucketName} :(`,
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
  @Delete('delete/:bucketName/:filename')
  async deleteFile(
    @Param('bucketName') bucketName: string,
    @Param('filename') filename: string,
    @Res() res: Response,
  ) {
    try {
      await this.s3Service.deleteFile(bucketName, filename);
      res.status(204).send(); // 204 No Content for successful deletion
    } catch (error) {
      console.log(error);
      res.status(500).json({
        error: `Failed to delete ${filename} from ${bucketName} :(`,
        message: error.message,
      });
    }
}
}
