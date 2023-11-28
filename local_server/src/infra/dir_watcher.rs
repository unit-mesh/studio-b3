use std::{
    ops::Not,
    time::Duration,
};
use std::path::PathBuf;

use flume::Sender;
use notify_debouncer_mini::{Config, DebounceEventResult, Debouncer, new_debouncer_opt, notify, notify::RecommendedWatcher};
use notify_debouncer_mini::notify::RecursiveMode;
use tracing::{debug, error, warn};

fn watch_dir(tx: Sender<()>, disk_path: PathBuf) -> Option<Debouncer<RecommendedWatcher>> {
    let mut debouncer = debounced_events(tx);
    debouncer
        .watcher()
        .watch(&disk_path, RecursiveMode::Recursive)
        .map_err(|e| {
            let d = disk_path.display();
            warn!(error = %e, path = %d, "path does not exist anymore");
        })
        .ok()?;

    return Some(debouncer);
}

fn debounced_events(tx: flume::Sender<()>) -> Debouncer<RecommendedWatcher> {
    let notify_config = notify::Config::default().with_compare_contents(true);

    let config = Config::default()
        .with_timeout(Duration::from_secs(5))
        .with_notify_config(notify_config)
        ;

    new_debouncer_opt(config, move |event: DebounceEventResult| match event {
        Ok(events) if events.is_empty().not() => {
            if let Err(e) = tx.send(()) {
                error!("{e}");
            }
        }
        Ok(_) => debug!("no events received from debouncer"),
        Err(err) => {
            error!(?err, "repository monitoring");
        }
    }).unwrap()
}
