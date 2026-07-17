"use client";

import { useId, useState } from "react";

const inputClass =
  "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none focus:border-accent";

export type ContactoExistente = {
  id: string;
  nombre: string;
  email: string | null;
};

export type ContactoFila = {
  key: string;
  contactoId: string;
  nombre: string;
  email: string;
  telefono: string;
  rol: string;
};

function filaVacia(key: string): ContactoFila {
  return { key, contactoId: "", nombre: "", email: "", telefono: "", rol: "" };
}

export function ContactosEditor({
  existentes,
  initial,
  initialPrincipalIndex,
}: {
  existentes: ContactoExistente[];
  initial?: ContactoFila[];
  initialPrincipalIndex?: number;
}) {
  const baseId = useId();
  const [filas, setFilas] = useState<ContactoFila[]>(
    initial && initial.length > 0 ? initial : [filaVacia(`${baseId}-0`)],
  );
  const [principal, setPrincipal] = useState(initialPrincipalIndex ?? 0);

  function actualizarFila(index: number, cambios: Partial<ContactoFila>) {
    setFilas((prev) =>
      prev.map((fila, i) => (i === index ? { ...fila, ...cambios } : fila)),
    );
  }

  function agregarFila() {
    setFilas((prev) => [...prev, filaVacia(`${baseId}-${prev.length}`)]);
  }

  function eliminarFila(index: number) {
    setFilas((prev) => prev.filter((_, i) => i !== index));
    setPrincipal((prev) => {
      if (index === prev) return 0;
      return index < prev ? prev - 1 : prev;
    });
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs text-muted">Contactos</p>
      {filas.map((fila, index) => {
        const usaExistente = fila.contactoId !== "";
        return (
          <div
            key={fila.key}
            className="flex flex-col gap-2 rounded-md border border-border p-3"
          >
            <div className="flex items-center justify-between gap-2">
              <label className="flex items-center gap-1.5 text-xs text-muted">
                <input
                  type="radio"
                  name="principal_index"
                  value={index}
                  checked={principal === index}
                  onChange={() => setPrincipal(index)}
                  className="accent-accent"
                />
                Contacto principal
              </label>
              {filas.length > 1 && (
                <button
                  type="button"
                  onClick={() => eliminarFila(index)}
                  className="text-xs text-danger hover:opacity-80"
                >
                  Quitar
                </button>
              )}
            </div>

            <select
              name="contacto_existente"
              value={fila.contactoId}
              onChange={(e) => {
                const contactoId = e.target.value;
                const elegido = existentes.find((c) => c.id === contactoId);
                actualizarFila(index, {
                  contactoId,
                  nombre: elegido ? elegido.nombre : "",
                  email: elegido ? (elegido.email ?? "") : "",
                  telefono: "",
                  rol: "",
                });
              }}
              className={inputClass}
            >
              <option value="">+ Contacto nuevo</option>
              {existentes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                  {c.email ? ` (${c.email})` : ""}
                </option>
              ))}
            </select>

            <div className="grid grid-cols-2 gap-2">
              <input
                name="contacto_nombre"
                type="text"
                placeholder="Nombre"
                readOnly={usaExistente}
                value={fila.nombre}
                onChange={(e) =>
                  actualizarFila(index, { nombre: e.target.value })
                }
                className={inputClass}
              />
              <input
                name="contacto_rol"
                type="text"
                placeholder="Rol"
                readOnly={usaExistente}
                value={fila.rol}
                onChange={(e) =>
                  actualizarFila(index, { rol: e.target.value })
                }
                className={inputClass}
              />
              <input
                name="contacto_email"
                type="email"
                placeholder="Email"
                readOnly={usaExistente}
                value={fila.email}
                onChange={(e) =>
                  actualizarFila(index, { email: e.target.value })
                }
                className={inputClass}
              />
              <input
                name="contacto_telefono"
                type="text"
                placeholder="Teléfono"
                readOnly={usaExistente}
                value={fila.telefono}
                onChange={(e) =>
                  actualizarFila(index, { telefono: e.target.value })
                }
                className={inputClass}
              />
            </div>
          </div>
        );
      })}

      <button
        type="button"
        onClick={agregarFila}
        className="self-start text-xs text-accent hover:opacity-80"
      >
        + Agregar contacto
      </button>
    </div>
  );
}
