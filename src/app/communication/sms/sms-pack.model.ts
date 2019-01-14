export class SmsPack {
    smsNumber: number;
    price: number;
    quota: number;

    constructor() {
        this.smsNumber = 500;
        this.quota = 0;
        this.price = 50;
    }
}