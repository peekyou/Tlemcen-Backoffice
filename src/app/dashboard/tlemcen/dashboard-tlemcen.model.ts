export class DashboardModel {
    hajjs?: DashboardTravelModel[];
    omras?: DashboardTravelModel[];

    constructor() {
        this.hajjs = [];
        this.omras = [];
    }
}

export class DashboardTravelModel {
    name?: string;
    pilgrims?: number;
    women?: number;
    men?: number;
    adults?: number;
    children?: number;
    infants?: number;
    hotels?: DashboardHotelModel[];
    flights?: DashboardFlightModel[];
}

export class DashboardHotelModel {
    pilgrims?: number;
    name?: string;
    city?: string;
}

export class DashboardFlightModel {
    pilgrims?: number;
    airline?: string;
    from?: string;
    to?: string;
}