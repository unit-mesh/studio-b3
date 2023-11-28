use std::sync::Arc;

use inference_core::Semantic;

pub struct AppState {
    pub(crate) semantic: Arc<Semantic>,
}
