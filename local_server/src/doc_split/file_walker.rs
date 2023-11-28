use std::fs::canonicalize;
use std::path::{Path, PathBuf};

use tracing::{debug, warn};

pub struct FileWalker {
    file_list: Vec<PathBuf>,
}

impl FileWalker {
    pub fn index_directory(dir: impl AsRef<Path>) -> Vec<PathBuf> {
        let walker = ignore::WalkBuilder::new(&dir)
            .standard_filters(true)
            .hidden(false)
            .build();

        let file_list = walker
            .filter_map(|de| match de {
                Ok(de) => Some(de),
                Err(err) => {
                    warn!(%err, "access failure; skipping");
                    None
                }
            })
            .filter(|de| !de.path().strip_prefix(&dir).unwrap().starts_with(".git"))
            .filter_map(|de| canonicalize(de.into_path()).ok())
            .collect();

        file_list
    }
}