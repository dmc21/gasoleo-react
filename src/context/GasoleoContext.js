import { createContext, useEffect, useState } from "react";

export const GasoleoContext = createContext();

export function GasoleoContextProvider(props) {

    const [isGeoLocationActive, setGeolocationActive] = useState(false);
    const [data, setData] = useState([]);
    const [codProv, setCodProv] = useState('04');
    const [selectedOrderValue, setselectedOrderValue] = useState("0");

    useEffect(() => {
        findDataByProvince()
    }, [codProv])

    const sortData = (order, dataProp = null) => {

        let jsonData = dataProp ? dataProp : data

        if (order === "0") {
            setData(jsonData.filter(el => el["Precio Gasoleo A"] !== "").sort((a, b) => {
                return parseFloat(a["Precio Gasoleo A"].replace(",", ".")) - parseFloat(b["Precio Gasoleo A"].replace(",", "."))
            }))
        }

        if (order === "1") { 
            setData(jsonData.filter(el => el["Precio Gasoleo Premium"] !== "").sort((a, b) => {
                return parseFloat(a["Precio Gasoleo Premium"].replace(",", ".")) - parseFloat(b["Precio Gasoleo Premium"].replace(",", "."))
            }))

        }

        if (order === "2") {
           setData(jsonData.filter(el => el["Precio Gasolina 95 E5"] !== "").sort((a, b) => {
                return parseFloat(a["Precio Gasolina 95 E5"].replace(",", ".")) - parseFloat(b["Precio Gasolina 95 E5"].replace(",", "."))
            }))
        }

        if (order === "3") {
            setData(jsonData.filter(el => el["Precio Gasolina 95 E5 Premium"] !== "").sort((a, b) => {
                return parseFloat(a["Precio Gasolina 95 E5 Premium"].replace(",", ".")) - parseFloat(b["Precio Gasolina 95 E5 Premium"].replace(",", "."))
            }))
        }

        setselectedOrderValue(order)

    }


    const findDataByProvince = () => {
        fetch(`https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres/FiltroProvincia/${codProv}`)
            .then(result => {
                result.json().then(r => {
                    let jsonData = r.ListaEESSPrecio
                    sortData(selectedOrderValue, jsonData)
                })
            })
    }


    return (
        <>
            <GasoleoContext.Provider value={{
                isGeoLocationActive,
                data,
                codProv,
                selectedOrderValue,
                setCodProv,
                setGeolocationActive,
                setselectedOrderValue,
                sortData
            }}>
                {props.children}
            </GasoleoContext.Provider>
        </>
    )
}