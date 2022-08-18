import { createContext, useEffect, useState } from "react";
import { localidades } from "../data/localidades";

export const GasoleoContext = createContext({
  isGeoLocationActive: false,
  setGeolocationActive: (bol: boolean): void => {},
  dataToShare: [],
  codProv: "04",
  codTown: "04",
  selectedOrderValue: "0",
  findDataByProvince: (v: string): void => {},
  findDataByTown: (v: string): void => {},
  sortAndFilterData: (order: string, dataProp?: any): void => {},
  filteredTowns: []
});

export function GasoleoContextProvider(props: any) {
  const [isGeoLocationActive, setGeolocationActive] = useState(false);
  const [data, setData] = useState([]);
  const [dataToShare, setDataToShare] = useState([]);
  const [codProv, setCodProv] = useState("04");
  const [codTown, setCodTown] = useState("04");
  const [filteredTowns, setFilteredTowns] = useState([])
  const [selectedOrderValue, setselectedOrderValue] = useState("0");

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
    let jsonData = dataProp || data;

    if (dataProp) setData(dataProp);

    setDataToShare(
      jsonData
        .filter((el) => el[arrayOrderStr[parseInt(order)]] !== "")
        .sort((a: any[], b: any[]) => {
          const number1 = parseFloat(
            a[arrayOrderStr[0] as any].replace(",", ".")
          );
          const number2 = parseFloat(
            b[arrayOrderStr[0] as any].replace(",", ".")
          );
          return number1 - number2;
        })
    );

    setselectedOrderValue(order);
  };

  const findDataByTown = (town: string) => {

    if (town === '--'){
      findDataByProvince(codProv)
      setCodTown(town)
      return
    }
    setCodTown(town)
    fetch(
      `https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres/FiltroMunicipio/${town}`
    ).then((result) => {
      result.json().then((r) => {
        sortAndFilterData(selectedOrderValue, r.ListaEESSPrecio);
      });
    });
  }

  const findDataByProvince = (prov: string) => {
    setCodProv(prov)
    fetch(
      `https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres/FiltroProvincia/${prov}`
    ).then((result) => {
      result.json().then((r) => {
        console.log(localidades, r)

      const filteredAux = localidades.filter((data: any) => {
          return r.ListaEESSPrecio.map((r: any) => r.IDMunicipio).includes(data.IDMunicipio)
        }).filter((d: any) => d.IDProvincia.slice(0,2) === prov);

        setFilteredTowns(filteredAux as [])
        sortAndFilterData(selectedOrderValue, r.ListaEESSPrecio);
      });
    });
  };

  return (
    <>
      <GasoleoContext.Provider
        value={{
          isGeoLocationActive,
          setGeolocationActive,
          dataToShare,
          codProv,
          codTown,
          findDataByProvince,
          findDataByTown,
          selectedOrderValue,
          sortAndFilterData,
          filteredTowns
        }}
      >
        {props.children}
      </GasoleoContext.Provider>
    </>
  );
}
