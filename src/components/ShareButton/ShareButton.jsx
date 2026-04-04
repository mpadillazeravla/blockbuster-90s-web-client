import { useState } from "react";
import { FaShareAlt, FaCheck } from "react-icons/fa";
import "./ShareButton.css";

/**
 * variant="icon"   → botón icono solo (MovieCard)
 * variant="action" → botón con texto (MovieDetailView)
 * variant="modal"  → botón icono en cuadrícula del modal (AddMovieModal)
 */
const ShareButton = ({ movieId, movieTitle, variant = "icon" }) => {
  const [copied, setCopied] = useState(false);

  const handleShare = async (e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    const url = `${window.location.origin}/movie/${movieId}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: movieTitle,
          text: `🎬 "${movieTitle}" - Blockbuster 90s`,
          url,
        });
      } catch {
        // canceled by user
      }
    } else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (variant === "action") {
    return (
      <button
        className={`share-action-btn${copied ? " share-copied" : ""}`}
        onClick={handleShare}
        title={copied ? "¡Enlace copiado!" : "Compartir película"}
      >
        {copied ? <FaCheck /> : <FaShareAlt />}
        <span>{copied ? "¡Enlace copiado!" : "Compartir"}</span>
      </button>
    );
  }

  if (variant === "modal") {
    return (
      <button
        className={`share-modal-btn${copied ? " share-copied" : ""}`}
        onClick={(e) => handleShare(e)}
        title={copied ? "¡Enlace copiado!" : "Compartir"}
      >
        {copied ? <FaCheck /> : <FaShareAlt />}
      </button>
    );
  }

  return (
    <button
      className={`share-icon-btn${copied ? " share-copied" : ""}`}
      onClick={handleShare}
      aria-label={copied ? "¡Enlace copiado!" : "Compartir"}
      title={copied ? "¡Enlace copiado!" : "Compartir"}
    >
      {copied ? <FaCheck /> : <FaShareAlt />}
    </button>
  );
};

export default ShareButton;
