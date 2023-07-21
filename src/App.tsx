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
    <main className="flex flex-col gap-3">
      <Navbar/>
      <section className="w-full self-center flex flex-col md:flex-row items-center md:items-start justify-center gap-3">
        <Form />
         {view === GasoleoViews.LIST ? <Result/> : <ResultMap/>}
      </section>
    </main>
  );
}
