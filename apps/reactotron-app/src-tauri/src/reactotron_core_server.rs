use futures_util::{SinkExt, StreamExt};
use serde::{Deserialize, Serialize};
use tauri::async_runtime;
use tauri::AppHandle;
use tauri::Emitter;
use tauri::Listener;
use tokio::net::TcpListener;
use tokio_tungstenite::accept_async;
use tokio_tungstenite::tungstenite::Message;
use std::sync::{Arc, Mutex};
use tokio::sync::Mutex as TokioMutex;
use std::collections::HashMap;
use uuid::Uuid;
use chrono;

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Command {
    pub r#type: String,
    pub payload: serde_json::Value,
    #[serde(default)]
    pub important: Option<serde_json::Value>,
    #[serde(default)]
    pub diff: Option<serde_json::Value>,
    #[serde(default, rename = "connectionId")]
    pub connection_id: Option<u32>,
    #[serde(default, rename = "messageId")]
    pub message_id: Option<u32>,
    #[serde(default)]
    pub date: Option<String>,
    #[serde(default, rename = "deltaTime")]
    pub delta_time: Option<serde_json::Value>,
    #[serde(default, rename = "clientId")]
    pub client_id: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CommandWithClientId {
    pub r#type: String,
    pub payload: serde_json::Value,
    pub client_id: String,
    pub important: bool,
    #[serde(default)]
    pub date: Option<String>,
    #[serde(default)]
    pub delta_time: Option<i64>,
}

#[derive(Debug, Clone, Serialize)]
pub struct ClientConnection {
    pub id: u32,
    pub address: String,
    pub client_id: String,
    #[serde(skip)]
    pub socket: Arc<TokioMutex<tokio_tungstenite::WebSocketStream<tokio::net::TcpStream>>>,
}

#[derive(Debug, Clone, Serialize)]
pub struct PartialConnection {
    pub id: u32,
    pub address: String,
    #[serde(skip)]
    pub socket: Arc<TokioMutex<tokio_tungstenite::WebSocketStream<tokio::net::TcpStream>>>,
}

type ServerHandle = Arc<Mutex<Option<tauri::async_runtime::JoinHandle<()>>>>;
type WsStream = Arc<TokioMutex<Option<tokio_tungstenite::WebSocketStream<tokio::net::TcpStream>>>>;
type ClientConnections = Arc<TokioMutex<HashMap<String, ClientConnection>>>;
type Subscriptions = Arc<TokioMutex<Vec<String>>>;
type PartialConnections = Arc<TokioMutex<Vec<PartialConnection>>>;

static mut SERVER_HANDLE: Option<ServerHandle> = None;
static mut WS_STREAM: Option<WsStream> = None;
static mut CLIENT_CONNECTIONS: Option<ClientConnections> = None;
static mut SUBSCRIPTIONS: Option<Subscriptions> = None;
static mut PARTIAL_CONNECTIONS: Option<PartialConnections> = None;

pub fn get_server_handle() -> &'static ServerHandle {
    unsafe {
        if SERVER_HANDLE.is_none() {
            SERVER_HANDLE = Some(Arc::new(Mutex::new(None)));
        }
        SERVER_HANDLE.as_ref().unwrap()
    }
}

pub fn get_ws_stream() -> &'static WsStream {
    unsafe {
        if WS_STREAM.is_none() {
            WS_STREAM = Some(Arc::new(TokioMutex::new(None)));
        }
        WS_STREAM.as_ref().unwrap()
    }
}

pub fn get_client_connections() -> &'static ClientConnections {
    unsafe {
        if CLIENT_CONNECTIONS.is_none() {
            CLIENT_CONNECTIONS = Some(Arc::new(TokioMutex::new(HashMap::new())));
        }
        CLIENT_CONNECTIONS.as_ref().unwrap()
    }
}

pub fn get_subscriptions() -> &'static Subscriptions {
    unsafe {
        if SUBSCRIPTIONS.is_none() {
            SUBSCRIPTIONS = Some(Arc::new(TokioMutex::new(Vec::new())));
        }
        SUBSCRIPTIONS.as_ref().unwrap()
    }
}

pub fn get_partial_connections() -> &'static PartialConnections {
    unsafe {
        if PARTIAL_CONNECTIONS.is_none() {
            PARTIAL_CONNECTIONS = Some(Arc::new(TokioMutex::new(Vec::new())));
        }
        PARTIAL_CONNECTIONS.as_ref().unwrap()
    }
}

