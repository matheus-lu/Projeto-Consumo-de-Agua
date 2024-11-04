import { Injectable, NotFoundException } from '@nestjs/common';
import { Consumer } from './consumo_agua.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ConsumoAguaService {

    constructor(@InjectModel('Consumer') private readonly consumerModel: Model<Consumer> ) {}

    // CRUD - CREATE, READ, UPDATE, DELETE
    // CREATE
    async createConsumer(consumer: Consumer){
        const consumerModel = new this.consumerModel(
            {
                consumerId: consumer.consumerId,
                waterConsumed: consumer.waterConsumed,
                date: consumer.date
            }
    );
        const result = await consumerModel.save();
        return result.id as string;
    }

    // READ
    async readAllConsumers(){
        const allConsumersData = await this.consumerModel.find().exec();
        return allConsumersData;
    }

    async readConsumersBills(consumerId: string) {
        const id = String(consumerId)
        const readConsumersBillsList = await this.consumerModel.find({ consumerId: id }).exec()
        return readConsumersBillsList
    }

    async readSelectedDates(firstDate: string, secondDate: string) {
        // Verificar se as datas estão em formato válido
        const startDate = new Date(`${firstDate}T00:00:00Z`);
        const endDate = new Date(`${secondDate}T23:59:59Z`);
    
        // Validar se as datas criadas são válidas
        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            throw new Error('Datas inválidas fornecidas. Por favor, utilize o formato YYYY-MM-DD.');
        }
    
        // Executar a consulta no intervalo especificado
        try {
            const consumerSelectedDate = await this.consumerModel.find({
                date: { $gte: startDate, $lt: endDate }
            }).exec();
            
            return consumerSelectedDate;
        } catch (error) {
            console.error('Erro ao buscar dados no intervalo de datas:', error);
            throw new Error('Erro ao buscar dados no intervalo de datas.');
        }
    }

    //UPDATE
    async updateConsumer(consumer: Consumer){
        const updatedConsumer = await this.consumerModel.findOne({consumerId: consumer.consumerId});
        if(!updatedConsumer){
            throw new NotFoundException('Could not find the consumer.');
        }
        if(consumer.consumerId){
            updatedConsumer.consumerId = consumer.consumerId
        }
        if(consumer.waterConsumed){
            updatedConsumer.waterConsumed = consumer.waterConsumed
        }
        updatedConsumer.save()
    }

    //ALERT
    async checkHighConsumptionAlert(consumerId: string): Promise<string | null> {
        const now = new Date();
        const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    
        console.log('Current Date:', now);
        console.log('Start of This Month:', startOfThisMonth);
        console.log('Start of Last Month:', startOfLastMonth);
    
        // Verifique se as datas são válidas
        if (isNaN(startOfThisMonth.getTime()) || isNaN(startOfLastMonth.getTime())) {
            throw new Error('Erro ao calcular as datas. Uma ou mais datas são inválidas.');
        }
    
        try {
            // Buscar o registro de consumo do último mês
            const lastMonthConsumption = await this.consumerModel
                .findOne({
                    consumerId,
                    date: { $gte: startOfLastMonth, $lt: startOfThisMonth }
                })
                .exec();
    
                
                if (!lastMonthConsumption) {
                    return null; // Sem dados suficientes para gerar um alerta
                }
                console.log('Last Month Consumption:', lastMonthConsumption.waterConsumed);
    
            // Obter o consumo do mês atual
            const currentMonthConsumption = await this.consumerModel
                .findOne({
                    consumerId,
                    date: { $gte: startOfThisMonth }
                })
                .exec();
    
                
                if (!currentMonthConsumption) {
                    return null; // Sem consumo registrado no mês atual
                }
                console.log('Current Month Consumption:', currentMonthConsumption.waterConsumed);
    
            // Comparação: consumo atual maior que o do último mês
            if (currentMonthConsumption.waterConsumed > lastMonthConsumption.waterConsumed) {
                return 'Alerta: Consumo alto! O consumo deste mês é maior que o do mês passado.';
            }
    
            return null; // Sem alerta
        } catch (error) {
            console.error('Erro ao buscar consumos:', error);
            throw new Error('Erro ao buscar dados de consumo.');
        }
    }
    
    
    

    //DELETE
    async deleteConsumer(_id: number){
        const result = await this.consumerModel.deleteOne({_id: _id});
    }

}
