import { Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { PrismaService } from 'src/utils/prisma/prisma.service';
import { UpdateProjectDto } from './dto/update-project.dto';
import { SimilaritySearchFromDocsDto } from './dto/chat-project.dto';
import { VectorService } from '../vector/vector.service';

@Injectable()
export class ProjectService {
  constructor(
    private prisma: PrismaService,
    private readonly vectorService: VectorService
  ) {}

  async get(id: string) {
    return this.prisma.project.findUnique({
      where: {
        id,
      },
      include: {
        projectDetail: true,
        user: {
          select: {
            id: true,
            email: true,
            username: true,
            profile: true,
          },
        },
        docs: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
      },
    });
  }

  getAll(userId: string) {
    return this.prisma.project.findMany({
      where: {
        userId,
      },
    });
  }

  create(createProjectDto: CreateProjectDto, userId: string) {
    const { name, description, prompt, questions, whiteList, ipLimit } =
      createProjectDto;
    const projectDetail = {
      prompt,
      questions,
      whiteList,
      ipLimit: Number(ipLimit),
    };
    return this.prisma.project.create({
      data: {
        name,
        description,
        userId,
        projectDetail: {
          create: projectDetail,
        },
      },
    });
  }

  async update(updateProjectDto: UpdateProjectDto) {
    const {
      id,
      name,
      description,
      prompt,
      questions,
      whiteList,
      ipLimit,
      docIds,
    } = updateProjectDto;
    const projectDetail = {
      prompt,
      questions,
      whiteList,
      ipLimit: Number(ipLimit),
    };

    const data = await this.prisma.project.update({
      where: {
        id,
      },
      data: {
        name,
        description,
        projectDetail: {
          update: projectDetail,
        },
        ...(docIds
          ? {
              docs: {
                connect: docIds.map((docId) => ({ id: docId })),
              },
            }
          : {}),
      },
      include: {
        projectDetail: true,
        docs: true,
      },
    });

    return data;
  }

  delete(id: string) {
    return this.prisma.project.delete({
      where: {
        id,
      },
    });
  }

  async similaritySearchFromDocs(
    id: string,
    similaritySearchFromDocsDto: SimilaritySearchFromDocsDto
  ) {
    const { content, size } = similaritySearchFromDocsDto;

    const { docs } = await this.prisma.project.findUnique({
      where: {
        id,
      },
      include: {
        docs: true,
      },
    });

    const docIds = docs.map((doc) => doc.id);
    if (!docIds.length) {
      return [];
    }
    return await this.vectorService.similaritySearch({
      docIds,
      message: content,
      size,
    });
  }
}
