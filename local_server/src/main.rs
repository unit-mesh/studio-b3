use actix_web::{App, http, HttpServer, web};
use actix_cors::Cors;

use inference_core::init_semantic_with_path;

use app_state::AppState;

use crate::document_handler::create_embedding_document;

pub mod scraper;
mod document_handler;
pub mod app_state;
pub mod infra;
pub mod doc_split;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let semantic = init_semantic_with_path("model/model.onnx", "model/tokenizer.json")
        .expect("Failed to initialize semantic");

    let app_state = web::Data::new(AppState {
        semantic
    });

    HttpServer::new(move || {
        App::new()
            .wrap(Cors::default()
                .allowed_origin("https://editor.unitmesh.cc")
                .allowed_methods(vec!["GET", "POST"])
                .allowed_headers(vec![http::header::AUTHORIZATION, http::header::ACCEPT])
                .allowed_header(http::header::CONTENT_TYPE)
                .max_age(3600)
            )
            .app_data(app_state.clone())
            .service(create_embedding_document)
    })
        .bind(("127.0.0.1", 8080))?
        .run()
        .await
}