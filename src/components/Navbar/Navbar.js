import { useContext } from "react"
import { GasoleoContext } from "../../context/GasoleoContext"
import './Navbar.css'

export default function Navbar(props) {

    const {sortAndFilterData} = useContext(GasoleoContext);

    return (
        <>
            <nav className="d-flex justify-content-between p-3 bg-navbar">
                <select onChange={(evt) => sortAndFilterData(evt.target.value)} className="form-control w-auto">
                    <option value="0">Gasoleo A</option>
                    <option value="1">Gasoleo Premium</option>
                    <option value="2">Gasolina 95</option>
                    <option value="3">Gasolina Premium</option>
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