export const exactCard = {
  object: 'card',
  name: 'Lightning Bolt',
  mana_cost: '{R}',
  type_line: 'Instant',
  oracle_text: 'Lightning Bolt deals 3 damage to any target.',
  set_name: 'Magic 2010',
  rarity: 'common',
  image_uris: {
    normal: 'https://img.example/lightning-bolt.jpg',
  },
};

export const fuzzyCard = {
  ...exactCard,
  name: 'Llanowar Elves',
  mana_cost: '{G}',
  type_line: 'Creature — Elf Druid',
  oracle_text: '{T}: Add {G}.',
};

export const multiFaceCard = {
  object: 'card',
  name: 'Delver of Secrets // Insectile Aberration',
  set_name: 'Innistrad',
  rarity: 'common',
  card_faces: [
    {
      name: 'Delver of Secrets',
      mana_cost: '{U}',
      type_line: 'Creature — Human Wizard',
      oracle_text: 'At the beginning of your upkeep, look at the top card of your library.',
      image_uris: { normal: 'https://img.example/delver-front.jpg' },
    },
    {
      name: 'Insectile Aberration',
      mana_cost: null,
      type_line: 'Creature — Human Insect',
      oracle_text: 'Flying',
      image_uris: { normal: 'https://img.example/delver-back.jpg' },
    },
  ],
};

export const imageLessCard = {
  ...exactCard,
  image_uris: undefined,
};

export const invalidCardPayload = {
  object: 'error',
  details: 'This is not a card payload.',
};

export const notFoundPayload = {
  object: 'error',
  code: 'not_found',
  details: 'No cards found matching that query.',
};
