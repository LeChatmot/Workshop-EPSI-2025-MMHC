import React, { useState, useEffect } from 'react'
import { Shell } from '../../components/Shell/Shell'
import { Box, Typography, Paper, TextField, Button, IconButton } from '@mui/material'

interface Task {
  id: string
  title: string
  description: string
}

interface Column {
  id: string
  title: string
  tasks: Task[]
}

const initialColumns: Column[] = [
  {
    id: 'todo',
    title: 'À faire',
    tasks: [
      { id: '1', title: 'Implémenter le login', description: 'Créer le formulaire de connexion' },
      { id: '2', title: 'Design UI/UX', description: 'Créer les maquettes' },
    ],
  },
  { id: 'inProgress', title: 'En cours', tasks: [] },
  { id: 'done', title: 'Terminé', tasks: [] },
]

interface KanbanPageProps {
  userPeerId?: string
  appNeedsUpdate?: boolean
}

export const KanbanPage: React.FC<KanbanPageProps> = ({
  userPeerId = 'default',
  appNeedsUpdate = false,
}) => {
  const storageKey = `kanbanColumns:${userPeerId}`

  // Chargement depuis localStorage
  const [columns, setColumns] = useState<Column[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey)
      return saved ? (JSON.parse(saved) as Column[]) : initialColumns
    } catch {
      return initialColumns
    }
  })

  // Persistance
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(columns))
    } catch {
      /* ignore */
    }
  }, [columns, storageKey])

  const [isAddingTask, setIsAddingTask] = useState(false)
  const [newTask, setNewTask] = useState({ title: '', description: '' })
  const [dragOverColumnId, setDragOverColumnId] = useState<string | null>(null)

  const handleAddTask = () => {
    if (!newTask.title.trim()) return
    setColumns((prev) =>
      prev.map((col) =>
        col.id === 'todo'
          ? {
              ...col,
              tasks: [
                ...col.tasks,
                {
                  id: crypto.randomUUID(),
                  title: newTask.title.trim(),
                  description: newTask.description.trim(),
                },
              ],
            }
          : col
      )
    )
    setNewTask({ title: '', description: '' })
    setIsAddingTask(false)
  }

  // 🔥 Suppression d'une tâche
  const handleRemoveTask = (columnId: string, taskId: string) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.id === columnId ? { ...col, tasks: col.tasks.filter((t) => t.id !== taskId) } : col
      )
    )
  }

  // Déplacement d'une tâche entre colonnes
  const moveTask = (taskId: string, fromColumnId: string, toColumnId: string) => {
    if (fromColumnId === toColumnId) return
    setColumns((prev) => {
      const fromCol = prev.find((c) => c.id === fromColumnId)
      const toCol = prev.find((c) => c.id === toColumnId)
      if (!fromCol || !toCol) return prev

      const taskIndex = fromCol.tasks.findIndex((t) => t.id === taskId)
      if (taskIndex === -1) return prev
      const task = fromCol.tasks[taskIndex]

      return prev.map((c) => {
        if (c.id === fromColumnId) {
          return { ...c, tasks: c.tasks.filter((t) => t.id !== taskId) }
        }
        if (c.id === toColumnId) {
          return { ...c, tasks: [...c.tasks, task] }
        }
        return c
      })
    })
  }

  // Drag & Drop
  const onTaskDragStart = (e: React.DragEvent, taskId: string, fromColumnId: string) => {
    e.dataTransfer.setData('application/json', JSON.stringify({ taskId, fromColumnId }))
    e.dataTransfer.effectAllowed = 'move'
  }

  const onColumnDragOver = (e: React.DragEvent, columnId: string) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOverColumnId(columnId)
  }

  const onColumnDragLeave = (columnId: string) => {
    setDragOverColumnId((prev) => (prev === columnId ? null : prev))
  }

  const onColumnDrop = (e: React.DragEvent, toColumnId: string) => {
    e.preventDefault()
    setDragOverColumnId(null)
    try {
      const data = e.dataTransfer.getData('application/json')
      const { taskId, fromColumnId } = JSON.parse(data || '{}')
      if (taskId && fromColumnId) moveTask(taskId, fromColumnId, toColumnId)
    } catch {
      /* ignore */
    }
  }

  return (
    <Shell userPeerId={userPeerId} appNeedsUpdate={appNeedsUpdate}>
      <Box>
        <Typography variant="h4" sx={{ mb: 3, color: 'white' }}>
          Kanban Board
        </Typography>

        {/* Zone d'ajout simple */}
        <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'flex-start' }}>
          {!isAddingTask ? (
            <Button variant="contained" onClick={() => setIsAddingTask(true)}>
              Ajouter une tâche
            </Button>
          ) : (
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <TextField
                label="Titre"
                size="small"
                value={newTask.title}
                onChange={(e) => setNewTask((t) => ({ ...t, title: e.target.value }))}
              />
              <TextField
                label="Description"
                size="small"
                value={newTask.description}
                onChange={(e) => setNewTask((t) => ({ ...t, description: e.target.value }))}
              />
              <Button variant="contained" onClick={handleAddTask}>
                Ajouter
              </Button>
              <Button variant="text" onClick={() => setIsAddingTask(false)}>
                Annuler
              </Button>
            </Box>
          )}
        </Box>

        <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto' }}>
          {columns.map((column) => (
            <Paper
              key={column.id}
              onDragOver={(e) => onColumnDragOver(e, column.id)}
              onDragLeave={() => onColumnDragLeave(column.id)}
              onDrop={(e) => onColumnDrop(e, column.id)}
              sx={{
                p: 2,
                minWidth: 300,
                bgcolor:
                  dragOverColumnId === column.id
                    ? 'rgba(255,255,255,0.18)'
                    : 'rgba(255,255,255,0.1)',
                outline:
                  dragOverColumnId === column.id ? '2px dashed rgba(255,255,255,0.6)' : 'none',
                color: 'white',
                transition: 'background-color 120ms ease',
              }}
              elevation={3}
            >
              <Typography variant="h6" sx={{ mb: 1 }}>
                {column.title}
              </Typography>

              <Box sx={{ display: 'grid', gap: 1 }}>
                {column.tasks.map((task) => (
                  <Paper
                    key={task.id}
                    draggable
                    onDragStart={(e) => onTaskDragStart(e, task.id, column.id)}
                    sx={{
                      position: 'relative',
                      p: 1.5,
                      bgcolor: 'rgba(255,255,255,0.08)',
                      color: 'white',
                      cursor: 'grab',
                      userSelect: 'none',
                      '&:hover .task-close': { opacity: 1 },
                    }}
                    elevation={0}
                    aria-grabbed="true"
                  >
                    {/* Bouton X qui apparaît au survol */}
                    <IconButton
                      className="task-close"
                      aria-label="Supprimer la tâche"
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleRemoveTask(column.id, task.id)
                      }}
                      onMouseDown={(e) => e.stopPropagation()} // évite de déclencher un drag
                      onDragStart={(e) => e.stopPropagation()}
                      sx={{
                        position: 'absolute',
                        top: 4,
                        right: 4,
                        lineHeight: 1,
                        opacity: 0,
                        transition: 'opacity 120ms ease',
                        bgcolor: 'rgba(0,0,0,0.25)',
                        '&:hover': { bgcolor: 'rgba(0,0,0,0.45)' },
                        color: 'white',
                        width: 24,
                        height: 24,
                        fontSize: 14,
                      }}
                    >
                      ×
                    </IconButton>

                    <Typography variant="subtitle1" sx={{ fontWeight: 600, pr: 3 }}>
                      {task.title}
                    </Typography>
                    {task.description && (
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        {task.description}
                      </Typography>
                    )}
                  </Paper>
                ))}

                {column.tasks.length === 0 && (
                  <Typography variant="body2" sx={{ opacity: 0.8, fontStyle: 'italic' }}>
                    Aucune tâche
                  </Typography>
                )}
              </Box>
            </Paper>
          ))}
        </Box>
      </Box>
    </Shell>
  )
}

export default KanbanPage
