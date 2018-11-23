import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class TranslationService {
    private translations: any = {};

    constructor(private translate: TranslateService) {
    }

    public get(name: string, callback: (data: string) => void) {
        if (this.translations && this.translations[name]) {
            callback(this.translations[name]);
            return;
        }
        return this.translate.get(name).subscribe(res => {
            this.translations[name] = res;
            callback(res);
        });
    }

    public getMultiple(names: string[], callback: (data: any) => void) {
        if (this.translations && this.translate[names[0]]) {
            var res = {};
            names.forEach(n => {
                res[n] = this.translations[n];
            })
            callback(res);
            return;
        }
        return this.translate.get(names).subscribe(res => {
            this.translations = {...this.translations, ...res};
            callback(res);
        });
    }
}