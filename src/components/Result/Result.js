import { useContext, useEffect } from "react"
import { GasoleoContext } from "../../context/GasoleoContext"
import './Result.css';

export default function Result(props) {

    const { dataToShare, selectedOrderValue } = useContext(GasoleoContext);

    useEffect(() => {
        console.log("Initialize Result Component")
    }, [dataToShare])



    return (
        <>
            <h1>Total: {dataToShare ? dataToShare.length : ''}</h1>

            <section className="grid">
                {dataToShare.map(el => {
                    return (
                        <>
                            <article className="g-col-3 card">
                                <header className="card-header text-center">
                                    <h4>{el.Localidad}</h4>
                                </header>
                                <section className="card-body flex-column gap-2 justify-content-center align-items-center">

                                    <article className="d-flex gap-2 align-items-center">
                                        <span className="m-0">Dirección:</span>
                                        <span>{el.Dirección}</span>
                                    </article>

                                    <article className="d-flex gap-2 align-items-center">
                                        <span className="m-0">Gasolinera:</span>
                                        <h5>{el.Rótulo}</h5>
                                    </article>

                                    <article className="d-flex gap-2 align-items-center">
                                        <span className="m-0">Horario:</span>
                                        <span>{JSON.stringify(el.Horario)}</span>
                                    </article>

                                    {selectedOrderValue === "0" ? <article className="d-flex gap-2 align-items-center">
                                        <span className="m-0">Gasoleo A:</span>
                                        <h5>{el["Precio Gasoleo A"]}€</h5>
                                    </article> : null}

                                    {selectedOrderValue === "1" ? <article className="d-flex gap-2 align-items-center">
                                        <span className="m-0">Gasoleo A Premium:</span>
                                        <h5>{el["Precio Gasoleo Premium"]}€</h5>
                                    </article> : null}


                                    {selectedOrderValue === "2" ? <article className="d-flex gap-2 align-items-center">
                                        <span className="m-0">Gasolina 95:</span>
                                        <h5>{el["Precio Gasolina 95 E5"]}€</h5>
                                    </article> : null}


                                    {selectedOrderValue === "3" ? <article className="d-flex gap-2 align-items-center">
                                        <span className="m-0">Gasolina 95 Premium</span>
                                        <h5>{el["Precio Gasolina 95 E5 Premium"]}€</h5>
                                    </article> : null}

                                </section>
                            </article>

                        </>
                    )
                })}
            </section>



        </>
    )

}