use std::fs;
use std::path::{Path, PathBuf};

use anyhow::Context;
use tantivy::schema::Schema;

use crate::doc_indexes::doc_schema::DocumentFile;

pub struct DocIndexes {
    pub doc: tantivy::Index,
}

impl DocIndexes {
    pub(crate) fn new() -> Self {
        let threads = std::thread::available_parallelism().unwrap().get();
        let index_dir = default_index_dir();

        let path = index_dir.join("doc");
        let index = Self::init_index(DocumentFile::new().schema, path.as_ref(), threads).unwrap();

        Self {
            doc: index
        }
    }
    fn init_index(schema: Schema, path: &Path, threads: usize) -> anyhow::Result<tantivy::Index> {
        fs::create_dir_all(path).context("failed to create index dir")?;

        let mut index =
            tantivy::Index::open_or_create(tantivy::directory::MmapDirectory::open(path)?, schema)?;
        let tokenizer = tantivy_jieba::JiebaTokenizer {};

        index.set_multithread_executor(threads)?;
        index
            .tokenizers()
            .register("jieba", tokenizer);

        Ok(index)
    }
}

fn default_index_dir() -> PathBuf {
    // macOS:~/Library/Application Support/org.unitmesh.b3
    // Linux: ~/.config/b3
    // Windows: C:\Users\<user>\AppData\Roaming\unitmesh\b3\config
    match directories::ProjectDirs::from("org", "unitmesh", "b3") {
        Some(dirs) => dirs.data_dir().to_owned(),
        None => "b3_index".into(),
    }
}
