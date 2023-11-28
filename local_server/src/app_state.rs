use std::sync::Arc;

use inference_core::{InMemoryEmbeddingStore, Semantic};

pub struct AppState {
    pub semantic: Arc<Semantic>,
    pub storage: Arc<InMemoryEmbeddingStore>,
}
