use std::path::PathBuf;

use inference_core::Document;

use crate::doc_split::splitter::Splitter;

pub struct PdfSplitter {}

impl Splitter for PdfSplitter {
    fn split(path: &PathBuf) -> Vec<Document> {
        println!("PdfSplitter::split() not implemented yet");
        vec![]
    }
}