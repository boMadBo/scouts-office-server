import { AuthUser } from '@app/common/decorators/authUser.decorator';
import { AuthGuard } from '@app/common/guards/auth.guard';
import { ConversationService } from '@app/modules/conversation/conversation.service';
import { ConversationDto } from '@app/modules/conversation/dto/conversation.dto';
import { CreateConversationDto } from '@app/modules/conversation/dto/create.conversation.dto';
import { IConversationWithNames } from '@app/modules/conversation/types';
import { UserEntity } from '@app/modules/user/user.entity';
import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post, UseGuards } from '@nestjs/common';

@Controller('conversations')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  async create(@AuthUser() user: UserEntity, @Body() dto: CreateConversationDto): Promise<IConversationWithNames> {
    const result = await this.conversationService.create(dto, user.id);
    return ConversationController.mapToDto(result);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  async list(@AuthUser() user: UserEntity): Promise<IConversationWithNames[]> {
    const result = await this.conversationService.list(user.id);
    return result.map(ConversationController.mapToDto);
  }

  // @Get('/:id')
  // @HttpCode(HttpStatus.OK)
  // @UseGuards(AuthGuard)
  // async getOne(@Param('id') id: number, @AuthUser() user: UserEntity): Promise<IConversationWithNames> {
  //   const result = await this.conversationService.getByIdWithUserName(id, user.id);
  //   return ConversationController.mapToDto(result);
  // }

  @Patch('/:id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  async update(@Param('id') id: number, @AuthUser() user: UserEntity): Promise<IConversationWithNames> {
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
