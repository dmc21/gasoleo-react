export interface GasoleoStateInterface {
    isGeoLocationActive: boolean,
    dataToShare: [],
    data: [],
    codProv: string,
    codTown: string,
    selectedOrderValue: string,
    filteredTowns: [],
    loading: boolean
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
        loading: false
    }
}