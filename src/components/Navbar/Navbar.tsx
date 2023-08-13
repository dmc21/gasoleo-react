import { useContext, useEffect, useState } from "react";
import { FUEL_LIST } from "../../constants/constants";
import { GasoleoContext } from "../../context/GasoleoContext";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import "./Navbar.css";

export default function Navbar() {
  const { sortAndFilterData, findBySpeechValue, toggleLoading, toggleGeolocation, findDataByCoords, geolocation, findDataByProvince, codProv } = useContext(GasoleoContext);

  const startListening = () =>
    SpeechRecognition.startListening({ continuous: true });

  const stopListening = () => SpeechRecognition.stopListening();

  const handleChangeSort = (evt: { target: { value: any } }) => {
    toggleLoading(true)
    
    setTimeout(() => {
      sortAndFilterData(evt.target.value);
    },500)
    
  };

  const [enabledGasolineiThor, setEnabledGasolineiThor] = useState(false);

  const commands = [
    {
      command: ["Gasolineras baratas en *", "Gasolineras en *"],
      callback: (text: string) => {
        const split = text.split(" ");
        let isCapital = false;
        let provincia = text;

        if (split.length > 1) {
          provincia = split.filter(word => word !== 'capital').join(' ')
          isCapital = split.some((word) => word === "capital");
        }

        stopListening();
        setEnabledGasolineiThor(false);
        findBySpeechValue(provincia, isCapital);
      },
    },
  ];

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition({ commands });

  const handleButtonClick = () => {
    if (!enabledGasolineiThor) startListening();
    else stopListening();

    setEnabledGasolineiThor((prev) => !prev);
  };

  const toggleGeo = () => {
    const geo = !geolocation

    if (geo) {
      navigator.geolocation.getCurrentPosition(info => {
        const {latitude, longitude} = info.coords;
        toggleGeolocation(geo, latitude, longitude)
        findDataByCoords({latitude, longitude})
      }, err => {
        toggleGeolocation(false, null, null)
      })
    } else {
      findDataByProvince(codProv);
      toggleGeolocation(false, null, null)
    }

  }

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  return (
    <>
      <nav className="flex justify-between p-3 bg-navbar">
        <button
          className={
            enabledGasolineiThor
              ? "btn-microphone btn-active"
              : "btn-microphone"
          }
          onClick={handleButtonClick}
        >
          <span
            className={
              enabledGasolineiThor
                ? "fa fa-microphone"
                : "fa fa-microphone-slash"
            }
          ></span>
        </button>

        <select onChange={handleChangeSort} className="form-control w-auto">
          {FUEL_LIST.map((el, index) => {
            return (
              <option key={index} value={index}>
                {el}
              </option>
            );
          })}
        </select>
        <section className="flex">
          <button className=" rounded-full border border-black px-3 bg-slate-900" onClick={toggleGeo}>
            
            <i className={geolocation ? 'animate-bounce fa-solid fa-location-arrow text-green-500' : 'fa-solid fa-location-arrow text-green-200'}></i>  
             </button>
        </section>
      </nav>
    </>
  );
}

