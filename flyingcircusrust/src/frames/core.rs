use super::*;

impl Frames {
    /// Creates a new Frames instance with provided lists
    pub fn new(
        frame_list: Vec<FrameEntry>,
        skin_list: Vec<SkinEntry>,
        tail_list: Vec<TailEntry>,
    ) -> Frames {
        let mut frames = Frames {
            frame_list: Rc::new(frame_list),
            skin_list: Rc::new(skin_list),
            tail_list: Rc::new(tail_list),
            section_list: Vec::new(),
            tail_section_list: Vec::new(),
            required_sections: 1,
            internal_bracing_count: 0,
            sel_skin: 0,
            sel_tail: 2,
            farman: false,
            boom: false,
            has_tractor_nacelles: false,
            flying_wing: false,
            is_tandem: false,
        };
        frames.set_required_sections(1);
        frames
    }
}
