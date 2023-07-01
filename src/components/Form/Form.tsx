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
            <section className="d-flex flex-column gap-3">
                <article className="d-flex">
                    <button className="btn btn-primary" onClick={handleLoadView}>{view === GasoleoViews.LIST ? 'Ver mapa' : 'Ver lista'}</button>
                </article>
                <form className="d-flex flex-column gap-3 justify-content-center align-items-center">
                    <select value={codProv} className="form-control w-auto" onChange={handleChangeProvince}>
                    <option value={'--'}>-- Selecciona Provincia</option>
                      {provincias.map((prov, index) => {
                          return (
                          <>
                            <option key={index} value={prov.id}>{prov.nm}</option>
                          </>
                          )
                      })}
                    </select>

                    <select value={codTown} className="form-control w-auto" onChange={handleChangeTown}>
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