import { createContext, useEffect, useState } from "react";

export const GasoleoContext = createContext({
  isGeoLocationActive: false,
  setGeolocationActive : (bol: boolean): void => {},
  dataToShare: [],
  codProv: '04',
  selectedOrderValue: "0",
  setCodProv: (v: string): void => {},
  sortAndFilterData: (order: string, dataProp?: any): void  => {}
});

export function GasoleoContextProvider(props: any) {
  const [isGeoLocationActive, setGeolocationActive] = useState(false);
  const [data, setData] = useState([]);
  const [dataToShare, setDataToShare] = useState([]);
  const [codProv, setCodProv] = useState("04");
  const [selectedOrderValue, setselectedOrderValue] = useState("0");

  const arrayOrderStr: string [] = [
    "Precio Gasoleo A",
    "Precio Gasoleo Premium",
    "Precio Gasolina 95 E5",
    "Precio Gasolina 95 E5 Premium",
  ];

  useEffect(() => {
    findDataByProvince();
  }, [codProv]);

  const sortAndFilterData = (order: string, dataProp = null) => {
    let jsonData = dataProp || data;

    if (dataProp) setData(dataProp);

    setDataToShare(
      jsonData
        .filter((el) => el[arrayOrderStr[parseInt(order)]] !== "")
        .sort((a: any [], b: any []) => {
          const number1 =  parseFloat((a[arrayOrderStr[0] as any]).replace(",", "."))
          const number2 =  parseFloat((b[arrayOrderStr[0] as any]).replace(",", "."))
          return number1 - number2
        })
    );

    setselectedOrderValue(order);
  };

  const findDataByProvince = () => {
    fetch(
      `https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres/FiltroProvincia/${codProv}`
    ).then((result) => {
      result.json().then((r) => {
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
          setCodProv,
          selectedOrderValue,
          sortAndFilterData,
        }}
      >
        {props.children}
      </GasoleoContext.Provider>
    </>
  );
}
