import { useContext, useEffect } from "react";
import { GasoleoContext } from "../../context/GasoleoContext";
import { provincias } from "../../data/provincias";

export default function Form(props) {


    const {setCodProv} = useContext(GasoleoContext)

    useEffect(() => {
        console.log("Initialize Form component")
    }, [])


    return (
        <>
            <section>
                <form>
                    <select className="form-control w-auto" onChange={(evt) => setCodProv(evt.target.value)}>
                      {provincias.map(prov => {
                          return (
                          <>
                            <option key={prov.id} value={prov.id}>{prov.nm}</option>
                          </>
                          )
                      })}
                    </select>
                </form>
            </section>
        </>
    )
}