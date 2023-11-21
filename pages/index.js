import Head from 'next/head';
import styles from '../styles/Home.module.css';
import LiveEditor from '../components/editor/live-editor'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>bb Editor - all you need is editor!</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div className={styles.editor}>
          <LiveEditor />
        </div>
      </main>
    </div>
  );
}
