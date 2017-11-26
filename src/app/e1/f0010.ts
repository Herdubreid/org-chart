import { DatabrowserRequest, IFormResponse, IForm, IFormData, IRow, IValue } from 'e1-service';

export const F0010 = 'fs_DATABROWSE_F0010';

export interface IF0010Row extends IRow {
    F0010_CO: IValue;
    F0010_NAME: IValue;
}

export type IF0010FormData = IFormData<IF0010Row>;

export type IF0010Form = IForm<IF0010FormData>;

export interface IF0010Response extends IFormResponse {
    fs_DATABROWSE_F0010: IF0010Form;
}

export class F0010Request extends DatabrowserRequest {
    constructor() {
        super();
        this.targetName = 'F0010';
        this.targetType = 'table';
        this.dataServiceType = 'browse';
        this.findOnEntry = 'TRUE';
        this.returnControlIDs = 'CO|NAME';
    }
}
