use rusqlite::{Connection, Result, params};
use tauri::command;

// --- Categoria ---
#[command]
pub fn create_categoria(nome: String, icone: Option<String>) -> Result<i64, String> {
    let conn = Connection::open("data.db").map_err(|e| e.to_string())?;
    conn.execute(
        "INSERT INTO categoria (nome, icone) VALUES (?, ?)",
        params![nome, icone],
    ).map_err(|e| e.to_string())?;
    Ok(conn.last_insert_rowid())
}

#[command]
pub fn get_categoria(id: i64) -> Result<(i64, String, Option<String>), String> {
    let conn = Connection::open("data.db").map_err(|e| e.to_string())?;
    conn.query_row(
        "SELECT id, nome, icone FROM categoria WHERE id = ?",
        params![id],
        |row| Ok((row.get(0)?, row.get(1)?, row.get(2)?)),
    ).map_err(|e| e.to_string())
}

#[command]
pub fn list_categorias(
    nome: Option<String>,
    limit: Option<u32>,
    offset: Option<u32>,
) -> Result<Vec<(i64, String, Option<String>)>, String> {
    let conn = Connection::open("data.db").map_err(|e| e.to_string())?;
    let mut query = String::from("SELECT id, nome, icone FROM categoria WHERE 1=1");
    let mut params_vec: Vec<rusqlite::types::Value> = Vec::new();

    if let Some(nome) = nome {
        query.push_str(" AND nome LIKE ?");
        params_vec.push(format!("%{}%", nome).into());
    }
    query.push_str(" ORDER BY id DESC");
    if let Some(limit) = limit {
        query.push_str(" LIMIT ?");
        params_vec.push(limit.into());
    }
    if let Some(offset) = offset {
        query.push_str(" OFFSET ?");
        params_vec.push(offset.into());
    }

    let mut stmt = conn.prepare(&query).map_err(|e| e.to_string())?;
    let categorias = stmt
        .query_map(params_vec.as_slice(), |row| {
            Ok((row.get(0)?, row.get(1)?, row.get(2)?))
        })
        .map_err(|e| e.to_string())?
        .collect::<Result<Vec<_>, _>>()
        .map_err(|e| e.to_string())?;
    Ok(categorias)
}

#[command]
pub fn update_categoria(id: i64, nome: String, icone: Option<String>) -> Result<(), String> {
    let conn = Connection::open("data.db").map_err(|e| e.to_string())?;
    conn.execute(
        "UPDATE categoria SET nome = ?, icone = ? WHERE id = ?",
        params![nome, icone, id],
    ).map_err(|e| e.to_string())?;
    Ok(())
}

#[command]
pub fn delete_categoria(id: i64) -> Result<(), String> {
    let conn = Connection::open("data.db").map_err(|e| e.to_string())?;
    conn.execute("DELETE FROM categoria WHERE id = ?", params![id])
        .map_err(|e| e.to_string())?;
    Ok(())
}

// --- Conta ---
#[command]
pub fn create_conta(nome: String, banco: Option<String>, saldo: f64, tipo: Option<String>) -> Result<i64, String> {
    let conn = Connection::open("data.db").map_err(|e| e.to_string())?;
    conn.execute(
        "INSERT INTO conta (nome, banco, saldo, tipo) VALUES (?, ?, ?, ?)",
        params![nome, banco, saldo, tipo],
    ).map_err(|e| e.to_string())?;
    Ok(conn.last_insert_rowid())
}

#[command]
pub fn get_conta(id: i64) -> Result<(i64, String, Option<String>, f64, Option<String>), String> {
    let conn = Connection::open("data.db").map_err(|e| e.to_string())?;
    conn.query_row(
        "SELECT id, nome, banco, saldo, tipo FROM conta WHERE id = ?",
        params![id],
        |row| Ok((row.get(0)?, row.get(1)?, row.get(2)?, row.get(3)?, row.get(4)?)),
    ).map_err(|e| e.to_string())
}

#[command]
pub fn list_contas(
    nome: Option<String>,
    banco: Option<String>,
    tipo: Option<String>,
    limit: Option<u32>,
    offset: Option<u32>,
) -> Result<Vec<(i64, String, Option<String>, f64, Option<String>)>, String> {
    let conn = Connection::open("data.db").map_err(|e| e.to_string())?;
    let mut query = String::from("SELECT id, nome, banco, saldo, tipo FROM conta WHERE 1=1");
    let mut params_vec: Vec<rusqlite::types::Value> = Vec::new();

    if let Some(nome) = nome {
        query.push_str(" AND nome LIKE ?");
        params_vec.push(format!("%{}%", nome).into());
    }
    if let Some(banco) = banco {
        query.push_str(" AND banco LIKE ?");
        params_vec.push(format!("%{}%", banco).into());
    }
    if let Some(tipo) = tipo {
        query.push_str(" AND tipo = ?");
        params_vec.push(tipo.into());
    }
    query.push_str(" ORDER BY id DESC");
    if let Some(limit) = limit {
        query.push_str(" LIMIT ?");
        params_vec.push(limit.into());
    }
    if let Some(offset) = offset {
        query.push_str(" OFFSET ?");
        params_vec.push(offset.into());
    }

    let mut stmt = conn.prepare(&query).map_err(|e| e.to_string())?;
    let contas = stmt
        .query_map(params_vec.as_slice(), |row| {
            Ok((row.get(0)?, row.get(1)?, row.get(2)?, row.get(3)?, row.get(4)?))
        })
        .map_err(|e| e.to_string())?
        .collect::<Result<Vec<_>, _>>()
        .map_err(|e| e.to_string())?;
    Ok(contas)
}

