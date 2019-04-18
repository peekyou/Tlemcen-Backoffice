import { NgModule } from '@angular/core';
import {
    MatButtonModule,
    MatButtonToggleModule,
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
    MatSelectModule,
    MatSnackBarModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
    MatTabsModule,
    MatSlideToggleModule,
    MAT_DATE_LOCALE,
    MAT_DATE_FORMATS,
    MAT_NATIVE_DATE_FORMATS,
    DateAdapter
} from '@angular/material';

// import { AppDateAdapter, APP_DATE_FORMATS} from '../helpers/date.adapter';
import { MomentDateAdapter, MOMENT_DATE_FORMATS } from '../helpers/date.adapter';

@NgModule({
    exports: [
        MatButtonModule,
        MatButtonToggleModule,
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
        MatSelectModule,
        MatSnackBarModule,
        MatProgressBarModule,
        MatProgressSpinnerModule,
        MatExpansionModule,
        MatTabsModule,
        MatSlideToggleModule,
    ],
    declarations: [],
    providers: [
        { provide: MAT_DATE_LOCALE, useValue: 'fr-FR' },
        { provide: MAT_DATE_FORMATS, useValue: MOMENT_DATE_FORMATS },
        { provide: DateAdapter, useClass: MomentDateAdapter },
    ]
    
})
export class AppMaterialModules { }