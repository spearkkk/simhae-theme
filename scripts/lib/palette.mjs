export const paletteKeys = Array.from(
  { length: 24 },
  (_, index) => `base${index.toString(16).toUpperCase().padStart(2, '0')}`,
);

export function validatePalette(data) {
  if (!data || data.name !== 'simhae' || !data.palettes?.[data.main]) {
    throw new Error('Invalid Simhae main palette');
  }

  for (const name of ['pelagic', 'trench', 'hadal', 'benthic']) {
    const palette = data.palettes[name];
    for (const key of paletteKeys) {
      if (!/^#[0-9a-f]{6}$/i.test(palette?.[key] ?? '')) {
        throw new Error(`Invalid ${name}.${key}`);
      }
    }

    if (Object.keys(palette).length !== paletteKeys.length) {
      throw new Error(`Unexpected keys in ${name}`);
    }
  }

  if (Object.keys(data.palettes).length !== 4) {
    throw new Error('Expected four palette variants');
  }

  return data;
}
