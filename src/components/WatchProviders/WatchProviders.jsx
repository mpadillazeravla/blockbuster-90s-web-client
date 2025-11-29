import "./WatchProviders.css";

const LOGO_BASE_URL = "https://image.tmdb.org/t/p/original";

const WatchProviders = ({ providers }) => {
  if (!providers) {
    return (
      <div className="providers-container">
        <h3>Dónde verla</h3>
        <p className="no-providers">
          No hay información de disponibilidad para España
        </p>
      </div>
    );
  }

  const { flatrate, rent, buy } = providers;

  return (
    <>
      <h3 className="providers-title">Dónde verla</h3>
      <div className="providers-content">
        {flatrate && flatrate.length > 0 && (
          <div className="provider-section">
            <h4>Streaming</h4>
            <div className="provider-logos">
              {flatrate.map((provider) => (
                <div key={provider.provider_id} className="provider-item">
                  <img
                    src={`${LOGO_BASE_URL}${provider.logo_path}`}
                    alt={provider.provider_name}
                    className="provider-logo"
                    title={provider.provider_name}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {rent && rent.length > 0 && (
          <div className="provider-section">
            <h4>Alquiler</h4>
            <div className="provider-logos">
              {rent.map((provider) => (
                <div key={provider.provider_id} className="provider-item">
                  <img
                    src={`${LOGO_BASE_URL}${provider.logo_path}`}
                    alt={provider.provider_name}
                    className="provider-logo"
                    title={provider.provider_name}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {buy && buy.length > 0 && (
          <div className="provider-section">
            <h4>Compra</h4>
            <div className="provider-logos">
              {buy.map((provider) => (
                <div key={provider.provider_id} className="provider-item">
                  <img
                    src={`${LOGO_BASE_URL}${provider.logo_path}`}
                    alt={provider.provider_name}
                    className="provider-logo"
                    title={provider.provider_name}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default WatchProviders;
