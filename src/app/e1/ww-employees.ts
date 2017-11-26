import { FormRequest, IAuthResponse, IFormResponse, IForm, IFormData, IRow, IValue } from 'e1-service';

export const W060116F = 'fs_P060116_W060116F';

export interface IWWEmployeesRow extends IRow {
    mnAddressNumber_29: IValue;
    sAlphaName_30: IValue;
    sCo_35: IValue;
    sHomeBusinessUnit_36: IValue;
    sJobTyp_42: IValue;
    sJobStep_43: IValue;
    chSh_47: IValue;
    dtDateStarted_53: IValue;
    mnSupervisor_57: IValue;
    sEEOJob_88: IValue;
    sShiftcode_89: IValue;
}

export interface IWWEmployeesFormData extends IFormData<IWWEmployeesRow> {
}

export type IWWEmployeesForm = IForm<IWWEmployeesFormData>;

export interface IWWEmployeesResponse extends IFormResponse {
    fs_P060116_W060116F: IWWEmployeesForm;
}

export class WWEmployeesRequest extends FormRequest {
    constructor() {
        super();
        this.formName = 'P060116_W060116F';
        this.version = 'ZJDE0001';
        this.formServiceAction = 'R';
        this.maxPageSize = '10000';
        this.findOnEntry = 'TRUE';
        this.returnControlIDs = '1[29,30,35,36,42,43,47,53,57,88,89]';
    }
}
