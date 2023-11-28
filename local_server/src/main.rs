use std::ops::Deref;

use actix_web::{HttpServer, Responder};
use sqlx::{Executor, Pool, Sqlite, SqlitePool};

pub mod scraper;
mod create_app;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    // init_semantic_with_path("../model", "../model").unwrap();

    HttpServer::new(|| {
        create_app::create_app()
    })
        .bind(("127.0.0.1", 8080))?
        .run()
        .await
}

#[tracing::instrument(skip_all)]
pub async fn initialize() -> Pool<Sqlite> {
    let url = format!("sqlite://./3b.db?mode=rwc");

    let pool = SqlitePool::connect(&*url);
    return pool.await.unwrap();
}
