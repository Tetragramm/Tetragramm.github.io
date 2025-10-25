use crate::json::jsstr;

static mut LANG_MAP: serde_json::Value = serde_json::Value::Null;

pub fn set_lang_map(v: serde_json::Value) {
    unsafe {
        LANG_MAP = v;
    }
}

pub fn localization_lookup<S: AsRef<str>>(key: S) -> String {
    unsafe { jsstr(&LANG_MAP, key.as_ref()) }
}

#[macro_export]
macro_rules! lu {
    ($template: expr $(,)?) => { crate::localization::localization_lookup($template) };

    ($template: expr, $($values: tt)*) => {{
        formatx::formatx!(crate::localization::localization_lookup($template), $($values)*).unwrap()
    }};
}
