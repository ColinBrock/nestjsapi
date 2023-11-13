// s3.controller.ts
import { UploadedFile, Controller, Get, Post, Query, Req, Res, Param, UseInterceptors, Delete, InternalServerErrorException, Body } from '@nestjs/common';
import { Request, Response } from 'express';
import { S3Service } from './s3.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';

@Controller('s3')
export class S3Controller {
  private defaultBucketName = 'callitsomethingcool';
  constructor(private readonly s3Service: S3Service) {}
 
  @Get('filenames')
  async listFileNames(@Res() res: Response){
    try {
      const filenames = await this.s3Service.listFileNames(this.defaultBucketName);
      console.log(filenames);
      res.status(200).json({filenames});
    } catch (error){
      console.log(error);
      res.status(500).json({
        error: `Failed to list the files from the bucket :(`,
        message: error.message,
      });
    }
  }

  @Get('download/:filename')
  async downloadFile(
    @Param('filename') filename: string,
    @Res() res: Response,
  ) {
    try {
      const fileStream = await this.s3Service.downloadFile(this.defaultBucketName, filename);

      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Content-Type', 'application/octet-stream');

      fileStream.pipe(res);
    } catch (error) {
      console.log(error);
      res.status(500).json({
        error: `Failed to download ${filename} from :(`,
        message: error.message,
      });
    }
  }

  @Delete('delete/:filename')
  async deleteFile(
    @Param('filename') filename: string,
    @Res() res: Response,
  ) {
    try {
      await this.s3Service.deleteFile(this.defaultBucketName, filename);
      res.status(204).send(); // 204 No Content for successful deletion
    } catch (error) {
      console.log(error);
      res.status(500).json({
        error: `Failed to delete ${filename} from :(`,
        message: error.message,
      });
    }
  }
}

@Controller('upload')
export class UploadController {
  private defaultBucketName = 'callitsomethingcool';
  constructor(private readonly s3Service: S3Service) {}

  @Post()
  async uploadFile(@Body() file: any) {
    try {
      // Assuming the file content is directly available in the 'file' variable
      const result = await this.s3Service.uploadFile(this.defaultBucketName, file);
      
      // Handle the successful upload, you might want to return some response
      return {
        message: 'File uploaded successfully',
        location: result.Location,
      };
    } catch (error) {
      // Handle errors if the upload fails
      console.error(error);
      throw new InternalServerErrorException(`Failed to upload the file: ${error.message}`);
    }
  }


}

