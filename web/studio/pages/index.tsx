import Head from 'next/head'

import "../styles/editor-styles.css"
import styles from '../styles/Home.module.css'
import {LiveEditor} from '@studio-b3/web-core'
import '@/i18n/i18n';

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Studio B3 - all you need is editor!</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div>
          <LiveEditor />
        </div>
      </main>
    </div>
  );
}
