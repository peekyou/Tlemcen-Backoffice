import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';


import { Lookup } from '../models/lookup.model';

@Injectable()
export class LookupService {
    private countries: Lookup[];
    private languages: Lookup[];
    private statesByCountry: any = {};
    private citiesByCountry: any = {};
    private areasByCountry: any = {};
    
    constructor(private http: HttpClient) { 
    }

    fetchStates(countryCode: string): Observable<Lookup[]> {
        if (this.statesByCountry && this.statesByCountry[countryCode]) {
            return of(this.statesByCountry[countryCode]);
        }
        return this.http.get('/assets/lang/states/' + countryCode + '.json')
            .pipe(map((res: any[]) => {
                return this.statesByCountry[countryCode] = res.map<Lookup>(c => new Lookup(c.id, c.name));
            }));
    }

    fetchCities(countryCode: string): Observable<Lookup[]> {
        if (this.citiesByCountry && this.citiesByCountry[countryCode]) {
            return of(this.citiesByCountry[countryCode]);
        }
        return this.http.get('/assets/lang/cities/' + countryCode + '.json')
            .pipe(map((res: any[]) => {
                return this.citiesByCountry[countryCode] = res.map<Lookup>(c => {
                    var id = c.id ? c.id : c.name;
                    var name = c.zipcode ? c.zipcode + ' - ' + c.name : c.name;
                    return new Lookup(id, name, c.parent);
                });
            }));
    }

    fetchAreas(countryCode: string): Observable<Lookup[]> {
        if (this.areasByCountry && this.areasByCountry[countryCode]) {
            return of(this.areasByCountry[countryCode]);
        }
        return this.http.get('/assets/lang/areas/' + countryCode + '.json')
            .pipe(map((res: any[]) => {                    
                return this.areasByCountry[countryCode] = res.map<Lookup>(c => new Lookup(c.id, c.name, c.parent));
            }));
    }
}