import { useContext } from "react"
import { FUEL_LIST } from "../../constants/constants";
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
                    {FUEL_LIST.map((el, index) => {
                        return (
                            <option key={index} value={index}>{el}</option>
                        )
                    })}
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