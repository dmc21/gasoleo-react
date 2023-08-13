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
    geolocation: boolean,
    view: GasoleoViews,
    coords: {latitude: number | null, longitude: number | null}
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
        geolocation: false,
        view: GasoleoViews.LIST,
        coords: {latitude: null, longitude: null}
    }
}