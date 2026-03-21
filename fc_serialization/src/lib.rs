//! Shared serialization utilities for Flying Circus builders
//!
//! This crate provides binary serialization/deserialization and JSON serialization
//! traits and utilities shared between flyingcircusrust and chariotsofsteelrust.

use byteorder::{BigEndian, ReadBytesExt, WriteBytesExt};
use encoding_rs::{Encoding, WINDOWS_1252};
use lz_str;
use std::io::{self, Cursor, Write};
use std::string::FromUtf8Error;
use utf16string::Utf16Error;

// --- Custom Error Type for better error handling ---
#[derive(Debug)]
pub enum Error {
    Io(io::Error),
    Utf8(FromUtf8Error),
    /// Represents when a string length exceeds the i16::MAX limit.
    StringTooLong(usize),
    /// Represents when an array length exceeds the i16::MAX limit.
    ArrayTooLong(usize),
    /// Represents when a value does not match later serialization needs (ie: engine_type)
    BadValue(i16),
    Utf16(Utf16Error),
}

impl From<io::Error> for Error {
    fn from(err: io::Error) -> Self {
        Error::Io(err)
    }
}

impl From<FromUtf8Error> for Error {
    fn from(err: FromUtf8Error) -> Self {
        Error::Utf8(err)
    }
}

impl From<Utf16Error> for Error {
    fn from(err: Utf16Error) -> Self {
        Error::Utf16(err)
    }
}

impl std::fmt::Display for Error {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Error::Io(e) => write!(f, "IO error: {}", e),
            Error::Utf8(e) => write!(f, "UTF-8 error: {}", e),
            Error::StringTooLong(len) => write!(f, "String too long: {} bytes", len),
            Error::ArrayTooLong(len) => write!(f, "Array too long: {} elements", len),
            Error::BadValue(v) => write!(f, "Bad value: {}", v),
            Error::Utf16(e) => write!(f, "UTF-16 error: {:?}", e),
        }
    }
}

impl std::error::Error for Error {}

// --- The Serializer ---

/// Serializes data into a byte buffer, similar to the TypeScript Serialize class.
/// All multi-byte values are written in Big Endian format.
pub struct Serializer {
    // We use a Vec<u8> as a growable buffer. It implements `io::Write` directly.
    buffer: Vec<u8>,
}

impl Serializer {
    /// Creates a new Serializer with a pre-allocated capacity.
    pub fn new() -> Self {
        Serializer {
            // Pre-allocating helps avoid reallocations for large data.
            buffer: Vec::with_capacity(51200),
        }
    }

    /// Pushes a 16-bit signed integer.
    pub fn push_num(&mut self, num: i16) -> Result<(), io::Error> {
        self.buffer.write_i16::<BigEndian>(num)
    }

    /// Pushes a boolean as a single byte (1 for true, 0 for false).
    pub fn push_bool(&mut self, val: bool) -> Result<(), io::Error> {
        self.buffer.write_u8(if val { 1 } else { 0 })
    }

    /// Pushes a 32-bit float.
    pub fn push_float(&mut self, val: f32) -> Result<(), io::Error> {
        self.buffer.write_f32::<BigEndian>(val)
    }

    /// Pushes a string, prefixed with its UTF-8 byte length as an i16.
    pub fn push_string(&mut self, s: &str) -> Result<(), Error> {
        let bytes = s.as_bytes();
        if bytes.len() > i16::MAX as usize {
            return Err(Error::StringTooLong(bytes.len()));
        }
        self.push_num(bytes.len() as i16)?;
        self.buffer.write_all(bytes)?;
        Ok(())
    }

    /// Pushes an array of numbers, prefixed with its length as an i16.
    pub fn push_num_arr(&mut self, nums: &[i16]) -> Result<(), Error> {
        if nums.len() > i16::MAX as usize {
            return Err(Error::ArrayTooLong(nums.len()));
        }
        self.push_num(nums.len() as i16)?;
        for &n in nums {
            self.push_num(n)?;
        }
        Ok(())
    }

    /// Pushes an array of booleans, prefixed with its length as an i16.
    pub fn push_bool_arr(&mut self, bools: &[bool]) -> Result<(), Error> {
        if bools.len() > i16::MAX as usize {
            return Err(Error::ArrayTooLong(bools.len()));
        }
        self.push_num(bools.len() as i16)?;
        for &b in bools {
            self.push_bool(b)?;
        }
        Ok(())
    }