pub fn start_server(app_handle: AppHandle) {
    let server_handle = get_server_handle();
    {
        let mut guard = server_handle.lock().unwrap();
        if let Some(handle) = guard.take() {
            handle.abort();
            app_handle.emit("stop", "stop").unwrap();
        }
        app_handle.emit("start", "start").unwrap();
    }

    let handle = async_runtime::spawn(async move {
        let listener = match TcpListener::bind("0.0.0.0:9090").await {
            Ok(listener) => listener,
            Err(e) => {
                if e.to_string().contains("EADDRINUSE") {
                    app_handle.emit("portUnavailable", 9090).unwrap();
                } else {
                    println!("Error starting server: {}", e);
                }
                return;
            }
        };
        println!("WebSocket server started: ws://0.0.0.0:9090");

        let mut connection_id = 0;
        let mut message_id = 0;

        let format_address = |addr: &std::net::SocketAddr| {
            if addr.is_ipv4() {
                format!("::ffff:{}", addr.ip())
            } else {
                addr.to_string()
            }
        };

        loop {
            let (stream, addr) = listener.accept().await.unwrap();
            let app_handle = app_handle.clone();
            let current_connection_id = connection_id;
            connection_id += 1;

            async_runtime::spawn(async move {
                let ws_stream = get_ws_stream();
                let client_connections = get_client_connections();
                let subscriptions = get_subscriptions();
                let partial_connections = get_partial_connections();
                
                let ws = accept_async(stream).await.unwrap();
                let ws = Arc::new(TokioMutex::new(ws));
                println!("WebSocket connection accepted from {}", format_address(&addr));

                // Create and store partialConnection
                let partial_connection = PartialConnection {
                    id: current_connection_id,
                    address: format_address(&addr),
                    socket: ws.clone(),
                };

                // Add to partialConnections
                {
                    let mut partials = partial_connections.lock().await;
                    partials.push(partial_connection.clone());
                }

                // Emit connect event
                app_handle.emit("connect", &partial_connection).unwrap();

                let mut current_client_id = None;

                loop {
                    let mut ws_guard = ws.lock().await;
                    if let Some(msg) = ws_guard.next().await {
                        let msg = msg.unwrap();
                        if msg.is_text() {
                            let text = msg.to_text().unwrap();
                            println!("Received text: {}", text);
                            
                            if let Ok(mut cmd) = serde_json::from_str::<Command>(text) {
                                message_id += 1;
                                cmd.message_id = Some(message_id);
                                cmd.connection_id = Some(current_connection_id);

                                println!("=== New client connection ===");
                                println!("Connection ID: {}", current_connection_id);

                                // Handle client.intro
                                if cmd.r#type == "client.intro" {
                                    println!("=== Processing client.intro ===");
                                    println!("Client ID: {:?}", cmd.payload.get("clientId"));
                                    println!("Payload: {:?}", cmd.payload);

                                    // Find partialConnection
                                    let mut partials = partial_connections.lock().await;
                                    let part_conn_opt = partials.iter().find(|c| c.id == current_connection_id).cloned();

                                    // Add address to payload
                                    if let Some(part_conn) = &part_conn_opt {
                                        if let Some(payload) = cmd.payload.as_object_mut() {
                                            payload.insert("address".to_string(), serde_json::Value::String(part_conn.address.clone()));
                                        }
                                    }

                                    // Remove from partialConnections
                                    partials.retain(|c| c.id != current_connection_id);

                                    // Handle clientId
                                    let mut client_id = cmd.payload.get("clientId").and_then(|v| v.as_str()).map(|s| s.to_string());
                                    println!("client_id: {:?}", client_id);
                                    if client_id.is_none() || client_id.as_ref().map_or(false, |id| id == "~~~ null ~~~") {
                                        println!("No clientId found, generating new one");
                                        client_id = Some(Uuid::new_v4().to_string());
                                        // Send clientId to client
                                        let response = serde_json::json!({
                                            "type": "setClientId",
                                            "payload": client_id.as_ref().unwrap()
                                        });
                                        ws_guard.send(Message::Text(response.to_string().into())).await.unwrap();
                                        println!("Sent clientId to client: {}", client_id.as_ref().unwrap());
                                    } else {
                                        // If a socket with the same clientId already exists, close and remove the old connection
                                        let mut connections = client_connections.lock().await;
                                        let existing = connections.iter()
                                            .find(|(_, conn)| conn.client_id.as_str() == client_id.as_ref().unwrap())
                                            .map(|(k, _)| k.clone());
                                        if let Some(existing_key) = existing {
                                            connections.remove(&existing_key);
                                        }
                                    }

                                    let client_id = client_id.unwrap();
                                    current_client_id = Some(client_id.clone());
                                    cmd.client_id = Some(client_id.clone());

                                    // Create connection object and add to connections
                                    let mut connections = client_connections.lock().await;
                                    let connection = ClientConnection {
                                        id: current_connection_id,
                                        address: format_address(&addr),
                                        client_id: client_id.clone(),
                                        socket: ws.clone(),
                                    };
                                    connections.insert(client_id.clone(), connection.clone());

                                    // Emit connectionEstablished event
                                    app_handle.emit("connectionEstablished", &serde_json::json!({
                                        "id": current_connection_id,
                                        "address": format_address(&addr),
                                        "clientId": client_id,
                                        "payload": cmd.payload,
                                        "diff": cmd.diff,
                                    })).unwrap();

                                    println!("=== Sending current subscriptions ===");
                                    let subs = subscriptions.lock().await;
                                    println!("Current subscriptions: {:?}", *subs);
                                }

                                // Set client_id for all messages if current_client_id exists
                                if let Some(client_id) = &current_client_id {
                                    cmd.client_id = Some(client_id.clone());
                                }

                                // Handle state.values.subscribe
                                if cmd.r#type == "state.values.subscribe" {
                                    println!("=== Processing state.values.subscribe ===");
                                    println!("Subscribe paths: {:?}", cmd.payload);
                                    
                                    // Add paths sent by client to subscription list
                                    if let Some(paths) = cmd.payload.get("paths") {
                                        if let Some(paths_array) = paths.as_array() {
                                            let mut subs = subscriptions.lock().await;
                                            for path in paths_array {
                                                if let Some(path_str) = path.as_str() {
                                                    if !subs.contains(&path_str.to_string()) {
                                                        subs.push(path_str.to_string());
                                                    }
                                                }
                                            }
                                        }
                                    }
                                   
                                    // Send subscription info to all clients
                                    let command = CommandWithClientId {
                                        r#type: "state.values.subscribe".to_string(),
                                        payload: serde_json::json!({ "paths": *subscriptions.lock().await }),
                                        client_id: cmd.client_id.clone().unwrap(),
                                        important: false,
                                        date: Some(chrono::Utc::now().to_rfc3339()),
                                        delta_time: Some(0),
                                    };
                                    send_command(app_handle.clone(), command).await;
                                }

                                // Handle state.values.change
                                if cmd.r#type == "state.values.change" {
                                    println!("=== Processing state.values.change ===");
                                    println!("Changes: {:?}", cmd.payload);
                                    if let Some(changes) = cmd.payload.get("changes") {
                                        if let Some(paths) = changes.as_array() {
                                            let mut subs = subscriptions.lock().await;
                                            subs.clear(); // Clear existing subscription list
                                            for path in paths {
                                                if let Some(path_str) = path.get("path").and_then(|p| p.as_str()) {
                                                    subs.push(path_str.to_string());
                                                }
                                            }
                                            println!("Current subscriptions: {:?}", *subs);
                                        }
                                    }
                                }

                                // Handle state.backup.response
                                if cmd.r#type == "state.backup.response" {
                                    if let Some(payload) = cmd.payload.as_object_mut() {
                                        payload.insert("name".to_string(), serde_json::Value::Null);
                                    }
                                }

                                println!("=== Emitting command ===");
                                println!("Command type: {}", cmd.r#type);
                                println!("Command payload: {:?}", cmd.payload);
                                app_handle.emit("command", &cmd).unwrap();
                            } else {
                                println!("Failed to parse command: {}", text);
                            }
                        }
                        println!("=== Sending subscriptions ===");
                        let subs = subscriptions.lock().await;
                        println!("Sending subscriptions: {:?}", *subs);
                    } else {
                        break;
                    }
                }

                // Remove from partialConnections on disconnect
                {
                    let mut partials = partial_connections.lock().await;
                    partials.retain(|conn| conn.id != current_connection_id);
                }

                // Handle disconnection
                if let Some(client_id) = current_client_id {
                    let mut connections = client_connections.lock().await;
                    if let Some(conn) = connections.remove(&client_id) {
                        app_handle.emit("disconnect", &conn).unwrap();
                    }
                }
            });
        }
    });

    let server_handle = get_server_handle();
    let mut guard = server_handle.lock().unwrap();
    *guard = Some(handle);
}

