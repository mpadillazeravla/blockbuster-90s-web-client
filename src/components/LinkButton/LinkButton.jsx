import "./LinkButton.css";
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const LinkButton = ({ to, children }) => {
  return (
    <Link to={to} className="back-button">
      <FaArrowLeft className="back-icon" />
      {children}
    </Link>
  );
};

export default LinkButton;
