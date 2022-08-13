import { createContext, useEffect, useState } from "react";

export const GasoleoContext = createContext();

export function GasoleoContextProvider(props) {
  const [isGeoLocationActive, setGeolocationActive] = useState(false);
  const [data, setData] = useState([]);
  const [dataToShare, setDataToShare] = useState([]);
  const [codProv, setCodProv] = useState("04");
  const [selectedOrderValue, setselectedOrderValue] = useState("0");

  const arrayOrderStr = [
    "Precio Gasoleo A",
    "Precio Gasoleo Premium",
    "Precio Gasolina 95 E5",
    "Precio Gasolina 95 E5 Premium",
  ];

  useEffect(() => {
    findDataByProvince();
  }, [codProv]);

  const sortAndFilterData = (order, dataProp = null) => {
    let jsonData = dataProp || data;

    if (dataProp) setData(dataProp);

    setDataToShare(
      jsonData
        .filter((el) => el[arrayOrderStr[parseInt(order)]] !== "")
        .sort((a, b) => {
          return (
            parseFloat(a[arrayOrderStr[parseInt(order)]].replace(",", ".")) -
            parseFloat(b[arrayOrderStr[parseInt(order)]].replace(",", "."))
          );
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
