import { useContext, useEffect, useState } from "react";
import { FUEL_LIST } from "../../constants/constants";
import { GasoleoContext } from "../../context/GasoleoContext";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import "./Navbar.css";

export default function Navbar() {
  const { sortAndFilterData, findBySpeechValue } = useContext(GasoleoContext);

  const startListening = () =>
    SpeechRecognition.startListening({ continuous: true });

  const stopListening = () => SpeechRecognition.stopListening();

  const handleChangeSort = (evt: { target: { value: any } }) => {
    sortAndFilterData(evt.target.value);
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
          provincia = split[0];
          isCapital = split.some((word) => word === "capital");
        }

        stopListening();
        setEnabledGasolineiThor(false);
        findBySpeechValue(provincia, isCapital);
      },
    },

    {
      command: "Gasolineras baratas cerca de mi",
      callback: () => {
        // coger la ubicación
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

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  return (
    <>
      <nav className="d-flex justify-content-between p-3 bg-navbar">
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
        <section className="d-flex gap-1">
          <button className="btn btn-success">
            <i className="fa-solid fa-location-arrow"></i>
          </button>
        </section>
      </nav>
    </>
  );
}
