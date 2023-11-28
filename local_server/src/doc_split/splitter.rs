use std::path::PathBuf;
use inference_core::Document;

pub trait Splitter {
    /**
     * Split a document into multiple documents by chunk size.
     */
    fn split(path: &PathBuf, options: &SplitOptions) -> Vec<Document>;
}

pub struct SplitOptions {
    pub chunk_size: usize,
}

impl Default for SplitOptions {
    fn default() -> Self {
        SplitOptions {
            chunk_size: 256,
        }
    }
}
