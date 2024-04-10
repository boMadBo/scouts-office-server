import { OutwardController } from '@app/modules/outward/outward.controller';
import { OutwardService } from '@app/modules/outward/outward.service';
import { OutwardTransfermarktController } from '@app/modules/outward/outward.transfermarkt.controller';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

@Module({
  imports: [HttpModule],
  controllers: [OutwardController, OutwardTransfermarktController],
  exports: [OutwardService],
  providers: [OutwardService],
})
export class OutwardModule {}
