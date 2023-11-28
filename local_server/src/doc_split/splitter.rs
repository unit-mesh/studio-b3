use std::path::PathBuf;
use inference_core::Document;

pub trait Splitter {
    fn split(path: &PathBuf) -> Vec<Document>;
}
