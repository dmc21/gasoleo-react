import { useContext, useEffect } from "react";
import { GasoleoContext } from "../../context/GasoleoContext";
import { provincias } from "../../data/provincias";
import { GasoleoViews } from "../../context/enums/GasoleoViews";

export default function Form() {

    const {findDataByProvince, findDataByTown, updateView , view,  filteredTowns, codTown, codProv} = useContext(GasoleoContext)

    const handleChangeProvince = (evt: { target: { value: string; }; }): void => {
        findDataByProvince(evt.target.value);
    }

    const handleChangeTown = (evt: { target: { value: string; }; }): void => {
        findDataByTown(evt.target.value);
    }

    const handleLoadView = () => {

        if (view === GasoleoViews.LIST)
            updateView(GasoleoViews.MAP)
        else
            updateView(GasoleoViews.LIST)
    }


    return (
        <>
            <section className="p-5 flex flex-col gap-3">
                <article className="flex w-full">
                    <button className="w-full rounded-md p-3 bg-slate-400 text-white" onClick={handleLoadView}>{view === GasoleoViews.LIST ? 'Ver mapa' : 'Ver lista'}</button>
                </article>
                <form className="flex flex-col gap-3 justify-content-center align-items-center">
                    <select value={codProv} className="form-control w-auto p-3" onChange={handleChangeProvince}>
                    <option value={'--'}>-- Selecciona Provincia</option>
                      {provincias.map((prov, index) => {
                          return (
                          <>
                            <option key={index} value={prov.id}>{prov.nm}</option>
                          </>
                          )
                      })}
                    </select>

                    <select value={codTown} className="form-control w-auto p-3" onChange={handleChangeTown}>
                        <option value={'--'}>-- Selecciona localidad</option>
                      {filteredTowns.map((town: any, index: number) => {
                          return (
                          <>
                            <option key={index} value={town.IDMunicipio}>{town.Municipio}</option>
                          </>
                          )
                      })}
                    </select>
                </form>
            </section>
        </>
    )
}