pub async fn stop_server(app_handle: AppHandle) {
    let server_handle = get_server_handle();
    let mut guard = server_handle.lock().unwrap();
    
    if let Some(handle) = guard.take() {
        handle.abort();
        println!("WebSocket server stopped: ws://0.0.0.0:9090");
        
        // Clean up client connections
        let client_connections = get_client_connections();
        let mut connections = client_connections.lock().await;
        connections.clear();
        
        // Clean up partial connections
        let partial_connections = get_partial_connections();
        let mut partials = partial_connections.lock().await;
        partials.clear();
        
        // Clear subscriptions
        let subscriptions = get_subscriptions();
        let mut subs = subscriptions.lock().await;
        subs.clear();
        
        app_handle.emit("stop", "stop").unwrap();
    }
}

pub async fn send_command(app_handle: AppHandle, command: CommandWithClientId) {
    let client_connections = get_client_connections();
    let connections = client_connections.lock().await;
    
    for (_, conn) in connections.iter() {
        if command.client_id.is_empty() || conn.client_id == command.client_id {
            // Maintain original command format - remove hardcoded values
            let command_json = serde_json::json!({
                "type": command.r#type,
                "payload": command.payload
                // Remove important, date, deltaTime fields
            });
            
            let message = Message::Text(command_json.to_string().into());
            let mut socket = conn.socket.lock().await;
            if let Err(e) = socket.send(message).await {
                println!("Error sending message to client {}: {}", conn.client_id, e);
            }
        }
    }
}

