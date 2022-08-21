import { createContext, useEffect, useReducer } from "react";
import { FUEL_LIST } from "../constants/constants";
import { localidades } from "../data/localidades";
import { provincias } from "../data/provincias";
import { Actions } from "./enums/GasoleoActions";
import { gasoleoReducer } from "./GasoleoReducer";
import { GasoleoState } from "./interfaces/GasoleoState";

export const GasoleoContext = createContext({
  ...GasoleoState(),
  findDataByProvince: (prov: string): void => {},
  findDataByTown: (order: string, dataProp?: any): void => {},
  sortAndFilterData: (town: string): void => {},
  findBySpeechValue: (provStr: string): void => {},
});

export function GasoleoContextProvider(props: any) {
  const [state, dispatch] = useReducer(gasoleoReducer, {
    ...GasoleoState(),
  });

  useEffect(() => {
    findDataByProvince("04");
  }, []);

  const sortAndFilterData = (order: string, dataProp = null) => {
    let jsonData = dataProp || state.data;

    if (dataProp) dispatch({ type: Actions.UPDATE_DATA, payload: dataProp });

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
    fetch(
      `https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres/FiltroProvincia/${prov}`
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

  const findBySpeechValue = (provStr: string) => {
    console.log("Context value!", provStr);
    const exactlyFind = localidades.find((d) => d.Municipio === provStr);
    if (exactlyFind) {
      const provCod = exactlyFind.IDProvincia;
      const townCod = exactlyFind.IDMunicipio;

      const filteredAux = localidades
        .filter((data: any) => {
          return provincias.map((r: any) => r.id).includes(data.IDProvincia);
        })
        .filter((d: any) => d.IDProvincia.slice(0, 2) === provCod);

      dispatch({ type: Actions.UPDATE_FILTERED_TOWNS, payload: filteredAux });

      dispatch({ type: Actions.UPDATE_COD_PROV, payload: provCod });
      findDataByTown(townCod);
    }
  };

  return (
    <>
      <GasoleoContext.Provider
        value={{
          ...state,
          findDataByTown,
          findDataByProvince,
          sortAndFilterData,
          findBySpeechValue,
        }}
      >
        {props.children}
      </GasoleoContext.Provider>
    </>
  );
}
