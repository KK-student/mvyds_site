use std::{
    ops::Deref,
    sync::{LazyLock, Mutex},
};

use axum::{Router, response::IntoResponse, routing::get};
use tokio::net::TcpListener;

mod misc;

use crate::misc::collections::*;

async fn index() -> impl IntoResponse {
    "Hello, world!"
}

async fn get_router() -> Router {
    Router::new().route("/index.html", get(index))
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
