import { ClipLoader } from "react-spinners";
import "./Spinner.css";

const Spinner = ({ message = "Cargando..." }) => {
  return (
    <div className="spinner-container">
      <ClipLoader color="#3f51b5" size={60} />
      <p className="spinner-message">{message}</p>
    </div>
  );
};

export default Spinner;
