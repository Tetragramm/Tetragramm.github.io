use std::collections::HashMap;
use std::sync::{Mutex, OnceLock};

use crate::engine::{EngineInputs, EngineStats};

/// A list of engine inputs with a name
pub struct EngineList {
    pub name: String,
    pub constant: bool,
    list: Vec<EngineInputs>,
}

impl EngineList {
    pub fn new(name: String) -> EngineList {
        EngineList {
            name,
            constant: false,
            list: Vec::new(),
        }
    }

    /// Add an engine to the list. Returns the index of the engine.
    /// If force is true, removes any existing matching engine first.
    pub fn push(&mut self, engine: EngineInputs, force: bool) -> Result<usize, String> {
        if self.constant {
            return Err("Engine List is Constant".to_string());
        }

        if force {
            self.remove(&engine);
        } else {
            // Check if engine already exists
            for (i, existing) in self.list.iter().enumerate() {
                if existing.name == engine.name {
                    return Ok(i);
                }
            }
        }

        self.list.push(engine);
        // Sort by name
        self.list.sort_by(|a, b| a.name.cmp(&b.name));

        // Find the index after sorting
        self.find_by_name(&self.list.last().unwrap().name)
            .ok_or_else(|| "Failed to find engine after push".to_string())
    }

    /// Get an engine by index
    pub fn get(&self, index: usize) -> Option<&EngineInputs> {
        self.list.get(index)
    }

    /// Get an engine by name
    pub fn get_by_name(&self, name: &str) -> Option<&EngineInputs> {
        self.find_by_name(name).and_then(|i| self.get(i))
    }

    /// Get engine stats by index
    pub fn get_stats(&self, index: usize) -> EngineStats {
        self.get(index)
            .map(|inputs| inputs.part_stats())
            .unwrap_or_else(EngineStats::new)
    }

    /// Get engine stats by name
    pub fn get_stats_by_name(&self, name: &str) -> EngineStats {
        self.get_by_name(name)
            .map(|inputs| inputs.part_stats())
            .unwrap_or_else(EngineStats::new)
    }

    /// Find an engine's index by inputs
    pub fn find(&self, engine: &EngineInputs) -> Option<usize> {
        self.list.iter().position(|e| e.name == engine.name)
    }

    /// Find an engine's index by name
    pub fn find_by_name(&self, name: &str) -> Option<usize> {
        self.list.iter().position(|e| e.name == name)
    }

    /// Remove an engine
    pub fn remove(&mut self, engine: &EngineInputs) {
        if self.constant {
            return;
        }
        if let Some(idx) = self.find(engine) {
            self.list.remove(idx);
        }
    }

    /// Remove an engine by name
    pub fn remove_by_name(&mut self, name: &str) {
        if self.constant {
            return;
        }
        if let Some(idx) = self.find_by_name(name) {
            self.list.remove(idx);
        }
    }

    /// Get the length of the list
    pub fn len(&self) -> usize {
        self.list.len()
    }

    /// Check if the list is empty
    pub fn is_empty(&self) -> bool {
        self.list.is_empty()
    }

    /// Mark this list as constant (read-only)
    pub fn set_constant(&mut self) {
        self.constant = true;
    }
}

// Global engine list storage
static ENGINE_LISTS: OnceLock<Mutex<HashMap<String, EngineList>>> = OnceLock::new();

/// Initialize the global engine lists
pub fn init_engine_lists() {
    ENGINE_LISTS.get_or_init(|| {
        let mut map = HashMap::new();
        map.insert("Custom".to_string(), EngineList::new("Custom".to_string()));
        Mutex::new(map)
    });
}

// Note: get_engine_list removed - EngineList doesn't implement Clone
// Use search_all_engine_lists, get_engine, and add_custom_engine instead

/// Get or create an engine list entry (internal use)
fn get_or_create_list(name: &str) -> () {
    init_engine_lists();
    let mut lists = ENGINE_LISTS.get().unwrap().lock().unwrap();
    if !lists.contains_key(name) {
        lists.insert(name.to_string(), EngineList::new(name.to_string()));
    }
}

/// Search all engine lists for an engine by name
/// Returns the list name if found, empty string otherwise
pub fn search_all_engine_lists(engine_name: &str) -> String {
    init_engine_lists();
    let lists = ENGINE_LISTS.get().unwrap().lock().unwrap();

    // Search non-Custom lists first
    for (list_name, list) in lists.iter() {
        if list_name != "Custom" {
            if list.find_by_name(engine_name).is_some() {
                return list_name.clone();
            }
        }
    }

    // Search Custom list last
    if let Some(custom_list) = lists.get("Custom") {
        if custom_list.find_by_name(engine_name).is_some() {
            return "Custom".to_string();
        }
    }

    String::new()
}

/// Add a custom engine to the Custom list
pub fn add_custom_engine(engine: EngineInputs) -> Result<usize, String> {
    init_engine_lists();
    let mut lists = ENGINE_LISTS.get().unwrap().lock().unwrap();

    if let Some(custom_list) = lists.get_mut("Custom") {
        custom_list.push(engine, false)
    } else {
        Err("Custom list not found".to_string())
    }
}

/// Get an engine from any list by name
pub fn get_engine(list_name: &str, engine_name: &str) -> Option<EngineInputs> {
    init_engine_lists();
    let lists = ENGINE_LISTS.get().unwrap().lock().unwrap();

    lists.get(list_name)
        .and_then(|list| list.get_by_name(engine_name))
        .cloned()
}

// TODO: Implement Clone for EngineList
// For now, we'll work without it
