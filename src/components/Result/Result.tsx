import { useContext, useEffect, useState } from "react";
import { GasoleoContext } from "../../context/GasoleoContext";
import "./Result.css";
import Pagination from 'react-js-pagination'

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

  const updatePaginator = (selected: number) => {


  setPaginator((prevState) => ({
      ...prevState,
      actualPage: selected,
    }));
  };

  if (loading)
    return (
      <section className="flex justify-center items-center">
          <div className="lds-ripple"><div></div><div></div></div>
      </section>
    )

  return (
    <>
    <section className="flex flex-col gap-2">
      <section className="flex justify-content-between">
        <h1>Total: {dataToShare ? dataToShare.length : ""}</h1>
      </section>
    

<section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-3">
  {dataToShare
    .slice(
      paginator.actualPage * paginator.limit,
      (paginator.actualPage + 1) * paginator.limit
    )
    .map((el: any, index) => {
      return (
        <>
          <article className="rounded-md w-[225px] flex flex-col gap-3 bg-hp-white border-2 shadow-2xl p-5" key={index}>
            <header className="card-header text-center">
              <h4 className="font-bold">{el.Localidad}</h4>
            </header>
            <section className="card-body flex h-full flex-col gap-2 justify-between items-center">

              <div className="flex flex-col gap-2">
              <article className="flex gap-2 items-center">
                <span className="text-sm">{el.Dirección}</span>
              </article>

              <article className="flex gap-2 items-center">
                <h5 className="text-sm">{el.Rótulo}</h5>
              </article>

              <article className="flex gap-2 items-center">
                <span className="text-sm">{el.Horario}</span>
              </article>
              </div>
             

              {selectedOrderValue === "0" ? (
                <article className="flex flex-col justify-center gap-2 items-center">
                  <h5 className="text-2xl">{el["Precio Gasoleo A"]}€</h5>
                </article>
              ) : null}

              {selectedOrderValue === "1" ? (
                <article className="flex flex-col justify-center gap-2 items-center">
                  <h5 className="text-2xl">{el["Precio Gasoleo Premium"]}€</h5>
                </article>
              ) : null}

              {selectedOrderValue === "2" ? (
                <article className="flex flex-col justify-center gap-2 items-center">
                  <h5 className="text-2xl">{el["Precio Gasolina 95 E5"]}€</h5>
                </article>
              ) : null}

              {selectedOrderValue === "3" ? (
                <article className="flex flex-col justify-center gap-2 items-center">
                  <h5 className="text-2xl">{el["Precio Gasolina 95 E5 Premium"]}€</h5>
                </article>
              ) : null}
            </section>
          </article>
        </>
      );
    })}
</section>

<section className="paginator mb-3">
<Pagination
          activePage={paginator.actualPage}
          itemsCountPerPage={10}
          totalItemsCount={paginator.total}
          pageRangeDisplayed={5}
          onChange={updatePaginator}
        />
</section>

    </section>

    </>
  );
}
