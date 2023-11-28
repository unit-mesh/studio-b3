use std::ops::Deref;

use actix_web::{App, HttpServer, web};

use app_state::AppState;

use crate::document_handler::create_embedding_document;

pub mod scraper;
mod document_handler;
pub mod app_state;
pub mod infra;
pub mod doc_split;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let app_state = web::Data::new(AppState {

    });

    HttpServer::new(move || {
        App::new()
            .app_data(app_state.clone())
            .service(create_embedding_document)
    })
        .bind(("127.0.0.1", 8080))?
        .run()
        .await
}

// #[tracing::instrument(skip_all)]
// pub async fn initialize() -> Pool<Sqlite> {
//     let url = format!("sqlite://./3b.db?mode=rwc");
//     let pool = SqlitePool::connect(&*url);
//     return pool.await.unwrap();
// }
