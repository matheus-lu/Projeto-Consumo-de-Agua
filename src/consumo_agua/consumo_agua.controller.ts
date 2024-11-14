import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { Consumer } from './consumo_agua.model';
import { ConsumoAguaService } from './consumo_agua.service';


@Controller('consumo-agua')
export class ConsumoAguaController {
    constructor(private readonly consumerService: ConsumoAguaService) {}

    @Get()
    readAllConsumers(): Promise<any>{
        return this.consumerService.readAllConsumers();
    }

    @Get(':consumerId')
    readConsumersBills(@Param('consumerId') consumerId: string): Promise<any>{
        return this.consumerService.readConsumersBills(consumerId);
    }

    @Get('/date/:consumerId/:firstDate/:secondDate')
    readSelectedDates(@Param('consumerId') consumerId: string, @Param('firstDate') firstDate: string, @Param('secondDate') secondDate: string): Promise<any>{
        return this.consumerService.readSelectedDates(consumerId,firstDate, secondDate);
    }

    @Get('/consumption-alert/:consumerId')
    getConsumptionAlert(@Param('consumerId') consumerId: string): Promise<any> {
        return this.consumerService.checkHighConsumptionAlert(consumerId);
    }

    @Post()
    async createConsumer(@Body() consumer: Consumer): Promise<any>{
        var response = await this.consumerService.createConsumer(consumer);
        return {id: response};
    }

    @Patch()
    async updateConsumer(@Body() consumer: Consumer): Promise<any>{
        await this.consumerService.updateConsumer(consumer);
    }

    @Delete('/:id')
    async deleteConsumer(@Param('id') id: number){
        await this.consumerService.deleteConsumer(id);
        return null;
    }

}
