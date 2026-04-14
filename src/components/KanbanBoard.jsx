import React from "react";
import {
  DragDropContext,
  Droppable,
  Draggable
} from "@hello-pangea/dnd";

function KanbanBoard({ tasks, setTasks }) {

  const columns = {
    Pending: tasks.filter(t => t.status === "Pending"),
    Completed: tasks.filter(t => t.status === "Completed")
  };

  const onDragEnd = (result) => {

    if (!result.destination) return;

    const taskId = result.draggableId;
    const newStatus = result.destination.droppableId;

    const updated = tasks.map(task =>
      task.id === taskId
        ? { ...task, status: newStatus }
        : task
    );
    setTasks(updated);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>

      <div className="kanban-board">

        {Object.keys(columns).map(status => (

          <Droppable droppableId={status} key={status}>

            {(provided) => (
              <div
                className="kanban-column glass-card"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >

                <h3>{status}</h3>

                {columns[status].map((task, index) => (

                  <Draggable
                    key={task.id}
                    draggableId={task.id}
                    index={index}
                  >

                    {(provided) => (

                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="kanban-task"
                      >

                        <h4>{task.title}</h4>
                        <p>{task.priority}</p>

                      </div>

                    )}

                  </Draggable>

                ))}

                {provided.placeholder}

              </div>
            )}

          </Droppable>

        ))}

      </div>

    </DragDropContext>
  );
}

export default KanbanBoard;