import React, { useContext } from "react";
import "./App.css";
import Form from "./components/Form/Form";
import Navbar from "./components/Navbar/Navbar";
import Result from "./components/Result/Result";
import { GasoleoContext } from "./context/GasoleoContext";
import { GasoleoViews } from "./context/enums/GasoleoViews";
import ResultMap from "./components/Result/ResultMap";

export function App() {

  const {view} = useContext(GasoleoContext)


  return (
    <main className="d-flex flex-column gap-3">
      <Navbar/>
      <section className="container d-flex justify-content-center gap-3">
        <Form />
         {view === GasoleoViews.LIST ? <Result/> : <ResultMap/>}
      </section>
    </main>
  );
}
