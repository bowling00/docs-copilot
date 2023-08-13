import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Inject,
  LoggerService,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { VectorService } from './vector.service';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { CreateVectorDto } from './dto/create-vector.dto';
import { JwtGuard } from 'src/guards/jwt.guard';
import { SearchVectorDto } from './dto/seatch.dto';

@ApiTags('向量')
@UseInterceptors(ClassSerializerInterceptor)
@Controller('vector')
export class VectorController {
  constructor(
    private vectorService: VectorService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService
  ) {}

  @ApiOperation({ summary: '获取向量详情' })
  @ApiResponse({ status: 200, description: '成功获取用户资料' })
  @Get(':id')
  get(@Query('id') id: string) {
    return this.vectorService.get(id);
  }

  @ApiOperation({ summary: '获取所有的向量列表' })
  @ApiResponse({ status: 200, description: '成功获取用户资料' })
  @Get(':id/getVectors')
  async getAll(@Query('docs_id') docs_id: string) {
    const vectors = await this.vectorService.getAll(docs_id);
    return {
      vectors,
    };
  }

  @ApiOperation({ summary: '添加向量数据' })
  @Post()
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  create(@Body() createVectorDto: CreateVectorDto) {
    return this.vectorService.create(createVectorDto);
  }

  @Patch(':id')
  edit() {}

  @Delete(':id')
  delete() {}

  @ApiOperation({ summary: '相似度搜索' })
  @ApiResponse({ status: 200, description: '成功获取' })
  @Get(':id/similarity_search')
  async similaritySearch(@Query() searchVectorDto: SearchVectorDto) {
    return await this.vectorService.similaritySearch(searchVectorDto);
  }
}
