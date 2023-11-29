use std::fs;
use std::path::{Path, PathBuf};

use anyhow::Context;
use tantivy::Index;
use tantivy::schema::Schema;
use tantivy::tokenizer::*;
use crate::doc_indexes::doc_schema::DocumentFile;

pub struct DocIndexes {
    pub doc: Index,
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
            // .register("default", NgramTokenizer::new(1, 3, false)?);

        Ok(index)
    }
}

//
// Configuration defaults
//
fn default_index_dir() -> PathBuf {
    match directories::ProjectDirs::from("org", "unitmesh", "b3") {
        Some(dirs) => dirs.data_dir().to_owned(),
        None => "b3_index".into(),
    }
}
