export class Order {

    items: any[];
    location: string;
    deliveryTime: string;
    contactPhone: number;
    itemsCost: number;
    totalCost: number;
    isStarted: boolean;
    workerId: string;
    userId: string;
    notes: string;
    //not db variables
    orderList: string;

    constructor() {

    }
}