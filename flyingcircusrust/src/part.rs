use crate::stats::Stats;
use serde::{Deserialize, Serialize};

#[derive(Clone, Serialize, Deserialize)]
pub struct Equipment {
    pub source: String,
    pub charge: String,
}

#[derive(Serialize, Deserialize)]
pub struct ElectricsMessage {
    pub storage: i32,
    pub equipment: Vec<Equipment>,
}

impl ElectricsMessage {
    pub fn new() -> ElectricsMessage {
        ElectricsMessage {
            storage: 0,
            equipment: Vec::new(),
        }
    }
}

pub fn merge_electrics(a: ElectricsMessage, b: ElectricsMessage) -> ElectricsMessage {
    let mut n = a;
    for b_equip in b.equipment {
        let mut merged = false;
        for n_equip in &mut n.equipment {
            if n_equip.source == b_equip.source {
                n_equip.charge =
                    match (n_equip.charge.parse::<f32>(), b_equip.charge.parse::<f32>()) {
                        (Ok(n), Ok(b)) => (n + b).to_string(),
                        _ => "-".to_string(),
                    };
                merged = true;
                break;
            }
        }
        if !merged {
            n.equipment.push(b_equip.clone());
        }
    }

    ElectricsMessage {
        storage: n.storage + b.storage,
        equipment: n.equipment,
    }
}

pub trait Part {
    fn part_stats(&mut self) -> Stats;
    fn get_electrics(&self) -> ElectricsMessage;
}
