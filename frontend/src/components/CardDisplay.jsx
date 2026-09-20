function CardDisplay({ card }) {
  return (
    <article className="card-display">
      <div className="card-image-container">
        {card.image ? (
          <img src={card.image} alt={card.name} className="card-image" />
        ) : (
          <p>Imagen no disponible.</p>
        )}
      </div>

      <div className="card-details">
        <p className="panel-kicker">RETRIEVED RECORD</p>
        <div className="card-title-row">
          <h2>{card.name}</h2>
          {card.manaCost && <p className="mana-cost">{card.manaCost}</p>}
        </div>
        <p className="type-line">{card.typeLine}</p>
        {card.oracleText && <p className="oracle-text">{card.oracleText}</p>}
        <dl className="card-metadata">
          <div>
            <dt>Set</dt>
            <dd>{card.set}</dd>
          </div>
          <div>
            <dt>Rarity</dt>
            <dd>{card.rarity}</dd>
          </div>
        </dl>
      </div>
    </article>
  );
}

export default CardDisplay;