#[command]
pub fn update_conta(id: i64, nome: String, banco: Option<String>, saldo: f64, tipo: Option<String>) -> Result<(), String> {
    let conn = Connection::open("data.db").map_err(|e| e.to_string())?;
    conn.execute(
        "UPDATE conta SET nome = ?, banco = ?, saldo = ?, tipo = ? WHERE id = ?",
        params![nome, banco, saldo, tipo, id],
    ).map_err(|e| e.to_string())?;
    Ok(())
}

#[command]
pub fn delete_conta(id: i64) -> Result<(), String> {
    let conn = Connection::open("data.db").map_err(|e| e.to_string())?;
    conn.execute("DELETE FROM conta WHERE id = ?", params![id])
        .map_err(|e| e.to_string())?;
    Ok(())
}

// --- Transacao ---
#[command]
pub fn create_transacao(
    valor: f64,
    data: String,
    categoria_id: Option<i64>,
    conta_id: Option<i64>,
    descricao: Option<String>,
    tipo: String,
) -> Result<i64, String> {
    let conn = Connection::open("data.db").map_err(|e| e.to_string())?;
    conn.execute(
        "INSERT INTO transacao (valor, data, categoria_id, conta_id, descricao, tipo) VALUES (?, ?, ?, ?, ?, ?)",
        params![valor, data, categoria_id, conta_id, descricao, tipo],
    ).map_err(|e| e.to_string())?;
    Ok(conn.last_insert_rowid())
}

#[command]
pub fn get_transacao(id: i64) -> Result<(i64, f64, String, Option<i64>, Option<i64>, Option<String>, String), String> {
    let conn = Connection::open("data.db").map_err(|e| e.to_string())?;
    conn.query_row(
        "SELECT id, valor, data, categoria_id, conta_id, descricao, tipo FROM transacao WHERE id = ?",
        params![id],
        |row| Ok((
            row.get(0)?,
            row.get(1)?,
            row.get(2)?,
            row.get(3)?,
            row.get(4)?,
            row.get(5)?,
            row.get(6)?,
        )),
    ).map_err(|e| e.to_string())
}

#[command]
pub fn list_transacoes(
    tipo: Option<String>,
    categoria_id: Option<i64>,
    conta_id: Option<i64>,
    data_inicio: Option<String>,
    data_fim: Option<String>,
    limit: Option<u32>,
    offset: Option<u32>,
) -> Result<Vec<(i64, f64, String, Option<i64>, Option<i64>, Option<String>, String)>, String> {
    let conn = Connection::open("data.db").map_err(|e| e.to_string())?;
    let mut query = String::from("SELECT id, valor, data, categoria_id, conta_id, descricao, tipo FROM transacao WHERE 1=1");
    let mut params_vec: Vec<rusqlite::types::Value> = Vec::new();

    if let Some(tipo) = tipo {
        query.push_str(" AND tipo = ?");
        params_vec.push(tipo.into());
    }
    if let Some(categoria_id) = categoria_id {
        query.push_str(" AND categoria_id = ?");
        params_vec.push(categoria_id.into());
    }
    if let Some(conta_id) = conta_id {
        query.push_str(" AND conta_id = ?");
        params_vec.push(conta_id.into());
    }
    if let Some(data_inicio) = data_inicio {
        query.push_str(" AND data >= ?");
        params_vec.push(data_inicio.into());
    }
    if let Some(data_fim) = data_fim {
        query.push_str(" AND data <= ?");
        params_vec.push(data_fim.into());
    }
    query.push_str(" ORDER BY data DESC");
    if let Some(limit) = limit {
        query.push_str(" LIMIT ?");
        params_vec.push(limit.into());
    }
    if let Some(offset) = offset {
        query.push_str(" OFFSET ?");
        params_vec.push(offset.into());
    }

    let mut stmt = conn.prepare(&query).map_err(|e| e.to_string())?;
    let transacoes = stmt
        .query_map(params_vec.as_slice(), |row| {
            Ok((
                row.get(0)?,
                row.get(1)?,
                row.get(2)?,
                row.get(3)?,
                row.get(4)?,
                row.get(5)?,
                row.get(6)?,
            ))
        })
        .map_err(|e| e.to_string())?
        .collect::<Result<Vec<_>, _>>()
        .map_err(|e| e.to_string())?;
    Ok(transacoes)
}

#[command]
pub fn update_transacao(
    id: i64,
    valor: f64,
    data: String,
    categoria_id: Option<i64>,
    conta_id: Option<i64>,
    descricao: Option<String>,
    tipo: String,
) -> Result<(), String> {
    let conn = Connection::open("data.db").map_err(|e| e.to_string())?;
    conn.execute(
        "UPDATE transacao SET valor = ?, data = ?, categoria_id = ?, conta_id = ?, descricao = ?, tipo = ? WHERE id = ?",
        params![valor, data, categoria_id, conta_id, descricao, tipo, id],
    ).map_err(|e| e.to_string())?;
    Ok(())
}

#[command]
pub fn delete_transacao(id: i64) -> Result<(), String> {
    let conn = Connection::open("data.db").map_err(|e| e.to_string())?;
    conn.execute("DELETE FROM transacao WHERE id = ?", params![id])
        .map_err(|e| e.to_string())?;
    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            init_db,
            create_categoria,
            get_categoria,
            list_categorias,
            update_categoria,
            delete_categoria,
            create_conta,
            get_conta,
            list_contas,
            update_conta,
            delete_conta,
            create_transacao,
            get_transacao,
            list_transacoes,
            update_transacao,
            delete_transacao
        ])
        .setup(|app| {
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
