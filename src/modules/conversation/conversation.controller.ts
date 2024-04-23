import { AuthUser } from '@app/common/decorators/authUser.decorator';
import { AuthGuard } from '@app/common/guards/auth.guard';
import { ConversationService } from '@app/modules/conversation/conversation.service';
import { ConversationDto } from '@app/modules/conversation/dto/conversation.dto';
import { CreateConversationDto } from '@app/modules/conversation/dto/create.conversation.dto';
import { IConversationWithNames } from '@app/modules/conversation/types';
import { UserEntity } from '@app/modules/user/user.entity';
import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';

@Controller('conversations')
@ApiTags('Conversations')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: ConversationDto,
    description: 'Create new conversation',
  })
  async create(@AuthUser() user: UserEntity, @Body() dto: CreateConversationDto): Promise<ConversationDto> {
    const result = await this.conversationService.create(dto, user.id);
    return ConversationController.mapToDto(result);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Get conversations',
  })
  async list(@AuthUser() user: UserEntity): Promise<ConversationDto[]> {
    const result = await this.conversationService.list(user.id);
    return result.map(ConversationController.mapToDto);
  }

  @Patch('/:id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: ConversationDto,
    description: 'Update last used conversation',
  })
  async update(@Param('id') id: number, @AuthUser() user: UserEntity): Promise<ConversationDto> {
    const result = await this.conversationService.update(id, user.id);
    return ConversationController.mapToDto(result);
  }

  static mapToDto(values: IConversationWithNames): ConversationDto {
    const dto = new ConversationDto();

    dto.id = values.id;
    dto.createdAt = values.createdAt;
    dto.updatedAt = values.updatedAt;
    dto.user = values.user;
    dto.interlocutor = values.interlocutor;

    return dto;
  }
}
