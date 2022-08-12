import { useContext } from "react"
import { GasoleoContext } from "../../context/GasoleoContext"

export default function Navbar(props) {

    const {sortData} = useContext(GasoleoContext);

    return (
        <>
            <nav className="d-flex justify-content-between p-3">
                <select onChange={(evt) => sortData(evt.target.value)} className="form-control w-auto">
                    <option value="0">Gasoleo A más barato primero</option>
                    <option value="1">Gasoleo Premium más barato primero</option>
                    <option value="2">Gasolina 95 más barato primero</option>
                    <option value="3">Gasolina Premium más barato primero</option>
                </select>
                <section className="d-flex gap-1">
                    <button className="btn btn-success">
                    <i className="fa-solid fa-location-arrow"></i>
                    </button>
                </section>
            </nav>
        </>
    )
}