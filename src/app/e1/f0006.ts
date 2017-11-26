import { DatabrowserRequest, IFormResponse, IForm, IFormData, IRow, IValue } from 'e1-service';

export const F0006 = 'fs_DATABROWSE_F0006';

export interface IF0006Row extends IRow {
    F0006_MCU: IValue;
    F0006_CO: IValue;
    F0006_DL01: IValue;
    F0006_RMCU1: IValue;
}

export type IF0006FormData = IFormData<IF0006Row>;

export type IF0006Form = IForm<IF0006FormData>;

export interface IF0006Response extends IFormResponse {
    fs_DATABROWSE_F0006: IF0006Form;
}

export class F0006Request extends DatabrowserRequest {
    set RMCU1q(rmcu1s: string[]) {
        this.query = {
            condition: [
                {
                    value: rmcu1s.map(content => {
                        return {
                            content,
                            specialValueId: 'LITERAL'
                        };
                    }),
                    controlId: 'F0006.RMCU1',
                    operator: 'LIST'
                }
            ],
            autoFind: true,
            matchType: 'MATCH_ALL',
            autoClear: false
        };
    }
    set MCUq(mcus: string[]) {
        this.query = {
            condition: [
                {
                    value: mcus.map(content => {
                        return {
                            content,
                            specialValueId: 'LITERAL'
                        };
                    }),
                    controlId: 'F0006.MCU',
                    operator: 'LIST'
                }
            ],
            autoFind: true,
            matchType: 'MATCH_ALL',
            autoClear: false
        };
    }
    constructor() {
        super();
        this.targetName = 'F0006';
        this.targetType = 'table';
        this.dataServiceType = 'browse';
        this.returnControlIDs = 'MCU|CO|DL01|RMCU1';
    }
}
