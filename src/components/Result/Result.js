import { useContext, useEffect } from "react"
import { GasoleoContext } from "../../context/GasoleoContext"
import './Result.css';

export default function Result(props) {

    const { data, selectedOrderValue } = useContext(GasoleoContext);

    useEffect(() => {
        console.log("Initialize Result Component")
    }, [data])



    return (
        <>
            <h1>Total: {data ? data.length : ''}</h1>

            <section className="grid">
                {data.map(el => {
                    return (
                        <>
                            <article className="g-col-3 card">
                                <header className="card-header text-center">
                                    <h4>{el.Localidad}</h4>
                                </header>
                                <section className="card-body flex-column gap-2 justify-content-center align-items-center">

                                    <article className="d-flex gap-2 align-items-center">
                                        <span className="m-0">Dirección:</span>
                                        <h5>{el.Dirección}</h5>
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