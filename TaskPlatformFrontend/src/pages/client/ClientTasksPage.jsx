import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { clientTaskService } from '../../services/taskService';

export const ClientTasksPage = () => {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    if (user?.id) {
      clientTaskService.getTasksByClientId(user.id).then(response => {
        setTasks(response.data);
      });
    }
  }, [user]);

  return (
    <div>
      <h2>My Tasks</h2>
      {tasks.map(task => (
        <div key={task.id}>
          <h4>{task.title}</h4>
          <p>{task.description}</p>
          <p>Status: {task.status}</p>
          <Link to={`/client/task/${task.id}/milestones`}>Manage Milestones</Link>
        </div>
      ))}
    </div>
  );
};