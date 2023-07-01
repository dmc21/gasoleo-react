import { useContext, useEffect, useState } from "react";
import { GasoleoContext } from "../../context/GasoleoContext";
import "./Result.css";

export default function Result() {
  const { dataToShare, selectedOrderValue, loading } = useContext(GasoleoContext);

  const [paginator, setPaginator] = useState({
    total: 0,
    pages: 0,
    actualPage: 0,
    limit: 9,
  });

  useEffect(() => {
    setPaginator({
      total: dataToShare.length,
      pages: Math.ceil(dataToShare.length / 9),
      actualPage: 0,
      limit: 9,
    });
  }, [dataToShare]);

  const updatePaginator = (index: number) => {
    setPaginator((prevState) => ({
      ...prevState,
      actualPage: index,
    }));
  };

  if (loading)
    return (
      <section className="d-flex justify-content-center align-items-center">
          <div className="lds-ripple"><div></div><div></div></div>
      </section>
    )

  return (
    <>
    <section className="d-flex flex-column gap-2">
      <section className="d-flex justify-content-between">
        <h1>Total: {dataToShare ? dataToShare.length : ""}</h1>
      </section>
    

<section className="grid mb-3">
  {dataToShare
    .slice(
      paginator.actualPage * paginator.limit,
      (paginator.actualPage + 1) * paginator.limit
    )
    .map((el: any, index) => {
      return (
        <>
          <article className="g-col-2 card" key={index}>
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
                <span>{el.Horario}</span>
              </article>

              {selectedOrderValue === "0" ? (
                <article className="d-flex gap-2 align-items-center">
                  <span className="m-0">Gasoleo A:</span>
                  <h5>{el["Precio Gasoleo A"]}€</h5>
                </article>
              ) : null}

              {selectedOrderValue === "1" ? (
                <article className="d-flex gap-2 align-items-center">
                  <span className="m-0">Gasoleo A Premium:</span>
                  <h5>{el["Precio Gasoleo Premium"]}€</h5>
                </article>
              ) : null}

              {selectedOrderValue === "2" ? (
                <article className="d-flex gap-2 align-items-center">
                  <span className="m-0">Gasolina 95:</span>
                  <h5>{el["Precio Gasolina 95 E5"]}€</h5>
                </article>
              ) : null}

              {selectedOrderValue === "3" ? (
                <article className="d-flex gap-2 align-items-center">
                  <span className="m-0">Gasolina 95 Premium</span>
                  <h5>{el["Precio Gasolina 95 E5 Premium"]}€</h5>
                </article>
              ) : null}
            </section>
          </article>
        </>
      );
    })}
</section>

<section className="d-flex gap-2 flex-wrap justify-content-center mb-4">
  {Array.apply(null, Array(paginator.pages)).map((el, index) => {
    return (
      <article
        className={index === paginator.actualPage ? "box selected" : "box"}
        key={index}
        onClick={() => updatePaginator(index)}
      >
        <span>{index + 1}</span>
      </article>
    );
  })}
</section>
    </section>

    </>
  );
}
