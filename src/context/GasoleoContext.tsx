import { createContext, useEffect, useReducer } from "react";
import { FUEL_LIST } from "../constants/constants";
import { localidades } from "../data/localidades";
import { provincias } from "../data/provincias";
import { Actions } from "./enums/GasoleoActions";
import { gasoleoReducer } from "./GasoleoReducer";
import { GasoleoState } from "./interfaces/GasoleoState";
import { GasoleoViews } from "./enums/GasoleoViews";
import { InterfazDelEstado } from "./interfaces/InterfazDelEstado";

export const GasoleoContext = createContext({
  ...GasoleoState(),
  findDataByProvince: (prov: string): void => {},
  findDataByTown: (order: string, dataProp?: any): void => {},
  sortAndFilterData: (town: string): void => {},
  findBySpeechValue: (provStr: string, isCapital: boolean): void => {},
  updateView: (view: GasoleoViews): void => {},
  toggleLoading: (loading: boolean): void => {},
  toggleGeolocation: (geolocation: boolean, lat: number | null, long: number | null): void => {},
  findDataByCoords: (coords: {latitude: number, longitude: number}): void => {}
});

export function GasoleoContextProvider(props: any) {
  const [state, dispatch] = useReducer(gasoleoReducer, {
    ...GasoleoState(),
  });

  useEffect(() => {
    findDataByProvince("04");
  }, []);

  const toggleLoading = (loading: boolean) => {
    dispatch({ type: Actions.UPDATE_LOADING, payload: loading }); 
  }


  const toggleGeolocation = (geolocation: boolean, lat: number | null, long: number | null) => {
    dispatch({ type: Actions.TOGGLE_GEOLOCATION, payload: geolocation }); 
    dispatch({type: Actions.UPDATE_COORDS, payload: {latitude: lat, longitude: long}})
  }

  const sortAndFilterData = (order: string, dataProp: any = null) => {

    let jsonData = dataProp || state.data;

    if (dataProp) dispatch({ type: Actions.UPDATE_DATA, payload: dataProp });

    if (jsonData[0].Distancia) {

      dispatch({
        type: Actions.UPDATE_DATA_TO_SHARE,
        payload: jsonData
          .filter((el: any) => el[FUEL_LIST[parseInt(order)]] !== "")
          .sort((a: any, b: any) => {
            
            return a['Distancia'] - b['Distancia'];
          }),
      });

    } else {
      dispatch({
        type: Actions.UPDATE_DATA_TO_SHARE,
        payload: jsonData
          .filter((el: any) => el[FUEL_LIST[parseInt(order)]] !== "")
          .sort((a: any[], b: any[]) => {
            const number1 = parseFloat(a[FUEL_LIST[0] as any].replace(",", "."));
            const number2 = parseFloat(b[FUEL_LIST[0] as any].replace(",", "."));
            return number1 - number2;
          }),
      });
    }



    dispatch({ type: Actions.UPDATE_ORDER_VALUE, payload: order });
    dispatch({ type: Actions.UPDATE_LOADING, payload: false });
  };

  const findDataByTown = (town: string) => {
    if (town === "--") {
      findDataByProvince(state.codProv);
      dispatch({ type: Actions.UPDATE_COD_TOWN, payload: town });
      return;
    }
    dispatch({ type: Actions.UPDATE_COD_TOWN, payload: town });
    dispatch({ type: Actions.UPDATE_LOADING, payload: true });
    fetch(
      `https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres/FiltroMunicipio/${town}`
    ).then((result) => {
      result.json().then((r) => {
        sortAndFilterData(state.selectedOrderValue, r.ListaEESSPrecio);
      });
    });
  };

  const findDataByProvince = (prov: string) => {
    dispatch({ type: Actions.UPDATE_COD_PROV, payload: prov });
    dispatch({ type: Actions.UPDATE_LOADING, payload: true });

    const path = prov !== '--' ? `/FiltroProvincia/${prov}` : ''

    fetch(
      `https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres${path}`
    ).then((result) => {
      result.json().then((r) => {
        const filteredAux = localidades
          .filter((data: any) => {
            return r.ListaEESSPrecio.map((r: any) => r.IDMunicipio).includes(
              data.IDMunicipio
            );
          })
          .filter((d: any) => d.IDProvincia.slice(0, 2) === prov);

        dispatch({ type: Actions.UPDATE_FILTERED_TOWNS, payload: filteredAux });

        sortAndFilterData(state.selectedOrderValue, r.ListaEESSPrecio);
      });
    });
  };

  const findDataByCoords = (coords: {latitude: number, longitude: number}) => {
      dispatch({ type: Actions.UPDATE_LOADING, payload: true });
  
      const path = ''
  
      fetch(
        `https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres${path}`
      ).then((result) => {
        result.json().then((r) => {
          const filteredAux = r.ListaEESSPrecio
            .filter((data: InterfazDelEstado) => {
              const lat = Number(data.Latitud.replace(",", "."));
              const long =  Number(data["Longitud (WGS84)"].replace(",", "."))
              return getKilometros(coords.latitude, coords.longitude, lat, long) < 10
            })

            const finallyData = filteredAux.map((data: any) => {
              const lat = Number(data.Latitud.replace(",", "."));
              const long =  Number(data["Longitud (WGS84)"].replace(",", "."))
              data['Distancia'] = getKilometros(coords.latitude, coords.longitude, lat, long)
              return data
            })
  
          sortAndFilterData(state.selectedOrderValue, finallyData);
        });
      });
  }

  const findBySpeechValue = (provStr: string, isCapital: boolean) => {
    const exactlyFind = localidades.find((d) => d.Municipio === provStr);
    if (exactlyFind) {
      const provCod = exactlyFind.IDProvincia;
      let townCod = exactlyFind.IDMunicipio;

      const filteredAux = localidades
        .filter((data: any) => {
          return provincias.map((r: any) => r.id).includes(data.IDProvincia);
        })
        .filter((d: any) => d.IDProvincia.slice(0, 2) === provCod);

      dispatch({ type: Actions.UPDATE_FILTERED_TOWNS, payload: filteredAux });

      dispatch({ type: Actions.UPDATE_COD_PROV, payload: provCod });

      if (exactlyFind.Municipio.toLowerCase() === exactlyFind.Provincia.toLowerCase() && !isCapital){
        findDataByProvince(provCod)
        return
      }

      findDataByTown(townCod);
    }
  };

  const updateView = (view: GasoleoViews) => {
      dispatch({type: Actions.UPDATE_VIEW, payload: view})
  }

  const getKilometros = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const rad = function (x: number) { return x * Math.PI / 180; }
    const R = 6378.137; //Radio de la tierra en km
    const dLat = rad(lat2 - lat1);
    const dLong = rad(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLong / 2) * Math.sin(dLong / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return parseFloat(d.toFixed(1)); //Retorna tres decimales
  }

  return (
    <>
      <GasoleoContext.Provider
        value={{
          ...state,
          findDataByTown,
          findDataByProvince,
          sortAndFilterData,
          findBySpeechValue,
          updateView,
          toggleLoading,
          toggleGeolocation,
          findDataByCoords
        }}
      >
        {props.children}
      </GasoleoContext.Provider>
    </>
  );
}
