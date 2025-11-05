# Building and Testing the WASM Integration

This guide explains how to build the WASM module and test the Era component with full localization.

## Prerequisites

```bash
# Install Rust (if not already installed)
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Install wasm-pack
cargo install wasm-pack

# Install Node.js dependencies (if not already done)
cd Test
npm install
```

## Building the WASM Module

### Step 1: Build WASM for Web

```bash
cd flyingcircuswasm
wasm-pack build --target bundler --out-dir ../Test/pkg
```

This generates:
- `Test/pkg/flyingcircuswasm.js` - JavaScript bindings
- `Test/pkg/flyingcircuswasm_bg.wasm` - WebAssembly binary
- `Test/pkg/flyingcircuswasm.d.ts` - TypeScript definitions
- `Test/pkg/package.json` - Package metadata

### Step 2: Build TypeScript

```bash
cd Test
npx webpack --mode development
```

Or for production:
```bash
npx webpack --mode production
```

## Running the Application

### Start Local Server

```bash
# From repository root
python server.py
```

Then open: http://localhost:8080/Test/

## Testing the Era Component

### What to Test

1. **Initial Load**
   - Page loads without errors
   - Era dropdown appears with English names (default)
   - Language selector appears in top-right corner

2. **Language Switching**
   - Click language selector dropdown
   - Select "Deutsch" (German)
   - **Expected**: Era dropdown options update to German immediately
   - **Expected**: "Era" section title updates to "Ära"
   - **Expected**: Rules link stays working

3. **Era Selection**
   - Select different Eras from dropdown
   - **Expected**: Console logs show "Era changed to index X"
   - **Expected**: Stats recalculate (check browser console)

4. **URL Parameters**
   - Test with `?lang=de` → Should load in German
   - Test with `?lang=en` → Should load in English
   - Language preference saved to localStorage

5. **Browser Console**
   - Should see initialization messages:
     ```
     [WasmApp] Starting WASM initialization...
     [WasmApp] Localization initialized
     [WasmApp] Aircraft bridge initialized
     [WasmApp] Language selector created
     [WasmApp] Era UI created
     [WasmApp] Initialization complete!
     [PlaneBuilder] WASM initialized successfully
     ```

### What Should Happen

**English (default):**
```
Era dropdown shows:
- Pioneer
- WWI
- Roaring 20s
- Coming Storm
- WWII
- Last Hurrah
```

**German (after switching):**
```
Era dropdown shows:
- Pionier
- Erster Weltkrieg
- Goldene Zwanziger
- Drohender Sturm
- Zweiter Weltkrieg
- Letzte Hürde
```

(Note: Exact German translations depend on what's in the Rust i18n backend)

## Troubleshooting

### WASM Not Loading

**Symptoms:**
- Console shows: `[WasmApp] WASM module not found (not yet built)`
- Era section doesn't appear

**Solution:**
1. Check that `Test/pkg/` directory exists
2. Verify files exist:
   ```bash
   ls -la Test/pkg/
   ```
3. Rebuild WASM:
   ```bash
   cd flyingcircuswasm
   wasm-pack build --target bundler --out-dir ../Test/pkg
   ```

### TypeScript Compilation Errors

**Symptoms:**
- `npx webpack` fails with errors

**Solution:**
1. Check that TypeScript can find WASM types:
   ```bash
   ls Test/pkg/flyingcircuswasm.d.ts
   ```
2. If missing, rebuild WASM
3. Try cleaning and rebuilding:
   ```bash
   rm -rf Test/pkg
   cd flyingcircuswasm
   wasm-pack build --target bundler --out-dir ../Test/pkg
   cd ../Test
   npx webpack --mode development
   ```

### Localization Not Working

**Symptoms:**
- Era names don't change when switching language
- UI stays in English

**Solution:**
1. Check browser console for errors
2. Verify Rust i18n backend has translations:
   ```bash
   grep "Era" flyingcircusrust/src/lib.rs
   ```
3. Check locale is actually changing:
   - Open browser console
   - Type: `localStorage.getItem('language')`
   - Should show current language code

### Era Dropdown Empty

**Symptoms:**
- Era dropdown has no options

**Solution:**
1. Check that UIBindings are working:
   - Open browser console
   - Look for errors in WASM calls
2. Verify `flyingcircusrust/src/era.rs` has UIBindings derive:
   ```rust
   #[derive(UIBindings)]
   pub struct Era {
       // ...
   }
   ```

## Development Workflow

### Making Changes to Rust Code

1. Edit Rust files in `flyingcircusrust/src/`
2. Rebuild WASM:
   ```bash
   cd flyingcircuswasm
   wasm-pack build --target bundler --out-dir ../Test/pkg
   ```
3. Reload page (no webpack rebuild needed for WASM-only changes)

### Making Changes to TypeScript Code

1. Edit TypeScript files in `Test/src/`
2. Rebuild TypeScript:
   ```bash
   cd Test
   npx webpack --mode development
   ```
3. Reload page

### Making Changes to Both

1. Edit files
2. Rebuild both:
   ```bash
   # Terminal 1: Rebuild WASM
   cd flyingcircuswasm
   wasm-pack build --target bundler --out-dir ../Test/pkg

   # Terminal 2: Rebuild TypeScript
   cd Test
   npx webpack --mode development
   ```
3. Reload page

### Watch Mode (Recommended)

For development, use webpack watch mode:

```bash
cd Test
npx webpack watch --mode development
```

This automatically rebuilds when TypeScript files change. You'll still need to manually rebuild WASM when Rust files change.

## Next Steps After Era Works

Once Era component is working:

1. **Add Propeller component** - Another simple component
2. **Add Cockpits component** - More complex with multiple UI elements
3. **Add Engines component** - Complex with engine builder
4. **Continue migrating components** - Gradually replace TypeScript

## Performance Notes

- Initial WASM load: ~100-500ms (depending on file size)
- Language switching: < 10ms (instant re-render)
- Stats calculation: < 1ms (Rust is fast!)
- UIBinding generation: < 5ms per component

## Known Limitations

- **WASM build requires network** (for downloading crates)
- **No hot module reload** for WASM (must rebuild manually)
- **Larger initial bundle** (~200KB WASM + JS)
- **Browser compatibility**: Requires WebAssembly support (all modern browsers)

## Success Criteria

✅ Era dropdown appears and works
✅ Language switching updates Era names
✅ Selecting Era recalculates stats
✅ URL parameters work (?lang=de)
✅ No console errors
✅ Language preference persists

If all above work, Phase 2 is complete! 🎉