pub async fn send_custom_message(app_handle: AppHandle, value: String, client_id: Option<String>) {
    let command = CommandWithClientId {
        r#type: "custom".to_string(),
        payload: serde_json::Value::String(value),
        client_id: client_id.unwrap_or_default(),
        important: false,
        date: Some(chrono::Utc::now().to_rfc3339()),
        delta_time: Some(0),
    };
    send_command(app_handle, command).await;
}

pub async fn state_values_subscribe(app_handle: AppHandle, paths: Vec<String>) {
    let subscriptions = get_subscriptions();
    let mut subs = subscriptions.lock().await;
    
    // Replace existing subscription list with new paths
    *subs = paths;
    
    // Broadcast subscription info to all clients
    let command = CommandWithClientId {
        r#type: "state.values.subscribe".to_string(),
        payload: serde_json::json!({ "paths": *subs }),
        client_id: String::new(), // Empty string to send to all clients
        important: false,
        date: Some(chrono::Utc::now().to_rfc3339()),
        delta_time: Some(0),
    };
    send_command(app_handle, command).await;
}

pub async fn state_values_unsubscribe(app_handle: AppHandle, path: String) {
    let subscriptions = get_subscriptions();
    let mut subs = subscriptions.lock().await;
    
    if let Some(pos) = subs.iter().position(|x| x == &path) {
        subs.remove(pos);
        
        let command = CommandWithClientId {
            r#type: "state.values.subscribe".to_string(),
            payload: serde_json::json!({ "paths": *subs }),
            client_id: String::new(),
            important: false,
            date: Some(chrono::Utc::now().to_rfc3339()),
            delta_time: Some(0),
        };
        send_command(app_handle, command).await;
    }
}

pub async fn state_values_clear_subscriptions(app_handle: AppHandle) {
    let subscriptions = get_subscriptions();
    let mut subs = subscriptions.lock().await;
    subs.clear();
    
    let command = CommandWithClientId {
        r#type: "state.values.subscribe".to_string(),
        payload: serde_json::json!({ "paths": [] }),
        client_id: String::new(),
        important: false,
        date: Some(chrono::Utc::now().to_rfc3339()),
        delta_time: Some(0),
    };
    send_command(app_handle, command).await;
}