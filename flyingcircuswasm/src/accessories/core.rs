use super::*;

impl Accessories {
    /// Creates a new Accessories instance with the provided lists
    pub fn new(
        electrical_list: Vec<ElectricalEntry>,
        radio_list: Vec<RadioEntry>,
        recon_list: Vec<ReconEntry>,
        visi_list: Vec<VisibilityEntry>,
        climate_list: Vec<ClimateEntry>,
        autopilot_list: Vec<AutopilotEntry>,
        control_list: Vec<ControlEntry>,
    ) -> Self {
        let electrical_count = vec![0; electrical_list.len()];
        let recon_sel = vec![0; recon_list.len()];
        let visi_sel = vec![false; visi_list.len()];
        let clim_sel = vec![false; climate_list.len()];
        let armour_coverage = vec![0; 8];

        Accessories {
            electrical_list: Rc::new(electrical_list),
            radio_list: Rc::new(radio_list),
            recon_list: Rc::new(recon_list),
            visi_list: Rc::new(visi_list),
            climate_list: Rc::new(climate_list),
            autopilot_list: Rc::new(autopilot_list),
            control_list: Rc::new(control_list),
            armour_coverage,
            electrical_count,
            radio_sel: 0,
            recon_sel,
            visi_sel,
            clim_sel,
            auto_sel: 0,
            cont_sel: 0,
            has_radiator: false,
            can_visi_wings: true,
            can_visi_frame: true,
            skin_armour: 0,
            vital_parts: 99,
        }
    }
}
