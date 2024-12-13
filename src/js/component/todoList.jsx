import React, { useState, useEffect } from "react";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);

  const createUser = async () => {
    await fetch('https://playground.4geeks.com/todo/users/angelgalan', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    fetchTasks();
  };

  const fetchTasks = async () => {
    const response = await fetch('https://playground.4geeks.com/todo/users/angelgalan');
    if (response.ok) {
      console.log('El usuario ya existe');
      const data = await response.json();
      setTasks(data.todos);
    } else {
      console.log('El usuario no existe, creando...');
      createUser();
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async (taskLabel) => {
    await fetch('https://playground.4geeks.com/todo/todos/angelgalan', {
      method: 'POST',
      body: JSON.stringify({
        "label": taskLabel,
        "is_done": false
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then((res) => res.json())
    .then((data) => {
      const updatedTasks = [...tasks, data];
      setTasks(updatedTasks);
    });
  };

  const handleInputKeyPress = (event) => {
    if (event.key === "Enter") {
      const taskInput = event.target.value.trim();
      if (taskInput !== "") {
        addTask(taskInput);
        event.target.value = "";
      } else {
        alert("Por favor ingrese una tarea válida");
      }
    }
  };

  const removeTask = (task) => {
    fetch(`https://playground.4geeks.com/todo/todos/${task.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    setTasks((prevTasks) => prevTasks.filter((t) => t !== task));
  };

  const clearAllTasks = () => {
    fetch('https://playground.4geeks.com/todo/users/angelgalan', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    setTasks([]);
    createUser();
  };

  return (
    <div className="container">
      <h1>Lista de Tareas</h1>
      <div className="list">
        <input
          className="input"
          type="text"
          placeholder="¿Qué necesitas hacer?"
          onKeyDown={handleInputKeyPress}
        />
        <ul>
          {tasks.map((task) => (
            <li key={task.id}>
              {task.label}
              <button
                className="delete"
                onClick={() => removeTask(task)}
              >
                <i className="fa-solid fa-x" />
              </button>
            </li>
          ))}
        </ul>
        <p>
          {tasks.length} {tasks.length === 1 ? "tarea pendiente" : "tareas pendientes"}
        </p>
      </div>
      <button
        type="button"
        className="btn btn-danger"
        onClick={clearAllTasks}
      >
        Eliminar todo
      </button>
    </div>
  );
};

export default TaskList;

















