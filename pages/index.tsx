import * as React from 'react';
import Link from 'next/link';
import { NextFunctionComponent } from 'next';

const IndexPage: NextFunctionComponent = () => {
  return (
    <section>
      <nav>
        <Link>
          <a href="category">Category</a>
        </Link>
      </nav>
      <h1>Hello Next.js 👋</h1>
    </section>
  );
};

export default IndexPage;
