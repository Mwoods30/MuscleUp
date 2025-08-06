import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faGripVertical,
  faDumbbell,
  faClock,
  faFire,
  faCheck,
  faPlus,
  faTimes,
  faEdit,
  faCopy,
  faTrash,
  faEye,
  faEyeSlash,
  faUtensils
} from '@fortawesome/free-solid-svg-icons';

// Container Components
const DragDropContainer = styled(motion.div)`
  background: ${props => props.theme.colors.surface};
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px ${props => props.theme.colors.shadowLight};
  border: 1px solid ${props => props.theme.colors.border};
  min-height: 200px;
`;

const ListHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const ListTitle = styled.h3`
  margin: 0;
  color: ${props => props.theme.colors.textPrimary};
  font-size: 1.25rem;
  font-weight: 600;
`;

const ListActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ActionButton = styled(motion.button)`
  background: ${props => props.variant === 'primary' 
    ? props.theme.colors.primary 
    : 'transparent'
  };
  color: ${props => props.variant === 'primary' 
    ? props.theme.colors.textInverse 
    : props.theme.colors.textSecondary
  };
  border: 1px solid ${props => props.variant === 'primary' 
    ? props.theme.colors.primary 
    : props.theme.colors.border
  };
  padding: 0.5rem;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.variant === 'primary' 
      ? props.theme.colors.primaryDark 
      : props.theme.colors.surfaceHover
    };
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// Sortable Item Component
const SortableItemContainer = styled(motion.div)`
  background: ${props => props.isDragging 
    ? props.theme.colors.backgroundSecondary 
    : props.theme.colors.surface
  };
  border: 2px solid ${props => props.isDragging 
    ? props.theme.colors.primary 
    : props.theme.colors.border
  };
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: ${props => props.isDragging ? 'grabbing' : 'grab'};
  transition: all 0.2s ease;
  position: relative;
  opacity: ${props => props.isHidden ? 0.5 : 1};

  &:hover {
    box-shadow: 0 4px 12px ${props => props.theme.colors.shadowMedium};
    transform: translateY(-1px);
  }

  &:last-child {
    margin-bottom: 0;
  }

  ${props => props.transform && `
    transform: ${props.transform};
  `}

  ${props => props.isDragging && `
    box-shadow: 0 8px 25px ${props.theme.colors.shadowHeavy};
    z-index: 1000;
  `}
`;

const DragHandle = styled.div`
  color: ${props => props.theme.colors.textTertiary};
  cursor: grab;
  padding: 0.25rem;
  border-radius: 4px;
  transition: all 0.2s ease;

  &:hover {
    color: ${props => props.theme.colors.textSecondary};
    background: ${props => props.theme.colors.backgroundSecondary};
  }

  &:active {
    cursor: grabbing;
  }
`;

const ItemContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const ItemHeader = styled.div`
  display: flex;
  justify-content: between;
  align-items: flex-start;
  gap: 1rem;
`;

const ItemTitle = styled.h4`
  margin: 0;
  color: ${props => props.theme.colors.textPrimary};
  font-size: 1.1rem;
  font-weight: 600;
  flex: 1;
`;

const ItemMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};
  flex-wrap: wrap;

  @media (max-width: 768px) {
    gap: 0.5rem;
  }
`;

const MetaItem = styled.span`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  white-space: nowrap;
`;

const ItemDescription = styled.p`
  margin: 0;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.875rem;
  line-height: 1.4;
`;

const ItemActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  opacity: 0;
  transition: opacity 0.2s ease;

  ${SortableItemContainer}:hover & {
    opacity: 1;
  }

  @media (max-width: 768px) {
    opacity: 1;
  }
`;

const ItemActionButton = styled(motion.button)`
  background: ${props => {
    if (props.variant === 'danger') return props.theme.colors.danger + '20';
    if (props.variant === 'success') return props.theme.colors.success + '20';
    if (props.variant === 'warning') return props.theme.colors.warning + '20';
    return props.theme.colors.primary + '20';
  }};
  color: ${props => {
    if (props.variant === 'danger') return props.theme.colors.danger;
    if (props.variant === 'success') return props.theme.colors.success;
    if (props.variant === 'warning') return props.theme.colors.warning;
    return props.theme.colors.primary;
  }};
  border: none;
  padding: 0.5rem;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  font-size: 0.875rem;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 2px 8px ${props => {
      if (props.variant === 'danger') return props.theme.colors.danger + '40';
      if (props.variant === 'success') return props.theme.colors.success + '40';
      if (props.variant === 'warning') return props.theme.colors.warning + '40';
      return props.theme.colors.primary + '40';
    }};
  }
