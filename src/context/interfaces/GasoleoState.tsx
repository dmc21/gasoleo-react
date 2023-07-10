import { GasoleoViews } from "../enums/GasoleoViews"
import { InterfazDelEstado } from "./InterfazDelEstado"

export interface GasoleoStateInterface {
    isGeoLocationActive: boolean,
    dataToShare: InterfazDelEstado[],
    data: [],
    codProv: string,
    codTown: string,
    selectedOrderValue: string,
    filteredTowns: [],
    loading: boolean,
    view: GasoleoViews,
}

export const GasoleoState = (): GasoleoStateInterface => {
    return {
        isGeoLocationActive: false,
        dataToShare: [],
        data: [],
        codProv: "04",
        codTown: "--",
        selectedOrderValue: "0",
        filteredTowns: [],
        loading: false,
        view: GasoleoViews.LIST
    }
}