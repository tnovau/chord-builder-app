# ChordBuilder 🎸

Identifica acordes de guitarra a partir de notas y visualiza su posición en el mástil.

## Stack

- **Next.js 14** (App Router)
- **TypeScript** (strict mode)
- **Tailwind CSS** (paleta `wood` personalizada)
- **Web Audio API** (síntesis de audio sin dependencias)
- **SVG nativo** (diagramas de mástil)

## Estructura del proyecto

```
chordbuilder/
├── app/
│   ├── api/chord/route.ts   ← API REST: POST /api/chord
│   ├── layout.tsx           ← Fuentes (Playfair + Source Serif 4)
│   ├── page.tsx             ← Página principal
│   └── globals.css          ← Tailwind + animaciones
├── components/
│   ├── ChordBuilder.tsx     ← Componente principal (Client)
│   ├── ChordDiagram.tsx     ← Diagrama SVG del mástil
│   └── NoteInput.tsx        ← Input con chips de notas
├── lib/
│   ├── music.ts             ← Motor de teoría musical
│   ├── fretboard.ts         ← Algoritmo de posiciones en mástil
│   └── audio.ts             ← Web Audio API
├── types/
│   └── music.ts             ← Tipos TypeScript
├── tailwind.config.ts
├── tsconfig.json
└── next.config.ts
```

## Puesta en marcha

```bash
# 1. Instalar dependencias
npm install

# 2. Servidor de desarrollo
npm run dev

# 3. Abrir en el navegador
open http://localhost:3000
```

## API REST

```http
POST /api/chord
Content-Type: application/json

{ "notes": ["F", "Eb", "A", "C#"] }
```

Respuesta:
```json
{
  "chords": [
    {
      "root": "F",
      "name": "F7(#5)",
      "formula": "7(#5)",
      "intervals": [0, 4, 8, 10],
      "notes": ["F", "D#", "A", "C#"]
    }
  ],
  "positions": [ ... ]
}
```

## Próximos pasos (roadmap)

- [ ] Auth con Supabase (guardar acordes favoritos)
- [ ] Exportar diagrama como PNG
- [ ] Integrar `tonal.js` para cubrir más acordes exóticos
- [ ] Modo "practice": genera ejercicios de ditado de acordes
- [ ] Soporte para diferentes afinaciones (Drop D, DADGAD…)