`;

// Completion Badge
const CompletionBadge = styled(motion.div)`
  background: ${props => props.completed 
    ? props.theme.colors.success 
    : props.theme.colors.textTertiary
  };
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

// Empty State
const EmptyState = styled(motion.div)`
  text-align: center;
  padding: 3rem 1rem;
  color: ${props => props.theme.colors.textTertiary};
`;

const EmptyIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.5;
`;

// Add Item Form
const AddItemForm = styled(motion.div)`
  background: ${props => props.theme.colors.backgroundSecondary};
  border: 2px dashed ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: 1.5rem;
  margin-top: 1rem;
`;

const FormInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 0.75rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  background: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.textPrimary};
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primary}20;
  }

  &::placeholder {
    color: ${props => props.theme.colors.textTertiary};
  }
`;

const FormActions = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
`;

// Sortable Item Component
const SortableItem = ({ 
  id, 
  item, 
  onEdit, 
  onDelete, 
  onToggleComplete, 
  onToggleVisibility, 
  onDuplicate,
  showActions = true 
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <SortableItemContainer
      ref={setNodeRef}
      style={style}
      isDragging={isDragging}
      isHidden={item.hidden}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
    >
      <DragHandle {...attributes} {...listeners}>
        <FontAwesomeIcon icon={faGripVertical} />
      </DragHandle>

      <ItemContent>
        <ItemHeader>
          <ItemTitle>{item.name || item.title}</ItemTitle>
          {item.completed !== undefined && (
            <CompletionBadge completed={item.completed}>
              <FontAwesomeIcon icon={faCheck} />
              {item.completed ? 'Done' : 'Todo'}
            </CompletionBadge>
          )}
        </ItemHeader>

        {(item.description || item.exercises || item.duration || item.calories) && (
          <ItemMeta>
            {item.duration && (
              <MetaItem>
                <FontAwesomeIcon icon={faClock} />
                {item.duration}min
              </MetaItem>
            )}
            {item.calories && (
              <MetaItem>
                <FontAwesomeIcon icon={faFire} />
                {item.calories} cal
              </MetaItem>
            )}
            {item.exercises && (
              <MetaItem>
                <FontAwesomeIcon icon={faDumbbell} />
                {item.exercises.length} exercises
              </MetaItem>
            )}
          </ItemMeta>
        )}

        {item.description && (
          <ItemDescription>{item.description}</ItemDescription>
        )}
      </ItemContent>

      {showActions && (
        <ItemActions>
          {onToggleComplete && (
            <ItemActionButton
              variant={item.completed ? "success" : "primary"}
              onClick={() => onToggleComplete(item.id)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title={item.completed ? "Mark as incomplete" : "Mark as complete"}
            >
              <FontAwesomeIcon icon={faCheck} />
            </ItemActionButton>
          )}

          {onToggleVisibility && (
            <ItemActionButton
              variant="warning"
              onClick={() => onToggleVisibility(item.id)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title={item.hidden ? "Show item" : "Hide item"}
            >
              <FontAwesomeIcon icon={item.hidden ? faEyeSlash : faEye} />
            </ItemActionButton>
          )}

          {onDuplicate && (
            <ItemActionButton
              onClick={() => onDuplicate(item.id)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title="Duplicate item"
            >
              <FontAwesomeIcon icon={faCopy} />
            </ItemActionButton>
          )}

          {onEdit && (
            <ItemActionButton
              onClick={() => onEdit(item.id)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title="Edit item"
            >
              <FontAwesomeIcon icon={faEdit} />
            </ItemActionButton>
          )}

          {onDelete && (
            <ItemActionButton
              variant="danger"
              onClick={() => onDelete(item.id)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title="Delete item"
            >
              <FontAwesomeIcon icon={faTrash} />
            </ItemActionButton>
          )}
        </ItemActions>
      )}
    </SortableItemContainer>
  );
};

// Main Drag & Drop Component
export const DragDropList = ({
  items = [],
  onReorder,
  onEdit,
  onDelete,
  onToggleComplete,
  onToggleVisibility,
  onDuplicate,
  onAdd,
  title = "Drag & Drop List",
  showActions = true,
  showAddForm = false,
  emptyMessage = "No items yet. Add some items to get started!",
  emptyIcon = faDumbbell
}) => {
  const [activeId, setActiveId] = useState(null);
  const [showAdd, setShowAdd] = useState(showAddForm);
  const [newItemName, setNewItemName] = useState('');
  const [newItemDescription, setNewItemDescription] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = items.findIndex(item => item.id === active.id);
      const newIndex = items.findIndex(item => item.id === over.id);
      
      const newItems = arrayMove(items, oldIndex, newIndex);
      onReorder?.(newItems);
    }

    setActiveId(null);
  };

  const handleAddItem = () => {
    if (!newItemName.trim()) return;

    const newItem = {
      id: Date.now().toString(),
      name: newItemName,
      description: newItemDescription,
      completed: false,
      hidden: false,
      createdAt: new Date().toISOString()
    };

    onAdd?.(newItem);
    setNewItemName('');
    setNewItemDescription('');
    setShowAdd(false);
  };

  const handleCancelAdd = () => {
    setNewItemName('');
    setNewItemDescription('');
    setShowAdd(false);
  };

  const visibleItems = items.filter(item => !item.hidden);
  const activeItem = items.find(item => item.id === activeId);

  return (
    <DragDropContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <ListHeader>
        <ListTitle>{title}</ListTitle>
        <ListActions>
          {onAdd && (
            <ActionButton
              variant="primary"
              onClick={() => setShowAdd(!showAdd)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              title="Add new item"
            >
              <FontAwesomeIcon icon={showAdd ? faTimes : faPlus} />
            </ActionButton>
          )}
        </ListActions>
      </ListHeader>

      <AnimatePresence>
        {showAdd && (
          <AddItemForm
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <FormInput
              type="text"
              placeholder="Item name..."
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleAddItem();
                }
              }}
            />
            <FormInput
              type="text"
              placeholder="Description (optional)..."
              value={newItemDescription}
              onChange={(e) => setNewItemDescription(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleAddItem();
                }
              }}
            />
            <FormActions>
              <ActionButton onClick={handleCancelAdd}>
                Cancel
              </ActionButton>
              <ActionButton 
                variant="primary" 
                onClick={handleAddItem}
                disabled={!newItemName.trim()}
              >
                Add Item
              </ActionButton>
            </FormActions>
          </AddItemForm>
        )}
      </AnimatePresence>

      {visibleItems.length === 0 ? (
        <EmptyState
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <EmptyIcon>
            <FontAwesomeIcon icon={emptyIcon} />
          </EmptyIcon>
          <p>{emptyMessage}</p>
        </EmptyState>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext 
            items={visibleItems.map(item => item.id)} 
            strategy={verticalListSortingStrategy}
          >
            <AnimatePresence>
              {visibleItems.map((item) => (
                <SortableItem
                  key={item.id}
                  id={item.id}
                  item={item}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onToggleComplete={onToggleComplete}
                  onToggleVisibility={onToggleVisibility}
                  onDuplicate={onDuplicate}
                  showActions={showActions}
                />
              ))}
            </AnimatePresence>
          </SortableContext>

          <DragOverlay>
            {activeItem && (
              <SortableItemContainer isDragging>
                <DragHandle>
                  <FontAwesomeIcon icon={faGripVertical} />
                </DragHandle>
                <ItemContent>
                  <ItemHeader>
                    <ItemTitle>{activeItem.name || activeItem.title}</ItemTitle>
                  </ItemHeader>
                </ItemContent>
              </SortableItemContainer>
            )}
          </DragOverlay>
        </DndContext>
      )}
    </DragDropContainer>
  );
};

// Preset Components for common use cases
export const WorkoutList = ({ workouts, onReorder, ...props }) => (
  <DragDropList
    items={workouts}
    onReorder={onReorder}
    title="Workout Plan"
    emptyMessage="No workouts in your plan. Add some workouts to get started!"
    emptyIcon={faDumbbell}
    {...props}
  />
);

export const ExerciseList = ({ exercises, onReorder, ...props }) => (
  <DragDropList
    items={exercises}
    onReorder={onReorder}
    title="Exercise Order"
    emptyMessage="No exercises added yet. Add some exercises to build your workout!"
    emptyIcon={faDumbbell}
    {...props}
  />
);

export const MealPlanList = ({ meals, onReorder, ...props }) => (
  <DragDropList
    items={meals}
    onReorder={onReorder}
    title="Meal Plan"
    emptyMessage="No meals in your plan. Add some meals to get started!"
    emptyIcon={faUtensils}
    {...props}
  />
);

export default DragDropList;
