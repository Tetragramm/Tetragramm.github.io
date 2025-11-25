use std::{iter::zip, rc::Rc};

use ui_core::*;
use ui_macro::*;

use crate::stats::Stats;

mod json;
mod part;
mod serialization;

#[derive(Clone)]
pub struct RadiatorEntry {
    pub name: String,
    pub stats: Stats,
    pub dragpercool: f32,
}

#[derive(Clone)]
pub struct RadiatorMountEntry {
    pub name: String,
    pub stats: Stats,
}

#[derive(Clone)]
pub struct RadiatorCoolantEntry {
    pub name: String,
    pub harden: bool,
    pub flammable: bool,
    pub stats: Stats,
}

#[derive(UIBindings)]
pub struct Radiator {
    type_list: Rc<Vec<RadiatorEntry>>,
    #[ui(
        select,
        source = "type_list",
        enabled_opt_fn = "is_type_enabled",
        set_fn = "set_type_index"
    )]
    idx_type: usize,

    mount_list: Rc<Vec<RadiatorMountEntry>>,
    #[ui(
        select,
        source = "mount_list",
        enabled_opt_fn = "is_mount_enabled",
        set_fn = "set_mount_index"
    )]
    idx_mount: usize,

    coolant_list: Rc<Vec<RadiatorCoolantEntry>>,
    #[ui(select, source = "coolant_list", set_fn = "set_coolant_index")]
    idx_coolant: usize,

    #[ui(check, name = "Radiators Harden Radiator", set_fn = "set_harden")]
    harden_cool: bool,

    need_cool: f32,
    engine_count: usize,
    has_parasol: bool,
    metal_area: f32,
}

impl Radiator {
    pub fn new(
        type_list: Vec<RadiatorEntry>,
        mount_list: Vec<RadiatorMountEntry>,
        coolant_list: Vec<RadiatorCoolantEntry>,
    ) -> Radiator {
        Radiator {
            type_list: Rc::new(type_list),
            idx_type: 1,
            mount_list: Rc::new(mount_list),
            idx_mount: 1,
            coolant_list: Rc::new(coolant_list),
            idx_coolant: 0,
            harden_cool: false,
            need_cool: 0.0,
            engine_count: 0,
            has_parasol: false,
            metal_area: 0.0,
        }
    }

    pub fn set_parasol(&mut self, has: bool) {
        self.has_parasol = has;
        let can_mount = self.is_mount_enabled();
        if !can_mount[self.idx_mount] {
            self.idx_mount = 0;
        }
    }

    pub fn set_need_cool(&mut self, num: f32, engnum: usize) {
        self.need_cool = num;
        self.engine_count = engnum;
    }

    pub fn set_metal_area(&mut self, num: f32) {
        self.metal_area = num;
        let can_type = self.is_type_enabled();
        if !can_type[self.idx_type] {
            self.idx_type = 0;
        }
    }

    pub fn get_is_flammable(&self) -> bool {
        self.coolant_list[self.idx_coolant].flammable
    }

    /// From TypeScript CanType(): Evaporation requires metal_area >= engine_count * 5
    fn is_type_enabled(&self) -> Vec<bool> {
        self.type_list
            .iter()
            .map(|t| {
                if t.name == "Evaporation" {
                    self.metal_area >= (self.engine_count * 5) as f32
                } else {
                    true
                }
            })
            .collect()
    }

    /// From TypeScript CanMount(): High Offset requires parasol
    fn is_mount_enabled(&self) -> Vec<bool> {
        self.mount_list
            .iter()
            .map(|m| {
                if m.name == "High Offset" {
                    self.has_parasol
                } else {
                    true
                }
            })
            .collect()
    }

    /// From TypeScript VerifyHarden(): Force harden if coolant requires it
    fn verify_harden(&mut self) {
        if self.coolant_list[self.idx_coolant].harden {
            self.harden_cool = true;
        }
    }

    // Setter functions with verification (for UIBindings)

    /// Set type index
    /// TypeScript: SetTypeIndex(num: number)
    fn set_type_index(&mut self, num: usize) {
        if num < self.type_list.len() {
            self.idx_type = num;
        }
    }

    /// Set mount index with validation
    /// TypeScript: SetMountIndex(num: number)
    fn set_mount_index(&mut self, num: usize) {
        if num < self.mount_list.len() {
            let can_mount = self.is_mount_enabled();
            if can_mount[num] {
                self.idx_mount = num;
            }
        }
    }

    /// Set coolant index
    /// TypeScript: SetCoolantIndex(num: number)
    fn set_coolant_index(&mut self, num: usize) {
        if num < self.coolant_list.len() {
            self.idx_coolant = num;
        }
    }

    /// Set harden coolant flag
    /// TypeScript: SetHarden(use: boolean)
    fn set_harden(&mut self, use_it: bool) {
        self.harden_cool = use_it;
    }
}
