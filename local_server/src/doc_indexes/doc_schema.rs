use std::path::PathBuf;

use tantivy::doc;
use tantivy::schema::{Field, Schema, SchemaBuilder};

#[derive(Clone)]
pub struct DocumentFile {
    pub(super) schema: Schema,
    pub unique_hash: Field,
    /// Path to the root of the repo on disk
    pub repo_disk_path: Field,
    /// Path to the file, relative to the repo root
    pub relative_path: Field,
    pub title: Field,
    pub content: Field,
}

impl Default for DocumentFile {
    fn default() -> Self {
        Self::new()
    }
}

impl DocumentFile {
    pub fn new() -> Self {
        let mut builder = SchemaBuilder::new();
        let unique_hash = builder.add_text_field("unique_hash", tantivy::schema::TEXT | tantivy::schema::STORED);

        let repo_disk_path = builder.add_text_field("repo_disk_path", tantivy::schema::TEXT | tantivy::schema::STORED);
        let relative_path = builder.add_text_field("relative_path", tantivy::schema::TEXT | tantivy::schema::STORED);

        let title = builder.add_text_field("title", tantivy::schema::TEXT | tantivy::schema::STORED);
        let content = builder.add_text_field("content", tantivy::schema::TEXT | tantivy::schema::STORED);

        Self {
            unique_hash,
            repo_disk_path,
            relative_path,
            title,
            content,
            schema: builder.build(),
        }
    }

    pub fn build_document(&self, path: &PathBuf) -> Option<tantivy::schema::Document> {
        // todo: read file content by types
        None
    }
}