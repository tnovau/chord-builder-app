# Chord Builder App 🎸

Identifica acordes de guitarra a partir de notas y visualiza su posición en el mástil.

## Stack

- **Next.js 16** (App Router)
- **TypeScript** (strict mode)
- **Tailwind CSS** (paleta `wood` personalizada)
- **Better Auth** + **Prisma** + **PostgreSQL** (autenticación y base de datos)
- **Web Audio API** (síntesis de audio sin dependencias)
- **SVG nativo** (diagramas de mástil)

## Estructura del proyecto

```
chord-builder-app/
├── app/
│   ├── api/
│   │   ├── auth/[...all]/route.ts  ← Better Auth handler
│   │   └── chord/route.ts          ← API REST: POST /api/chord
│   ├── [lang]/
│   │   ├── layout.tsx              ← Fuentes + i18n provider
│   │   ├── page.tsx                ← Página principal
│   │   ├── login/page.tsx          ← Inicio de sesión
│   │   └── register/page.tsx       ← Registro
│   └── globals.css                 ← Tailwind + animaciones
├── components/
│   ├── ChordBuilder.tsx            ← Componente principal (Client)
│   ├── ChordDiagram.tsx            ← Diagrama SVG del mástil
│   ├── HeaderAuth.tsx              ← Nav de autenticación
│   ├── LanguageSelector.tsx        ← Selector de idioma
│   └── NoteInput.tsx               ← Input con chips de notas
├── lib/
│   ├── auth.ts                     ← Config de Better Auth (server)
│   ├── auth-client.ts              ← Auth client (React hooks)
│   ├── music.ts                    ← Motor de teoría musical
│   ├── fretboard.ts                ← Algoritmo de posiciones en mástil
│   └── audio.ts                    ← Web Audio API
├── prisma/
│   └── schema.prisma               ← Esquema de base de datos
├── i18n/
│   ├── locales/                    ← Traducciones (en.json, es.json)
│   └── types.ts                    ← Tipos de traducción
├── docs/
│   └── authentication.md           ← Documentación de autenticación
├── types/
│   └── music.ts                    ← Tipos TypeScript
├── tailwind.config.ts
├── tsconfig.json
└── next.config.ts
```

## Puesta en marcha

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno
cp .env.example .env
# Editar .env: DATABASE_URL, BETTER_AUTH_SECRET, BETTER_AUTH_URL

# 3. Generar Prisma client y correr migraciones
npx prisma generate
npx prisma migrate dev

# 4. Servidor de desarrollo
npm run dev

# 5. Abrir en el navegador
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

- [x] Autenticación con Better Auth + PostgreSQL (email/password, login, registro)
- [ ] Guardar acordes favoritos por usuario
- [ ] Exportar diagrama como PNG
- [ ] Integrar `tonal.js` para cubrir más acordes exóticos
- [ ] Modo "practice": genera ejercicios de ditado de acordes
- [ ] Soporte para diferentes afinaciones (Drop D, DADGAD…)

## Documentación

- [Autenticación](docs/authentication.md) — arquitectura, esquema de DB, flujos, guía de extensión
