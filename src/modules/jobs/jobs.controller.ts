import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { JobsService } from './jobs.service';
import { JobStatus, GenerationCategory } from '@prisma/client';

@ApiTags('Jobs')
@Controller('api/v1/jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Get()
  @ApiOperation({ summary: 'List jobs' })
  async listJobs(
    @Query('status') status?: JobStatus,
    @Query('category') category?: GenerationCategory,
    @Query('limit') limit?: string,
  ) {
    return this.jobsService.listJobs({
      status,
      category,
      limit: limit ? parseInt(limit, 10) : undefined,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get job details' })
  async getJob(@Param('id') id: string) {
    return this.jobsService.getJob(id);
  }
}
