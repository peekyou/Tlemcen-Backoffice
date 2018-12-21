import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { Lookup } from '../models/lookup.model';

@Injectable()
export class LookupService {
    private knewAgency: Lookup[];
    private relationships: Lookup[];
    private professions: Lookup[];
    private countries: Lookup[];
    private languages: Lookup[];
    private statesByCountry: any = {};
    private citiesByCountry: any = {};
    private areasByCountry: any = {};
    
    constructor(private http: HttpClient) {
        // this.fetchCities('fr').subscribe(res => { });
    }

    fetchProfessions(lang: string): Observable<Lookup[]> {
        if (this.professions) {
            return of(this.professions);
        }
        return this.http.get('/assets/lang/professions/' + lang + '.json')
            .pipe(map((res: any[]) => {
                return this.professions = res.map<Lookup>(l => new Lookup(l.id, l.name));
            }));
    }

    fetchCountries(lang: string): Observable<Lookup[]> {
        if (this.countries) {
            return of(this.countries);
        }
        return this.http.get('/assets/lang/countries/' + lang + '.json')
            .pipe(map((res: any[]) => {
                return this.countries = res.map<Lookup>(c => new Lookup(c.code, c.name));
            }));
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

    fetchRelationships(lang: string): Observable<Lookup[]> {
        if (this.relationships) {
            return of(this.relationships);
        }
        return this.http.get('/assets/lang/relationships/' + lang + '.json')
            .pipe(map((res: any[]) => {
                return this.relationships = res.map<Lookup>(l => new Lookup(l.id, l.name));
            }));
    }

    fetchKnewAgency(lang: string): Observable<Lookup[]> {
        if (this.knewAgency) {
            return of(this.knewAgency);
        }
        return this.http.get('/assets/lang/heardof/' + lang + '.json')
            .pipe(map((res: any[]) => {
                return this.knewAgency = res.map<Lookup>(l => new Lookup(l.id, l.name));
            }));
    }
}