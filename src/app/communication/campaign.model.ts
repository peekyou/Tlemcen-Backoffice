export class Campaign {
    id?: string;
    name: string;
    status?: string;
    createdDate?: Date;
    fromDate?: Date;
    toDate?: Date;
    details?: string;
    nbSmsSent?: number;
    nbRecipients?: number;
    filter?: CampaignFilter;
    promotionType?: string;

    constructor() {
        this.filter = new CampaignFilter();
    }
}

export class CampaignFilter {
    customerId: string;
    travelId: string;
    purchaseAmountMin: number;
    purchaseAmountMax: number;
    customerGender: string;
    customerAgeFrom: number;
    customerAgeTo: number;
    customerSince: Date;
    lastEntryFrom: Date;
    lastEntryTo: Date;
    receivedPromotionId: string;
    didntReceivePromotionId: string;
    locationArray: string[];

    static createFromForm(form: any): CampaignFilter {
        if (!form) return null;
        return {
            customerId: form.customerName,
            travelId: form.travel,
            customerGender: CampaignFilter.getGenderFilter(form.customerGenderMale, form.customerGenderFemale),
            customerAgeFrom: form.customerAgeFrom,
            customerAgeTo: form.customerAgeTo,
            customerSince: form.customerSince,
            didntReceivePromotionId: form.didntReceivePromotion,
            lastEntryFrom: form.lastEntryFrom,
            lastEntryTo: form.lastEntryTo,
            purchaseAmountMax: form.purchaseAmountMax,
            purchaseAmountMin: form.purchaseAmountMin,
            receivedPromotionId: form.receivedPromotion,
            locationArray: form.location,
        };
    }

    private static getGenderFilter(maleFilter: boolean, femaleFilter: boolean): string {
        var genderFilter: string = '';
        if (maleFilter === true) genderFilter += 'M';
        if (femaleFilter === true) genderFilter += 'F';
        if (maleFilter === false && femaleFilter === false) genderFilter = null;
        return genderFilter;
    }
}