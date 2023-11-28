use std::path::PathBuf;
use inference_core::Document;
use crate::doc_split::splitter::Splitter;

pub struct WordSplitter {}

impl Splitter for WordSplitter {
    fn split(path: &PathBuf) -> Vec<Document> {
        let mut documents: Vec<Document> = vec![];

        documents
    }
}