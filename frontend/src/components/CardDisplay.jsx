function CardImage({ image, name }) {
  if (image) {
    return <img src={image} alt={name || 'Magic card'} className="card-image" />;
  }

  return (
    <div className="card-image-placeholder" role="img" aria-label={`Image unavailable for ${name || 'this card'}`}>
      <span>NO IMAGE SIGNAL</span>
      <small>MTG NOIR ARCHIVE</small>
    </div>
  );
}

function CardDetails({ card, headingLevel = 'h2', showMetadata = false }) {
  const Heading = headingLevel;

  return (
    <div className="card-details">
      <div className="card-title-row">
        <Heading>{card.name || 'Unknown card'}</Heading>
        {card.manaCost && <p className="mana-cost">{card.manaCost}</p>}
      </div>
      {card.typeLine && <p className="type-line">{card.typeLine}</p>}
      {card.oracleText && <p className="oracle-text">{card.oracleText}</p>}
      {showMetadata && (
        <dl className="card-metadata">
          <div>
            <dt>Set</dt>
            <dd>{card.set || '—'}</dd>
          </div>
          <div>
            <dt>Rarity</dt>
            <dd>{card.rarity || '—'}</dd>
          </div>
        </dl>
      )}
    </div>
  );
}

function CardDisplay({ card }) {
  const faces = Array.isArray(card.faces) ? card.faces : [];

  return (
    <article className="card-display">
      <div className="card-primary">
        <div className="card-image-container">
          <CardImage image={card.image} name={card.name} />
        </div>
        <div>
          <p className="panel-kicker">RETRIEVED RECORD</p>
          <CardDetails card={card} showMetadata />
        </div>
      </div>

      {faces.length > 0 && (
        <section className="card-faces" aria-label="Card faces">
          <p className="panel-kicker">FACE DATA // {String(faces.length).padStart(2, '0')}</p>
          <div className="card-face-list">
            {faces.map((face, index) => (
              <article className="card-face" key={`${face.name || 'face'}-${index}`}>
                <div className="card-image-container card-face-image">
                  <CardImage image={face.image} name={face.name} />
                </div>
                <div>
                  <p className="face-index">FACE {String(index + 1).padStart(2, '0')}</p>
                  <CardDetails card={face} headingLevel="h3" />
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}

export default CardDisplay;
