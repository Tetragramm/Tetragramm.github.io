use super::*;
use crate::part::Part;
use crate::serialization::{Deserializer, JSSerializable, Serializable, Serializer};
use crate::stats::{Stats, ERA};
use std::rc::Rc;

/// Create test frame list
fn create_test_frame_list() -> Vec<FrameEntry> {
    vec![
        FrameEntry {
            name: "Wood".to_string(),
            stats: Stats {
                mass: 2.0,
                cost: 1.0,
                ..Stats::new()
            },
            basestruct: 10,
            basecost: 5,
            geodesic: false,
        },
        FrameEntry {
            name: "Steel Tube".to_string(),
            stats: Stats {
                mass: 3.0,
                cost: 2.0,
                ..Stats::new()
            },
            basestruct: 15,
            basecost: 8,
            geodesic: true,
        },
    ]
}

/// Create test skin list
fn create_test_skin_list() -> Vec<SkinEntry> {
    vec![
        SkinEntry {
            name: "Fabric".to_string(),
            stats: Stats {
                mass: 1.0,
                cost: 1.0,
                ..Stats::new()
            },
            monocoque: false,
            monocoque_structure: 0,
            flammable: true,
            dragfactor: 1.0,
            massfactor: 1.0,
        },
        SkinEntry {
            name: "Plywood".to_string(),
            stats: Stats {
                mass: 2.0,
                cost: 3.0,
                ..Stats::new()
            },
            monocoque: true,
            monocoque_structure: 5,
            flammable: false,
            dragfactor: 0.9,
            massfactor: 1.1,
        },
    ]
}

/// Create test tail list
fn create_test_tail_list() -> Vec<TailEntry> {
    vec![
        TailEntry {
            name: "None".to_string(),
            stats: Stats {
                reqsections: 0.0,
                ..Stats::new()
            },
        },
        TailEntry {
            name: "Standard".to_string(),
            stats: Stats {
                reqsections: 2.0,
                mass: 1.0,
                ..Stats::new()
            },
        },
        TailEntry {
            name: "T-Tail".to_string(),
            stats: Stats {
                reqsections: 2.0,
                mass: 2.0,
                cost: 1.0,
                ..Stats::new()
            },
        },
    ]
}

#[test]
fn test_frames_new() {
    let frame_list = create_test_frame_list();
    let skin_list = create_test_skin_list();
    let tail_list = create_test_tail_list();

    let frames = Frames::new(frame_list, skin_list, tail_list);

    assert_eq!(frames.get_tail_type(), 2);
    assert_eq!(frames.get_skin(), 0);
    assert!(!frames.get_use_farman());
    assert!(!frames.get_use_boom());
    assert!(!frames.get_flying_wing());
}

#[test]
fn test_section_management() {
    let frame_list = create_test_frame_list();
    let skin_list = create_test_skin_list();
    let tail_list = create_test_tail_list();

    let mut frames = Frames::new(frame_list, skin_list, tail_list);

    // Should start with 1 section and 2 tail sections (from default tail type 2)
    assert!(frames.get_section_list().len() > 0);
    let initial_tail_count = frames.get_tail_section_list().len();

    // Set required sections
    frames.set_required_sections(3);
    assert_eq!(
        frames.get_num_frames(),
        3 + initial_tail_count // 3 main + tail sections
    );

    // Delete a section
    let initial_count = frames.get_section_list().len();
    frames.duplicate_section(0, 1);
    assert_eq!(frames.get_section_list().len(), initial_count + 1);
}

#[test]
fn test_set_frame() {
    let frame_list = create_test_frame_list();
    let skin_list = create_test_skin_list();
    let tail_list = create_test_tail_list();

    let mut frames = Frames::new(frame_list, skin_list, tail_list);

    frames.set_frame(0, 1);
    assert_eq!(frames.get_section_list()[0].frame, 1);
}

#[test]
fn test_set_all_frame() {
    let frame_list = create_test_frame_list();
    let skin_list = create_test_skin_list();
    let tail_list = create_test_tail_list();

    let mut frames = Frames::new(frame_list, skin_list, tail_list);
    frames.set_required_sections(3);

    frames.set_all_frame(1);

    for sec in frames.get_section_list() {
        assert_eq!(sec.frame, 1);
    }
}

