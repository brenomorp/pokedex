import React from 'react';
import { Poppins } from 'next/font/google';

const poppins = Poppins({
  subsets: ['latin'],
  weight: '700',
  variable: '--font-poppins',
});

function Title({ text }) {
  return (
    <h1
      className={`text-3xl text-white lg:text-5xl ${poppins.variable} font-sans`}
    >
      {text}
    </h1>
  );
}

export default Title;
