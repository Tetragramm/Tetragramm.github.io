use super::*;
use crate::serialization::{Deserializer, Error, Serializable, Serializer};

impl Serializable for Accessories {
    fn serialize(&self, s: &mut Serializer) -> Result<(), Error> {
        // Serialize armour coverage
        s.push_num_arr(&self.armour_coverage)?;

        // Serialize electrical counts
        s.push_num_arr(&self.electrical_count)?;

        // Serialize radio selection
        s.push_num(self.radio_sel as i16)?;

        // Serialize recon selections
        s.push_num_arr(&self.recon_sel)?;

        // Serialize visibility toggles
        s.push_bool_arr(&self.visi_sel)?;

        // Serialize climate toggles
        s.push_bool_arr(&self.clim_sel)?;

        // Serialize autopilot selection
        s.push_num(self.auto_sel as i16)?;

        // Serialize control selection
        s.push_num(self.cont_sel as i16)?;

        Ok(())
    }

    fn deserialize(&mut self, d: &mut Deserializer) -> Result<(), Error> {
        // Deserialize and reset vitals
        self.vital_parts = 99;
        self.skin_armour = 0;

        // Deserialize armour coverage
        self.armour_coverage = d.get_num_arr(self.armour_coverage.len())?;

        // Deserialize electrical counts (with version compatibility check)
        if d.version < 11.85 {
            let mut counts = d.get_num_arr(self.electrical_count.len() + 1)?;
            counts[0] += counts[1];
            counts.remove(1);
            self.electrical_count = counts;
        } else {
            self.electrical_count = d.get_num_arr(self.electrical_count.len())?;
        }

        // Deserialize radio selection
        self.radio_sel = d.get_num()? as usize;

        // Deserialize recon selections (with version compatibility)
        if d.version < 12.05 {
            let old_info = d.get_bool_arr(2)?;
            self.recon_sel = vec![0; self.recon_list.len()];
            if old_info.get(0).copied().unwrap_or(false) {
                if self.recon_sel.len() > 1 {
                    self.recon_sel[1] = 1;
                }
            }
            if old_info.get(1).copied().unwrap_or(false) {
                if self.recon_sel.len() > 0 {
                    self.recon_sel[0] = 1;
                }
            }
        } else {
            self.recon_sel = d.get_num_arr(self.recon_list.len())?;
        }

        // Deserialize visibility toggles
        self.visi_sel = d.get_bool_arr(self.visi_list.len())?;

        // Deserialize climate toggles (with version compatibility)
        self.clim_sel = d.get_bool_arr(self.climate_list.len())?;
        if d.version < 11.95 && self.clim_sel.len() > 2 {
            self.clim_sel.remove(2);
        }

        // Deserialize autopilot selection
        self.auto_sel = d.get_num()? as usize;

        // Deserialize control selection
        self.cont_sel = d.get_num()? as usize;

        Ok(())
    }
}
