import assert from 'node:assert/strict';
import test from 'node:test';
import { toCardResponse } from '../src/services/scryfall.js';
import { exactCard, imageLessCard, multiFaceCard } from './fixtures/scryfall.js';

test('normalizes a normal card with an empty faces array', () => {
  const card = toCardResponse(exactCard);

  assert.deepEqual(card, {
    name: 'Lightning Bolt',
    manaCost: '{R}',
    typeLine: 'Instant',
    oracleText: 'Lightning Bolt deals 3 damage to any target.',
    set: 'Magic 2010',
    rarity: 'common',
    image: 'https://img.example/lightning-bolt.jpg',
    faces: [],
  });
});

test('normalizes every multi-face card field while retaining top-level fallbacks', () => {
  const card = toCardResponse(multiFaceCard);

  assert.equal(card.name, 'Delver of Secrets // Insectile Aberration');
  assert.equal(card.manaCost, '{U}');
  assert.equal(card.typeLine, 'Creature — Human Wizard');
  assert.equal(card.oracleText, 'At the beginning of your upkeep, look at the top card of your library.');
  assert.equal(card.image, 'https://img.example/delver-front.jpg');
  assert.deepEqual(card.faces, [
    {
      name: 'Delver of Secrets',
      manaCost: '{U}',
      typeLine: 'Creature — Human Wizard',
      oracleText: 'At the beginning of your upkeep, look at the top card of your library.',
      image: 'https://img.example/delver-front.jpg',
    },
    {
      name: 'Insectile Aberration',
      manaCost: null,
      typeLine: 'Creature — Human Insect',
      oracleText: 'Flying',
      image: 'https://img.example/delver-back.jpg',
    },
  ]);
});

test('uses canonical Oracle text and represents omitted values as null', () => {
  const card = toCardResponse({
    object: 'card',
    name: 'Example Card',
    oracle_text: 'English Oracle text.',
    printed_text: 'Texto impreso localizado.',
  });

  assert.equal(card.oracleText, 'English Oracle text.');
  assert.equal(card.manaCost, null);
  assert.equal(card.typeLine, null);
  assert.equal(card.set, null);
  assert.equal(card.rarity, null);
  assert.equal(card.image, null);
  assert.deepEqual(card.faces, []);
});

test('keeps an image-less card renderable with a null image', () => {
  const card = toCardResponse(imageLessCard);

  assert.equal(card.image, null);
  assert.deepEqual(card.faces, []);
});
