"use client";

import * as React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItemButton,
  TextField,
  Tooltip,
  CssBaseline,
  Button,
  Stack,
  Divider,
  Chip,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";

import WysiwygIcon from "@mui/icons-material/Wysiwyg";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import WbSunnyIcon from "@mui/icons-material/WbSunny";

import InfoIcon from '@mui/icons-material/Info';

import { ThemeProvider } from "@mui/material/styles";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";

import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/types/redux/global";
import { changeMode, selectTheme } from "@/store/reducers/themesSlice";
import { setActiveWorkspace } from "@/store/reducers/workspaceSlice";

import type { Workspace } from "@/types/db";

import AboutModal from "@/components/AboutModal";

import {
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { useState } from "react";

export type SearchFilters = {
  text?: string;
  preset?: "today" | "yesterday" | "week" | "month";
  year?: number;
  from?: string;
  to?: string;
};

type LayoutAdminProps = {
  children: React.ReactNode;
  workspaces: Workspace[];
  onCreateWorkspace?: (name: string) => void;
  onRenameWorkspace?: (id: string, name: string) => void;
  onDeleteWorkspace?: (id: string) => void;
  onSearch: (filters: SearchFilters) => void;
  onResetSearch: () => void;
};

export default function LayoutAdmin({
  children,
  workspaces,
  onCreateWorkspace,
  onRenameWorkspace,
  onDeleteWorkspace,
  onSearch,
  onResetSearch,
}: LayoutAdminProps) {
  const dispatch = useDispatch();
  const mode = useSelector((state: RootState) => state.themes.mode);
  const theme = useSelector(selectTheme);
  const activeWorkspaceId = useSelector(
    (state: RootState) => state.workspace.activeWorkspaceId
  );

  const [workspaceLocked, setWorkspaceLocked] = useState(false);

  const activeWorkspace = workspaces.find(w => w.id === activeWorkspaceId);

  const [openWorkspace, setOpenWorkspace] = React.useState(false);
  const [openSearch, setOpenSearch] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [editName, setEditName] = React.useState("");
  const [newWorkspace, setNewWorkspace] = React.useState("");
  const [workspaceSearch, setWorkspaceSearch] = React.useState("");

  const [filters, setFilters] = React.useState<SearchFilters>({});

  const [openAbout, setOpenAbout] = useState(false);

  const handleOpenAbout = () => setOpenAbout(true);
  const handleCloseAbout = () => setOpenAbout(false);

  React.useEffect(() => {
    if (!activeWorkspaceId && workspaces.length > 0) {
      dispatch(setActiveWorkspace(workspaces[0].id));
    }
  }, [activeWorkspaceId, workspaces, dispatch]);

  const filteredWorkspaces = workspaces.filter(ws =>
    ws.name.toLowerCase().includes(workspaceSearch.toLowerCase())
  );

  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />

        <AppBar
          position="fixed"
          elevation={0}
          sx={{
            borderRadius: 0,
          }}
        >
          <Toolbar
            sx={{
              justifyContent: "space-between",
              backgroundColor: theme.palette.customNavbar?.background,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <WysiwygIcon />
              <Typography fontWeight={600}>Light Notes</Typography>

              <Box sx={{ cursor: "pointer" }} onClick={() => setOpenWorkspace(true)}>
                <Typography variant="body2">
                  {activeWorkspace?.name ?? "—"} ▾
                </Typography>
              </Box>
            </Box>

            <Box>
              <Tooltip title="Buscar">
                <IconButton onClick={() => setOpenSearch(true)}>
                  <SearchIcon />
                </IconButton>
              </Tooltip>

              <Tooltip title="Tema">
                <IconButton
                  onClick={() =>
                    dispatch(
                      changeMode({
                        mode: mode === "light" ? "dark" : "light",
                      })
                    )
                  }
                >
                  {mode === "light" ? <DarkModeIcon /> : <WbSunnyIcon />}
                </IconButton>
              </Tooltip>

              <Tooltip title="About">
                <IconButton onClick={() => handleOpenAbout()}>
                  <InfoIcon />
                </IconButton>
              </Tooltip>

            </Box>
          </Toolbar>
        </AppBar>

        <Dialog open={openSearch} onClose={() => setOpenSearch(false)} fullWidth maxWidth="sm">
          <DialogTitle sx={{ fontSize: 31, fontWeight: 800, textAlign: "center" }}>
            Buscar notas
            <IconButton sx={{ position: "absolute", right: 8 }} onClick={() => setOpenSearch(false)}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>

          <DialogContent>
            <Stack spacing={2} mt={2}>
              <TextField
                label="Texto"
                value={filters.text ?? ""}
                onChange={e => setFilters(f => ({ ...f, text: e.target.value }))}
              />

              <ToggleButtonGroup
                value={filters.preset ?? null}
                exclusive
                onChange={(_, value) =>
                  setFilters(f => ({
                    ...f,
                    preset: value ?? undefined,
                    from: undefined,
                    to: undefined,
                  }))
                }
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 1.2,

                  "& .MuiToggleButton-root": {
                    borderRadius: 2,
                    textTransform: "none",
                    px: 2,
                    py: 0.75,
                    border: `1px solid ${theme.palette.divider}`,
                    color: theme.palette.text.secondary,
                    transition: "all 0.2s ease",
                  },

                  "& .MuiToggleButton-root:hover": {
                    backgroundColor: theme.palette.action.hover,
                  },

                  "& .Mui-selected": {
                    color: theme.palette.customButton?.colorText,
                    fontWeight: 700,
                    boxShadow: theme.shadows[2],
                    borderColor: theme.palette.primary.main,
                  },
                }}
              >
                <ToggleButton value="today">Hoy</ToggleButton>
                <ToggleButton value="yesterday">Ayer</ToggleButton>
                <ToggleButton value="week">Esta semana</ToggleButton>
                <ToggleButton value="month">Este mes</ToggleButton>
              </ToggleButtonGroup>

              <TextField
                type="number"
                label="Año"
                value={filters.year ?? ""}
                onChange={e => setFilters(f => ({ ...f, year: Number(e.target.value) }))}
              />

              <Divider />

              <Stack direction="row" spacing={2}>
                <TextField
                  type="date"
                  label="Desde"
                  InputLabelProps={{ shrink: true }}
                  value={filters.from ?? ""}
                  onChange={e =>
                    setFilters(f => ({ ...f, from: e.target.value, preset: undefined }))
                  }
                />
                <TextField
                  type="date"
                  label="Hasta"
                  InputLabelProps={{ shrink: true }}
                  value={filters.to ?? ""}
                  onChange={e =>
                    setFilters(f => ({ ...f, to: e.target.value, preset: undefined }))
                  }
                />
              </Stack>

              <Stack direction="row" justifyContent="space-between">
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => {
                    setFilters({});
                    onResetSearch();
                    setOpenSearch(false);
                  }}
                >
                  Resetear
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => {
                    onSearch(filters);
                    setOpenSearch(false);
                  }}
                >
                  Buscar
                </Button>
              </Stack>
            </Stack>
          </DialogContent>
        </Dialog>

        <Dialog open={openWorkspace} maxWidth="xs" fullWidth>
          <DialogTitle
            sx={{ fontSize: 28, fontWeight: 800, textAlign: "center" }}
          >
            Workspaces
            <IconButton
              disabled={workspaceLocked}
              sx={{ position: "absolute", right: 8 }}
              onClick={() => setOpenWorkspace(false)}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>

          <DialogContent>
            <Stack spacing={2} mb={2}>
              <TextField
                size="small"
                placeholder="Buscar workspace..."
                value={workspaceSearch}
                onChange={e => setWorkspaceSearch(e.target.value)}
                disabled={workspaceLocked}
              />

              <TextField
                size="small"
                placeholder="Nuevo workspace"
                value={newWorkspace}
                onChange={e => setNewWorkspace(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <IconButton
                      onClick={() => {
                        if (!newWorkspace.trim() || !onCreateWorkspace) return;
                        onCreateWorkspace(newWorkspace);
                        setNewWorkspace("");
                      }}
                      disabled={workspaceLocked || !onCreateWorkspace}
                    >
                      <AddIcon />
                    </IconButton>
                  ),
                }}
              />
            </Stack>

            <Divider />

            <List
              sx={{
                maxHeight: 300,
                overflowY: "auto",
                pr: 1,
              }}
            >
              {filteredWorkspaces.map((ws) => {
                const isEditingThis = editingId === ws.id;
                const isBlocked = workspaceLocked && !isEditingThis;

                return (
                  <ListItemButton
                    key={ws.id}
                    selected={ws.id === activeWorkspaceId}
                    disabled={isBlocked}
                    onClick={() => {
                      if (isBlocked) return;
                      dispatch(setActiveWorkspace(ws.id));
                      setOpenWorkspace(false);
                    }}
                    sx={{
                      borderRadius: 2,
                      mb: 0.5,
                      opacity: isBlocked ? 0.5 : 1,
                      cursor: isBlocked ? "not-allowed" : "pointer",
                      ...(ws.id === activeWorkspaceId && {
                        backgroundColor: theme.palette.action.selected,
                        border: `1px solid ${theme.palette.primary.main}`,
                      }),
                    }}
                  >
                    <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center", gap: 1 }}>
                      {isEditingThis ? (
                        <TextField
                          value={editName}
                          size="small"
                          autoFocus
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => setEditName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && editName.trim() && onRenameWorkspace) {
                              onRenameWorkspace(ws.id, editName);
                              setEditingId(null);
                              setWorkspaceLocked(false);
                            }
                          }}
                        />
                      ) : (
                        <>
                          <Typography>{ws.name}</Typography>
                          {ws.id === activeWorkspaceId && (
                            <Chip label="Activo" size="small" sx={{ fontWeight: 600 }} />
                          )}
                        </>
                      )}
                    </Box>

                    <IconButton
                      color="primary"
                      size="small"
                      disabled={isBlocked || !onRenameWorkspace}
                      onClick={(e) => {
                        e.stopPropagation();

                        if (isEditingThis) {
                          if (!editName.trim()) return;
                          onRenameWorkspace?.(ws.id, editName);
                          setEditingId(null);
                          setWorkspaceLocked(false);
                        } else {
                          setEditingId(ws.id);
                          setEditName(ws.name);
                          setWorkspaceLocked(true);
                        }
                      }}
                    >
                      {isEditingThis ? (
                        <SaveIcon fontSize="small" />
                      ) : (
                        <EditIcon fontSize="small" />
                      )}
                    </IconButton>

                    <IconButton
                      size="small"
                      color="warning"
                      disabled={workspaceLocked || !onDeleteWorkspace}
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteWorkspace?.(ws.id);
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </ListItemButton>
                );
              })}
            </List>

          </DialogContent>
        </Dialog>

        <AboutModal open={openAbout} handleClose={handleCloseAbout} />

        <main style={{ marginTop: 64 }}>{children}</main>

      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}