"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import LayoutAdmin from "@/components/LayoutAdmin";
import {
  Box,
  TextField,
  Paper,
  Typography,
  Fab,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from '@mui/icons-material/Close';

import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/types/redux/global";
import { changeMode, selectTheme } from "@/store/reducers/themesSlice";
import type { Workspace, Note } from "@/types/db";

import { useVirtualizer } from "@tanstack/react-virtual";

import CircularProgress from "@mui/material/CircularProgress";

type GroupedItem =
  | { type: "header"; date: string }
  | { type: "note"; note: Note };

function toLocalDay(date: Date) {
  return (
    date.getFullYear() +
    "-" +
    String(date.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(date.getDate()).padStart(2, "0")
  );
}

function groupNotesByDate(notes: Note[]): GroupedItem[] {
  const map = new Map<string, Note[]>();
  for (const note of notes) {
    if (!note.createdAt) continue;
    const day = toLocalDay(new Date(note.createdAt));
    if (!map.has(day)) map.set(day, []);
    map.get(day)!.push(note);
  }
  const result: GroupedItem[] = [];
  Array.from(map.entries())
    .sort((a, b) => (a[0] < b[0] ? 1 : -1))
    .forEach(([date, notes]) => {
      result.push({ type: "header", date });
      notes.forEach((note) => result.push({ type: "note", note }));
    });
  return result;
}

function formatDateLabel(date: string) {
  const d = new Date(date + "T00:00:00");
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (d.toDateString() === today.toDateString()) return "Hoy";
  if (d.toDateString() === yesterday.toDateString()) return "Ayer";

  return d.toLocaleDateString("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function Dashboard() {

  const activeWorkspaceId = useSelector(
    (state: RootState) => state.workspace.activeWorkspaceId
  );

  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [input, setInput] = useState("");
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [editingText, setEditingText] = useState("");
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [deleteWorkspaceId, setDeleteWorkspaceId] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);

  const parentRef = useRef<HTMLDivElement>(null);

  type SearchFilters = {
    text?: string;
    preset?: "today" | "yesterday" | "week" | "month";
    year?: number;
    from?: string;
    to?: string;
  };

  const [filters, setFilters] = useState<SearchFilters>({});

  const dispatch = useDispatch();
  const mode = useSelector((state: RootState) => state.themes.mode);
  const theme = useSelector(selectTheme);

  const loadWorkspaces = async () => {
    setLoading(true);
    const res = await fetch("/api/workspaces");
    const data = await res.json();
    setWorkspaces(data);
    setLoading(false);
  };

  useEffect(() => {
    loadWorkspaces();
  }, []);

  useEffect(() => {
    if (!activeWorkspaceId) return;

    setLoading(true);
    fetch(`/api/notes?workspaceId=${activeWorkspaceId}`)
      .then((r) => r.json())
      .then((data) => {
        setNotes(data);
        setLoading(false);
      });
  }, [activeWorkspaceId]);

  const handleSend = async () => {
    if (!input.trim() || !activeWorkspaceId) return;

    const res = await fetch("/api/notes", {
      method: "POST",
      body: JSON.stringify({
        text: input,
        id_workspace: activeWorkspaceId,
      }),
      headers: { "Content-Type": "application/json" },
    });

    const note = await res.json();
    setNotes((prev) => [note, ...prev]);
    setInput("");
  };

  const handleSaveEdit = async () => {
    if (!editingNote || !editingText.trim()) return;

    await fetch("/api/notes", {
      method: "PUT",
      body: JSON.stringify({ id: editingNote.id, text: editingText }),
      headers: { "Content-Type": "application/json" },
    });

    if (activeWorkspaceId) {
      fetch(`/api/notes?workspaceId=${activeWorkspaceId}`)
        .then((r) => r.json())
        .then(setNotes);
    }

    setEditingNote(null);
    setEditingText("");
  };

  const confirmDelete = async () => {
    if (!deleteTargetId) return;

    await fetch("/api/notes", {
      method: "DELETE",
      body: JSON.stringify({ id: deleteTargetId }),
      headers: { "Content-Type": "application/json" },
    });

    setNotes((prev) => prev.filter((n) => n.id !== deleteTargetId));
    setDeleteTargetId(null);
    setEditingNote(null);
    setEditingText("");
  };

  const visibleNotes = useMemo(() => {
    return notes.filter(note => {
      const created = new Date(note.createdAt);

      if (
        filters.text &&
        !note.text.toLowerCase().includes(filters.text.toLowerCase())
      ) {
        return false;
      }

      if (filters.preset) {
        const now = new Date();

        if (filters.preset === "today") {
          if (created.toDateString() !== now.toDateString()) return false;
        }

        if (filters.preset === "yesterday") {
          const yesterday = new Date();
          yesterday.setDate(now.getDate() - 1);
          if (created.toDateString() !== yesterday.toDateString()) return false;
        }

        if (filters.preset === "week") {
          const startOfWeek = new Date();
          startOfWeek.setDate(now.getDate() - now.getDay());
          startOfWeek.setHours(0, 0, 0, 0);
          if (created < startOfWeek) return false;
        }

        if (filters.preset === "month") {
          if (
            created.getMonth() !== now.getMonth() ||
            created.getFullYear() !== now.getFullYear()
          ) {
            return false;
          }
        }
      }

      if (filters.year && created.getFullYear() !== filters.year) {
        return false;
      }

      if (filters.from) {
        const from = new Date(filters.from);
        from.setHours(0, 0, 0, 0);
        if (created < from) return false;
      }

      if (filters.to) {
        const to = new Date(filters.to);
        to.setHours(23, 59, 59, 999);
        if (created > to) return false;
      }

      return true;
    });
  }, [notes, filters]);

  const groupedItems = useMemo(
    () => groupNotesByDate(visibleNotes),
    [visibleNotes]
  );

  useEffect(() => {
    if (!notes.length) return;

    setLoading(true);
    const t = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(t);
  }, [filters]);

  const rowVirtualizer = useVirtualizer({
    count: groupedItems.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 100,
    overscan: 10,
    paddingEnd: 20,
  });

  useEffect(() => {
    rowVirtualizer.measure();
  }, [groupedItems]);

  const handleCreateWorkspace = async (name: string) => {
    const res = await fetch("/api/workspaces", {
      method: "POST",
      body: JSON.stringify({ name }),
      headers: { "Content-Type": "application/json" },
    });
    const ws = await res.json();
    setWorkspaces((prev) => [...prev, ws]);
  };

  const handleRenameWorkspace = async (id: string, name: string) => {
    await fetch("/api/workspaces", {
      method: "PUT",
      body: JSON.stringify({ id, name }),
      headers: { "Content-Type": "application/json" },
    });
    setWorkspaces((prev) =>
      prev.map((ws) => (ws.id === id ? { ...ws, name } : ws))
    );
  };

  const handleDeleteWorkspace = (id: string) => {
    setDeleteWorkspaceId(id);
  };

  const confirmDeleteWorkspace = async () => {
    if (!deleteWorkspaceId) return;

    await fetch("/api/workspaces", {
      method: "DELETE",
      body: JSON.stringify({ id: deleteWorkspaceId }),
      headers: { "Content-Type": "application/json" },
    });

    setWorkspaces((prev) =>
      prev.filter((ws) => ws.id !== deleteWorkspaceId)
    );
    setDeleteWorkspaceId(null);
  };

  const isSearching = Object.keys(filters).length > 0;

  return (
    <LayoutAdmin
      workspaces={workspaces}
      onSearch={setFilters}
      onResetSearch={() => setFilters({})}
      onCreateWorkspace={handleCreateWorkspace}
      onRenameWorkspace={handleRenameWorkspace}
      onDeleteWorkspace={handleDeleteWorkspace}
    >

      {
        loading && (
          <Box
            sx={{
              position: "fixed",
              inset: 0,
              zIndex: 2000,
              backdropFilter: "blur(6px)",
              backgroundColor: "rgba(0,0,0,0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.3s ease",
            }}
          >
            <CircularProgress size={48} thickness={4} />
          </Box>
        )
      }

      {!loading && notes.length === 0 && (
        <Box
          sx={{
            height: "calc(100vh - 64px - 110px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            px: 3,
          }}
        >
          <Box sx={{ maxWidth: 420, opacity: 0.85 }}>
            <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>
              No hay notas en este workspace
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.7 }}>
              Empezá escribiendo una nota abajo para guardar ideas o recordatorios
            </Typography>
          </Box>
        </Box>
      )}

      {!loading && notes.length > 0 && visibleNotes.length === 0 && isSearching && (
        <Box
          sx={{
            height: "calc(100vh - 64px - 110px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            px: 3,
          }}
        >
          <Box sx={{ maxWidth: 420, opacity: 0.85 }}>
            <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>
              No se encontraron notas
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.7 }}>
              Probá cambiando los filtros o el texto de búsqueda
            </Typography>
          </Box>
        </Box>
      )}

      {groupedItems.length > 0 && (
        <Box
          ref={parentRef}
          sx={{
            height: "calc(100vh - 64px - 110px)",
            overflowY: "auto",
            px: 3,
            pt: 2,
            pb: 12,
          }}
        >
          <Box
            sx={{
              height: rowVirtualizer.getTotalSize(),
              position: "relative",
              width: "100%",
            }}
          >
            {rowVirtualizer.getVirtualItems().map((vRow) => {
              const item = groupedItems[vRow.index];
              if (!item) return null;

              const ref = (el: HTMLDivElement | null) => {
                if (el) rowVirtualizer.measureElement(el);
              };

              return (

                <Box
                  key={item.type === "note" ? item.note.id : item.date}
                  data-index={vRow.index}
                  ref={ref}
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    transform: `translateY(${vRow.start}px)`,
                    pb: 2,
                  }}
                >
                  {item.type === "header" ? (
                    <Box sx={{ py: 1 }}>
                      <Typography fontWeight={800}>
                        {formatDateLabel(item.date)}
                      </Typography>
                    </Box>
                  ) : (
                    <Paper
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        cursor: "pointer",
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                        overflowWrap: "anywhere",
                        backgroundColor: theme.palette.background.paper
                      }}
                      onClick={() => {
                        setEditingNote(item.note);
                        setEditingText(item.note.text);
                      }}
                    >
                      <Typography variant="caption" sx={{ opacity: 0.6 }}>
                        {new Date(item.note.createdAt).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                          hour12: true,
                        })}
                      </Typography>
                      <Typography sx={{ mt: 0.5 }}>{item.note.text}</Typography>
                    </Paper>
                  )}
                </Box>
              );
            })}
          </Box>
        </Box>
      )}

      <Fab
        size="small"
        sx={{
          position: "fixed",
          bottom: 150,
          right: 24,
          zIndex: 10,

          backgroundColor: theme.palette.success.main,
          color: theme.palette.background.default,
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: theme.shadows[2],
          backdropFilter: "blur(4px)",
          "&:hover": {
            backgroundColor: theme.palette.success.dark,
          },

        }}
        onClick={() => rowVirtualizer.scrollToIndex(0)}
      >
        <KeyboardArrowUpIcon />
      </Fab>

      <Fab
        size="small"
        sx={{
          position: "fixed",
          bottom: 100,
          right: 24,
          zIndex: 10,

          backgroundColor: theme.palette.success.main,
          color: theme.palette.background.default,
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: theme.shadows[2],
          backdropFilter: "blur(4px)",
          "&:hover": {
            backgroundColor: theme.palette.success.dark,
          },

        }}
        onClick={() =>
          rowVirtualizer.scrollToIndex(groupedItems.length - 1, { align: "end" })
        }
      >
        <KeyboardArrowDownIcon />
      </Fab>

      <Box
        sx={{
          position: "fixed",
          bottom: 0,
          width: "100%",
          px: 3,
          py: 2,
          backgroundColor: "background.default",
          zIndex: 5,
        }}
      >
        <TextField
          multiline
          fullWidth
          placeholder="Escribí tu mensaje… (Ctrl + Enter)"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && e.ctrlKey && handleSend()}
        />
      </Box>

      <Dialog
        open={!!editingNote}
        onClose={() => {
          setEditingNote(null);
        }}
        fullScreen
        maxWidth="sm"
      >
        <DialogTitle sx={{ fontSize: 31, fontWeight: 800, position: "relative", textAlign: "center", px: 4 }}>
          Editar nota
          <IconButton
            onClick={() => {
              setEditingNote(null);
            }}
            sx={{
              position: "absolute",
              right: 8,
              top: "50%",
              transform: "translateY(-50%)"
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{
          p: 3,
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}>
          <TextField
            multiline
            fullWidth
            value={editingText}
            onChange={(e) => setEditingText(e.target.value)}
            sx={{ flex: 1 }}
            InputProps={{
              sx: {
                height: "100%",
                alignItems: "flex-start",
                overflowY: "auto",
              },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ justifyContent: "flex-end", gap: 2, px: 3, pb: 2 }}>
          <Button
            onClick={() => {
              setEditingNote(null);
            }}
            variant="outlined"
            color="secondary"
            sx={{
              minWidth: 100
            }}
          >
            Cancelar
          </Button>
          <Button color="primary" variant="outlined" startIcon={<SaveIcon />} onClick={handleSaveEdit} sx={{ minWidth: 120 }}>
            Guardar
          </Button>
          <Button color="error" variant="outlined" startIcon={<DeleteIcon />} onClick={() => setDeleteTargetId(editingNote?.id || null)} sx={{ minWidth: 120 }}>
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!deleteTargetId} onClose={() => setDeleteTargetId(null)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontSize: 28, fontWeight: 800, textAlign: "center", px: 4 }}>
          Eliminar nota
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ mt: 1, textAlign: "center" }}>
            ¿Estás seguro de que querés eliminar esta nota?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "flex-end", gap: 2, px: 3, pb: 2 }}>
          <Button onClick={() => setDeleteTargetId(null)} variant="outlined" sx={{ minWidth: 100 }}>
            Cancelar
          </Button>
          <Button color="error" variant="outlined" sx={{ minWidth: 120 }} onClick={confirmDelete}>
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!deleteWorkspaceId} onClose={() => setDeleteWorkspaceId(null)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontSize: 28, fontWeight: 800, textAlign: "center", position: "relative", px: 4 }}>
          Eliminar workspace
          <IconButton
            onClick={() => setDeleteWorkspaceId(null)}
            sx={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)" }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ mt: 2, textAlign: "center", fontSize: 18 }}>
            ¿Estás seguro de que querés eliminar este workspace? Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "flex-end", gap: 2, px: 3, pb: 2 }}>
          <Button onClick={() => setDeleteWorkspaceId(null)} variant="outlined" sx={{ minWidth: 100 }}>
            Cancelar
          </Button>
          <Button color="error" variant="outlined" sx={{ minWidth: 120 }} onClick={confirmDeleteWorkspace}>
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </LayoutAdmin >
  );
}