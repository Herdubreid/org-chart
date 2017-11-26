import { NgModule } from '@angular/core';
import {
    MatToolbarModule,
    MatTabsModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatDialogModule,
    MatProgressBarModule,
    MatTableModule,
    MatSortModule
} from '@angular/material';
/**
 * Material Modules
 */
@NgModule({
    imports: [
        MatToolbarModule,
        MatTabsModule,
        MatMenuModule,
        MatIconModule,
        MatButtonModule,
        MatInputModule,
        MatFormFieldModule,
        MatDialogModule,
        MatProgressBarModule,
        MatTableModule,
        MatSortModule
    ],
    exports: [
        MatToolbarModule,
        MatTabsModule,
        MatMenuModule,
        MatIconModule,
        MatButtonModule,
        MatInputModule,
        MatFormFieldModule,
        MatDialogModule,
        MatProgressBarModule,
        MatTableModule,
        MatSortModule
    ]
})
export class MaterialModule { }