    /// Consumes the Serializer and returns the underlying byte buffer.
    pub fn into_inner(self) -> Vec<u8> {
        self.buffer
    }

    /// Compresses the serialized data to an LZ-String compressed string.
    /// Converts the byte buffer to a str and then compresses using LZ-String.
    /// Returns the compressed string that can be transmitted or stored.
    pub fn compress_to_lz_string(self) -> Result<String, Error> {
        let s: String = self
            .buffer
            .iter()
            .map(|b| char::from_u32(*b as u32).unwrap())
            .collect();
        // Compress the bytes using LZ-String
        let compressed = lz_str::compress_to_encoded_uri_component(s.as_str());
        Ok(compressed)
    }
}

// Default implementation to match the constructor behavior.
impl Default for Serializer {
    fn default() -> Self {
        Self::new()
    }
}

// --- The Deserializer ---

/// Deserializes data from a byte slice, similar to the TypeScript Deserialize class.
/// It operates on a reference to the data (`&[u8]`) to avoid copies.
pub struct Deserializer<'a> {
    // Cursor allows us to read from a byte slice like a file, tracking position.
    cursor: Cursor<&'a [u8]>,
    pub version: f32,
}

impl<'a> Deserializer<'a> {
    /// Creates a new Deserializer and parses the version number from the start of the data.
    pub fn new(data: &'a [u8]) -> Result<Self, Error> {
        // The TS constructor immediately reads a version string, then resets.
        // We replicate that logic here.
        let mut initial_cursor = Cursor::new(data);

        // Temporarily read the version string. We assume the version string itself is always UTF-8.
        let version_str = Self::read_string_from_cursor(&mut initial_cursor, None)?;
        let version = version_str.parse::<f32>().unwrap_or(0.0);
        Ok(Deserializer {
            // The main cursor starts at the beginning for subsequent reads.
            cursor: Cursor::new(data),
            version,
        })
    }

    /// Creates a Deserializer with a specific version number (useful for vehicle builder
    /// which stores version differently).
    pub fn new_with_version(data: &'a [u8], version: f32) -> Self {
        Deserializer {
            cursor: Cursor::new(data),
            version,
        }
    }

    /// Helper for reading a string from a given cursor with optional encoding.
    /// Used by `new` and `get_string`.
    fn read_string_from_cursor(
        cursor: &mut Cursor<&'a [u8]>,
        encoding: Option<&'static Encoding>,
    ) -> Result<String, Error> {
        let len = cursor.read_i16::<BigEndian>()? as usize;

        // Ensure we don't read past the end of the buffer
        let start_pos = cursor.position() as usize;
        let end_pos = start_pos + len;
        if end_pos > cursor.get_ref().len() {
            return Err(io::Error::new(
                io::ErrorKind::UnexpectedEof,
                "String length exceeds buffer size",
            )
            .into());
        }

        let bytes = &cursor.get_ref()[start_pos..end_pos];
        cursor.set_position(end_pos as u64);

        if let Some(enc) = encoding {
            // Decode with the specified encoding (e.g., windows-1252)
            Ok(enc.decode(bytes).0.into_owned())
        } else {
            // Default to UTF-8
            Ok(String::from_utf8(bytes.to_vec())?)
        }
    }

    /// Resets the read position to the beginning of the data.
    pub fn reset(&mut self) {
        self.cursor.set_position(0);
    }

    /// Reads a 16-bit signed integer.
    pub fn get_num(&mut self) -> Result<i16, io::Error> {
        self.cursor.read_i16::<BigEndian>()
    }

    /// Reads a boolean from a single byte.
    pub fn get_bool(&mut self) -> Result<bool, io::Error> {
        self.cursor.read_u8().map(|b| b > 0)
    }

    /// Reads a 32-bit float.
    pub fn get_float(&mut self) -> Result<f32, io::Error> {
        self.cursor.read_f32::<BigEndian>()
    }

    /// Reads a length-prefixed string, using the version to decide the encoding.
    pub fn get_string(&mut self) -> Result<String, Error> {
        let encoding = if self.version < 12.65 {
            Some(WINDOWS_1252)
        } else {
            None // Default to UTF-8
        };
        Self::read_string_from_cursor(&mut self.cursor, encoding)
    }

