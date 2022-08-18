import { useContext } from "react"
import { GasoleoContext } from "../../context/GasoleoContext"
import './Navbar.css'

export default function Navbar() {

    const {sortAndFilterData} = useContext(GasoleoContext);

    const handleChangeSort = (evt: { target: { value: any; }; }) => {
        sortAndFilterData(evt.target.value)
    }

    return (
        <>
            <nav className="d-flex justify-content-between p-3 bg-navbar">
                <select onChange={handleChangeSort} className="form-control w-auto">
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