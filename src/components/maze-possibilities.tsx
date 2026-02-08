'use client';

type MazePossibilitiesProps = {
  width: number;
  height: number;
};

// Data from OEIS A007341 for T(n,n) - Number of spanning trees in n X n grid
const possibilitiesLookup: { [key: number]: string } = {
  2: '4',
  3: '192',
  4: '30,544',
  5: '1.89 Billion',
  6: '1.00 Trillion',
  7: '4.46 Quadrillion',
  8: '16.7 Quintillion',
  9: '52.5 Sextillion',
  10: '139 Septillion',
  11: '320 Octillion',
  12: '730 Nonillion',
  13: '1.6 Decillion',
  14: '3.6 Undecillion',
  15: '8.2 Duodecillion',
  16: '18 Tredecillion',
  17: '42 Quattuordecillion',
  18: '96 Quindecillion',
  19: '220 Sexdecillion',
  20: '500 Septendecillion',
};

function getPossibilityText(quadWidth: number, quadHeight: number): string {
  const size = Math.min(quadWidth, quadHeight);
  
  if (possibilitiesLookup[size]) {
    if (quadWidth !== quadHeight) {
      return `over ${possibilitiesLookup[size]}`;
    }
    return possibilitiesLookup[size];
  }

  if (size > 20) {
    return 'Astronomically Large';
  }

  return 'Thousands';
}

export function MazePossibilities({ width, height }: MazePossibilitiesProps) {
  const quadWidth = width / 2;
  const quadHeight = height / 2;
  const text = getPossibilityText(quadWidth, quadHeight);

  return (
    <p className="font-mono text-sm text-muted-foreground tracking-wider uppercase text-center mt-2">
      {`Unique Combinations: ~${text}`}
    </p>
  );
}
