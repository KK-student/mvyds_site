use std::{
    fs,
    ops::Deref,
    path::PathBuf,
    str::FromStr,
    sync::{LazyLock, Mutex},
};

use axum::{
    Router,
    body::Body,
    http::{Response, StatusCode, header::CONTENT_TYPE},
    response::IntoResponse,
    routing::get,
};
use tokio::net::TcpListener;

use serde::Serialize;

mod misc;

use crate::misc::collections::*;

#[derive(Serialize)]
struct TextResponse {
    message: String,
}

impl IntoResponse for TextResponse {
    fn into_response(self) -> axum::response::Response {
        (StatusCode::OK, self.message).into_response()
    }
}

async fn index() -> impl IntoResponse {
    let contents: TextResponse = TextResponse {
        message: get_webpage("index.html").unwrap(),
    };

    let mut res = axum::response::IntoResponse::into_response(contents);
    res.headers_mut()
        .insert(CONTENT_TYPE, "text/html".parse().unwrap());

    (StatusCode::OK, res)
}

async fn get_script_endpoint(
    axum::extract::Path(name): axum::extract::Path<String>,
) -> impl IntoResponse {
    let contents: TextResponse = TextResponse {
        message: match get_script(name.as_str()) {
            Ok(val) => val,
            Err(_) => return error_response(StatusCode::NOT_FOUND),
        },
    };

    let mut res = axum::response::IntoResponse::into_response(contents);
    res.headers_mut()
        .insert(CONTENT_TYPE, "text/javascript".parse().unwrap());

    (StatusCode::OK, res)
}

fn error_response(code: StatusCode) -> (StatusCode, Response<Body>) {
    let contents = TextResponse {
        message: "Oops! We messed up!".to_string(),
    };
    let mut res = axum::response::IntoResponse::into_response(contents);
    res.headers_mut()
        .insert(CONTENT_TYPE, "text/html".parse().unwrap());

    (code, res)
}

fn get_local_file(relative_path: &str) -> Result<String, std::io::Error> {
    let absolute_canon_path: PathBuf = match std::fs::canonicalize(format!("./{relative_path}")) {
        Ok(val) => val,
        Err(e) => return Err(e),
    };
    let contents: String = match fs::read_to_string(absolute_canon_path) {
        Ok(val) => val,
        Err(e) => return Err(e),
    };
    Ok(contents)
}

fn get_webpage(webpage_file_name: &str) -> Result<String, std::io::Error> {
    get_local_file(format!("webpages/html/{webpage_file_name}").as_str())
}

fn get_script(script_file_name: &str) -> Result<String, std::io::Error> {
    get_local_file(format!("webpages/js/{script_file_name}").as_str())
}

async fn get_router() -> Router {
    Router::new()
        .route("/index.html", get(index))
        .route("/", get(index))
        .route("/js/{name}", get(get_script_endpoint))
}

static HTTP_PORT_ARC: LazyLock<Mutex<MutableBox<u64>>> =
    LazyLock::new(|| -> Mutex<MutableBox<u64>> { Mutex::new(MutableBox::new(Some(8080))) });

#[tokio::main]
async fn main() {
    let router = get_router().await;

    let address = format!("127.0.0.1:{}", {
        let port_mutg = HTTP_PORT_ARC.lock().unwrap();
        let port_box = port_mutg.deref();
        port_box.get().unwrap()
    });
    let listener = TcpListener::bind(&address).await.unwrap();
    println!("Listening on: {address}");

    axum::serve(listener, router.into_make_service())
        .await
        .unwrap();
}
