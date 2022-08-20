import { createContext, useEffect, useReducer } from "react";
import { localidades } from "../data/localidades";
import { Actions } from "./enums/GasoleoActions";
import { gasoleoReducer } from "./GasoleoReducer";
import { GasoleoState } from "./interfaces/GasoleoState";

export const GasoleoContext = createContext({
  ...GasoleoState(),
  findDataByProvince: (prov:string): void => {},
  findDataByTown: (order: string, dataProp?: any): void => {},
  sortAndFilterData: (town: string): void => {}
});

export function GasoleoContextProvider(props: any) {
  const [state, dispatch] = useReducer(gasoleoReducer, {
    ...GasoleoState()
  });

  const arrayOrderStr: string[] = [
    "Precio Gasoleo A",
    "Precio Gasoleo Premium",
    "Precio Gasolina 95 E5",
    "Precio Gasolina 95 E5 Premium",
  ];

  useEffect(() => {
    findDataByProvince("04");
  }, []);

  const sortAndFilterData = (order: string, dataProp = null) => {
    let jsonData = dataProp || state.data;

    if (dataProp) dispatch({ type: Actions.UPDATE_DATA, payload: dataProp });

    dispatch({
      type: Actions.UPDATE_DATA_TO_SHARE,
      payload: jsonData
        .filter((el: any) => el[arrayOrderStr[parseInt(order)]] !== "")
        .sort((a: any[], b: any[]) => {
          const number1 = parseFloat(
            a[arrayOrderStr[0] as any].replace(",", ".")
          );
          const number2 = parseFloat(
            b[arrayOrderStr[0] as any].replace(",", ".")
          );
          return number1 - number2;
        }),
    });

    dispatch({ type: Actions.UPDATE_ORDER_VALUE, payload: order });
  };

  const findDataByTown = (town: string) => {
    if (town === "--") {
      dispatch({ type: Actions.UPDATE_COD_PROV, payload: state.codProv });
      dispatch({ type: Actions.UPDATE_COD_TOWN, payload: state.codTown });
      return;
    }
    dispatch({ type: Actions.UPDATE_COD_TOWN, payload: state.codTown });
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

  return (
    <>
      <GasoleoContext.Provider
        value={{
          ...state,
          findDataByTown,
          findDataByProvince,
          sortAndFilterData
        }}
      >
        {props.children}
      </GasoleoContext.Provider>
    </>
  );
}
