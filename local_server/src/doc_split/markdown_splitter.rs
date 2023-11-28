use std::path::PathBuf;

use inference_core::Document;

use crate::doc_split::splitter::Splitter;

pub struct MarkdownSplitter {}

impl Splitter for MarkdownSplitter {
    fn split(path: &PathBuf) -> Vec<Document> {
        println!("MarkdownSplitter::split() not implemented yet");
        vec![]
    }
}