#[test]
fn test_set_all_skin() {
    let frame_list = create_test_frame_list();
    let skin_list = create_test_skin_list();
    let tail_list = create_test_tail_list();

    let mut frames = Frames::new(frame_list, skin_list, tail_list);

    frames.set_all_skin(1);
    assert_eq!(frames.get_skin(), 1);
}

#[test]
fn test_farman_boom_mutual_exclusion() {
    let frame_list = create_test_frame_list();
    let skin_list = create_test_skin_list();
    let tail_list = create_test_tail_list();

    let mut frames = Frames::new(frame_list, skin_list, tail_list);

    frames.set_use_farman(true);
    assert!(frames.get_use_farman());
    assert!(!frames.get_use_boom());

    frames.set_use_boom(true);
    assert!(!frames.get_use_farman());
    assert!(frames.get_use_boom());
}

#[test]
fn test_tail_type() {
    let frame_list = create_test_frame_list();
    let skin_list = create_test_skin_list();
    let tail_list = create_test_tail_list();

    let mut frames = Frames::new(frame_list, skin_list, tail_list);

    frames.set_tail_type(1);
    assert_eq!(frames.get_tail_type(), 1);
    assert_eq!(frames.get_tail_section_list().len(), 2); // reqsections = 2
}

#[test]
fn test_flying_wing() {
    let frame_list = create_test_frame_list();
    let skin_list = create_test_skin_list();
    let tail_list = create_test_tail_list();

    let mut frames = Frames::new(frame_list, skin_list, tail_list);

    // Can't set flying wing without lifting body
    frames.set_flying_wing(true);
    assert!(!frames.get_flying_wing());

    // Set lifting body and try again
    frames.set_all_skin(1); // Use monocoque skin
    frames.set_lifting_body(0, true);
    assert!(frames.can_flying_wing());

    frames.set_flying_wing(true);
    assert!(frames.get_flying_wing());
}

#[test]
fn test_json_serialization() {
    let frame_list = create_test_frame_list();
    let skin_list = create_test_skin_list();
    let tail_list = create_test_tail_list();

    let mut frames = Frames::new(frame_list.clone(), skin_list.clone(), tail_list.clone());

    frames.set_required_sections(3);
    frames.set_use_farman(true);
    frames.set_all_skin(1);

    // To JSON
    let json = frames.to_json();
    assert_eq!(json["use_farman"].as_bool().unwrap(), true);
    assert_eq!(json["sel_skin"].as_i64().unwrap(), 1);

    // From JSON
    let mut frames2 = Frames::new(frame_list, skin_list, tail_list);
    frames2.from_json(&json, 12.0);

    assert_eq!(frames2.get_use_farman(), true);
    assert_eq!(frames2.get_skin(), 1);
}

#[test]
fn test_serialization() {
    let frame_list = create_test_frame_list();
    let skin_list = create_test_skin_list();
    let tail_list = create_test_tail_list();

    let mut frames = Frames::new(frame_list.clone(), skin_list.clone(), tail_list.clone());

    frames.set_required_sections(3);
    frames.set_use_boom(true);
    frames.set_all_skin(1);

    // Serialize
    let mut serializer = Serializer::new();
    serializer.push_string("12.0").unwrap();
    frames.serialize(&mut serializer).unwrap();

    // Deserialize
    let mut frames2 = Frames::new(frame_list, skin_list, tail_list);
    let buffer = serializer.into_inner();
    let mut deserializer = Deserializer::new(&buffer).unwrap();
    frames2.deserialize(&mut deserializer).unwrap();

    assert_eq!(frames2.get_use_boom(), true);
    assert_eq!(frames2.get_skin(), 1);
}

#[test]
fn test_part_stats() {
    let frame_list = create_test_frame_list();
    let skin_list = create_test_skin_list();
    let tail_list = create_test_tail_list();

    let mut frames = Frames::new(frame_list, skin_list, tail_list);

    let stats = frames.part_stats();

    // Should have some basic stats
    assert!(stats.mass >= 0.0);
    assert!(stats.cost >= 0.0);
    assert!(stats.structure >= 0.0);
}

#[test]
fn test_get_electrics() {
    let frame_list = create_test_frame_list();
    let skin_list = create_test_skin_list();
    let tail_list = create_test_tail_list();

    let frames = Frames::new(frame_list, skin_list, tail_list);

    let electrics = frames.get_electrics();
    assert_eq!(electrics.storage, 0);
}
