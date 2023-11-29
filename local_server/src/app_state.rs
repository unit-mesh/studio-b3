use std::sync::Arc;

use inference_core::{InMemoryEmbeddingStore, Semantic};
use crate::doc_indexes::doc_indexes::DocIndexes;

pub struct AppState {
    pub semantic: Arc<Semantic>,
    pub storage: Arc<InMemoryEmbeddingStore>,
    pub indexes: Arc<DocIndexes>
}