    /// Reads a length-prefixed string, always using UTF-8 encoding.
    pub fn get_string_utf8(&mut self) -> Result<String, Error> {
        Self::read_string_from_cursor(&mut self.cursor, None)
    }

    /// Reads a number array, padding it with `0` to the target length.
    pub fn get_num_arr(&mut self, tgt_length: usize) -> Result<Vec<i16>, io::Error> {
        let len = self.get_num()? as usize;
        let mut arr = Vec::with_capacity(tgt_length);
        for _ in 0..len {
            arr.push(self.get_num()?);
        }
        // Pad the rest of the array with the default value (0).
        arr.resize(tgt_length, 0);
        Ok(arr)
    }

    /// Reads a boolean array, padding it with `false` to the target length.
    pub fn get_bool_arr(&mut self, tgt_length: usize) -> Result<Vec<bool>, io::Error> {
        let len = self.get_num()? as usize;
        let mut arr = Vec::with_capacity(tgt_length);
        for _ in 0..len {
            arr.push(self.get_bool()?);
        }
        // Pad the rest of the array with the default value (false).
        arr.resize(tgt_length, false);
        Ok(arr)
    }

    /// Reads the last 16-bit number from the original buffer without advancing the cursor.
    pub fn check_last_num(&self) -> Result<i16, io::Error> {
        let buffer = self.cursor.get_ref();
        if buffer.len() < 2 {
            return Err(io::Error::new(
                io::ErrorKind::UnexpectedEof,
                "Buffer too short to read last number",
            ));
        }
        let mut reader = Cursor::new(&buffer[buffer.len() - 2..]);
        reader.read_i16::<BigEndian>()
    }

    /// Returns the number of bytes remaining to be read from the cursor's current position.
    pub fn get_remaining(&self) -> u64 {
        self.cursor.get_ref().len() as u64 - self.cursor.position()
    }

    /// Creates a Deserializer from an LZ-String compressed string.
    /// Decompresses the LZ-String and creates a Deserializer
    /// to read the binary data.
    pub fn from_lz_string(compressed: &str) -> Result<Deserializer<'_>, Error> {
        // Decompress the LZ-String to get Base64 string
        let u16_str =
            lz_str::decompress_from_encoded_uri_component(compressed).ok_or_else(|| {
                Error::Io(io::Error::new(
                    io::ErrorKind::InvalidData,
                    "Failed to decompress LZ string",
                ))
            })?;

        let bytes: Vec<u8> = u16_str.iter().map(|x| *x as u8).collect();
        // Create a temporary vector to hold the decompressed data
        // We need to return a Deserializer with a lifetime tied to the data
        // Since we own the data here, we use Box::leak to get a static lifetime
        let leaked_data: &'static [u8] = Box::leak(bytes.into_boxed_slice());
        Deserializer::new(leaked_data)
    }
}

/// Trait for JSON serialization/deserialization
pub trait JSSerializable {
    fn to_json(&self) -> serde_json::Value;
    fn from_json(&mut self, js: &serde_json::Value, json_version: f32);
}

/// Trait for binary serialization/deserialization
pub trait Serializable {
    fn serialize(&self, s: &mut Serializer) -> Result<(), Error>;
    fn deserialize(&mut self, d: &mut Deserializer) -> Result<(), Error>;
}

/// Helper module for JSON parsing
pub mod json {
    use serde_json::Value;

    pub fn jsnum(js: &Value, key: &str) -> f32 {
        js.get(key)
            .and_then(|v| v.as_f64())
            .map(|v| v as f32)
            .unwrap_or(0.0)
    }

    pub fn jsint(js: &Value, key: &str) -> i32 {
        js.get(key)
            .and_then(|v| v.as_i64())
            .map(|v| v as i32)
            .unwrap_or(0)
    }

    pub fn jsbool(js: &Value, key: &str) -> bool {
        js.get(key).and_then(|v| v.as_bool()).unwrap_or(false)
    }

    pub fn jsstr(js: &Value, key: &str) -> String {
        js.get(key)
            .and_then(|v| v.as_str())
            .map(|s| s.to_string())
            .unwrap_or_default()
    }

    pub fn vstr(v: &Value) -> String {
        v.as_str().map(|s| s.to_string()).unwrap_or_default()
    }
}
