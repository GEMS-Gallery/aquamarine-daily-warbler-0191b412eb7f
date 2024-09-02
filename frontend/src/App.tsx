import React, { useState, useEffect } from 'react';
import { backend } from 'declarations/backend';
import { ListAlt as ListAltIcon } from '@mui/icons-material';

interface Task {
  id: bigint;
  title: string;
  category: string;
  dueDate: bigint;
  isOverdue: boolean;
}

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const fetchedTasks = await backend.getTasks();
      setTasks(fetchedTasks);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setLoading(false);
    }
  };

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  return (
    <div className="container">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <ListAltIcon className="mr-2" />
        Tasks
      </h2>
      <ul className="task-list">
        {tasks.map((task) => (
          <li key={task.id.toString()} className="task-item">
            <span className="task-name">{task.title}</span>
            <div>
              <span className="category">{task.category}</span>
              <span className={`due-date ${task.isOverdue ? 'overdue' : ''}`}>
                {formatDate(task.dueDate)}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
