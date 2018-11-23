import { NgModule } from '@angular/core';
import {
    MatButtonModule,
    MatIconModule,
    MatAutocompleteModule,
    MatInputModule,
    MatRippleModule,
    MatTooltipModule,
    MatRadioModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    MatCheckboxModule,
    MatDividerModule,
    MatListModule,
    MAT_DATE_LOCALE
} from '@angular/material';

@NgModule({
    exports: [
        MatButtonModule,
        MatIconModule,
        MatAutocompleteModule,
        MatInputModule,
        MatRippleModule,
        MatTooltipModule,
        MatRadioModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatDialogModule,
        MatCheckboxModule,
        MatDividerModule,
        MatListModule,
    ],
    declarations: [],
    providers: [{ provide: MAT_DATE_LOCALE, useValue: 'fr-FR' }]
    
})
export class AppMaterialModules { }