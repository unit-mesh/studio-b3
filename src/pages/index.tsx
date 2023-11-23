import Head from 'next/head'

import styles from '../../styles/Home.module.css'
import LiveEditor from '@/components/editor/live-editor'
import { Settings } from '@/components/settings'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>3B Editor - all you need is editor!</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div>
          <Settings />
          <LiveEditor />
        </div>
      </main>
    </div>
  );
}
