import { useContext, useEffect } from "react";
import { GasoleoContext } from "../../context/GasoleoContext";
import { provincias } from "../../data/provincias";

export default function Form() {

    const {findDataByProvince, findDataByTown, filteredTowns, codTown} = useContext(GasoleoContext)

    const handleChangeProvince = (evt: { target: { value: string; }; }): void => {
        findDataByProvince(evt.target.value);
    }

    const handleChangeTown = (evt: { target: { value: string; }; }): void => {
        findDataByTown(evt.target.value);
    }


    return (
        <>
            <section>
                <form className="d-flex flex-column gap-3 justify-content-center align-items-center">
                    <select className="form-control w-auto" onChange={handleChangeProvince}>
                      {provincias.map(prov => {
                          return (
                          <>
                            <option key={prov.id} value={prov.id}>{prov.nm}</option>
                          </>
                          )
                      })}
                    </select>

                    <select className="form-control w-auto" onChange={handleChangeTown}>
                        <option value={'--'}>-- Selecciona localidad</option>
                      {filteredTowns.map((town: any) => {
                          return (
                          <>
                            <option selected={codTown === town.IDMunicipio} key={town.IDMunicipio} value={town.IDMunicipio}>{town.Municipio}</option>
                          </>
                          )
                      })}
                    </select>
                </form>
            </section>
        </>
    )
}