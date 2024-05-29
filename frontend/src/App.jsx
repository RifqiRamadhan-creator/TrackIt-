import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [todos, setTodos] = useState([]);
  const [inputText, setInputText] = useState('');
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [dateToday, setDateToday] = useState('');
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    // Get the current date in YYYY-MM-DD formatdf
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    setDateToday(formattedDate);

    // Fetch todos from backend
    axios.get('http://localhost:5000/api/todos') // Using full URL
      .then(response => {
        setTodos(response.data);
      })
      .catch(error => {
        console.error('Error fetching todos:', error);
      });
  }, []);

  const UserInput = (e) => {
    setInputText(e.target.value);
  };

  const AddtoList = () => {
    if (inputText.trim() !== '') {
      const newTodo = { title: inputText, note: '' };
      axios.post('http://localhost:5000/api/todos', newTodo) // Using full URL
        .then(response => {
          setTodos([...todos, response.data]);
          setInputText('');
        })
        .catch(error => {
          console.error('Error adding todo:', error);
        });
    }
  };

  const DeltoList = (id) => {
    axios.delete(`http://localhost:5000/api/todos/${id}`) // Using full URL
      .then(() => {
        setTodos(todos.filter(todo => todo._id !== id));
      })
      .catch(error => {
        console.error('Error deleting todo:', error);
      });
  };

  const expanddetail = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const noteupdate = (index, note) => {
    const newTodos = [...todos];
    newTodos[index].note = note;
    setTodos(newTodos);
  };

  const editperm = (index) => {
    const newTodos = [...todos];
    newTodos[index].isEditing = !newTodos[index].isEditing;
    setEditMode(true);
    setTodos(newTodos);
  };

  const focusup = (index) => {
    const todo = todos[index];
    axios.put(`http://localhost:5000/api/todos/${todo._id}`, todo) // Using full URL
      .then(response => {
        const newTodos = [...todos];
        newTodos[index] = response.data.todo;
        setTodos(newTodos);
        setEditMode(false);
      })
      .catch(error => {
        console.error('Error updating todo:', error);
      });
  };

  return (
    <>
      <style>
        {`
          html, body, #root {
            height: 100%;
            margin: 0;
            background-color: #121212;
            font-family: Arial, sans-serif;
            color: #bd7418; /* Text color changed to #bd7418 */
          }
        `}
      </style>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#121212', color: '#bd7418', fontFamily: 'Arial, sans-serif' }}>
        <nav style={{ backgroundColor: '#0a192f', padding: '1rem', textAlign: 'center', flex: 'none' }}>
          <h2 style={{ margin: '0', fontSize: '1.5rem' }}>Today's Date: {dateToday}</h2>
        </nav>
        <div style={{ flex: '1', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '800px', padding: '2rem', width: '100%' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '2rem', flex: 'none' }}>To-Do List</h1>
            <div style={{ display: 'flex', marginBottom: '1rem', flex: 'none' }}>
              <input
                type="text"
                value={inputText}
                onChange={UserInput}
                onBlur={() => focusup(expandedIndex)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    focusup(expandedIndex);
                  }
                }}
                placeholder="Enter task"
                style={{ flex: '1', marginRight: '1rem', padding: '0.5rem', backgroundColor: '#0a192f', color: '#bd7418', border: '1px solid #4d648d', borderRadius: '0.5rem' }}
              />
              <button onClick={AddtoList} style={{ padding: '0.5rem 1rem', backgroundColor: '#2c3e50', color: '#bd7418', border: 'none', cursor: 'pointer', borderRadius: '0.5rem', flex: 'none' }}>Add</button>
            </div>
            <ul style={{ listStyle: 'none', padding: '0', flex: '1 1 auto', overflowY: 'auto' }}>
              {todos.map((todo, index) => (
                <li key={todo._id} style={{ height: 'auto', minHeight: '3rem', marginBottom: '0.5rem', backgroundColor: '#0a192f', padding: '1rem', borderRadius: '0.5rem', cursor: 'pointer', position: 'relative', flex: 'none' }} onClick={() => expanddetail(index)}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>{todo.title}</span>
                    <div>
                      <button onClick={(e) => { e.stopPropagation(); DeltoList(todo._id) }} style={{ backgroundColor: '#2c3e50', color: '#bd7418', border: 'none', cursor: 'pointer', padding: '0.3rem 0.5rem', borderRadius: '0.3rem', marginRight: '0.5rem' }}>Delete</button>
                      <button onClick={(e) => { e.stopPropagation(); editperm(index) }} style={{ backgroundColor: '#2c3e50', color: '#bd7418', border: 'none', cursor: 'pointer', padding: '0.3rem 0.5rem', borderRadius: '0.3rem' }}>{editMode ? 'Save' : 'Edit'}</button>
                    </div>
                  </div>
                  {expandedIndex === index && (
                    <div style={{ marginTop: '1rem' }}>
                      {editMode ? (
                        <input
                          autoFocus
                          value={todo.note}
                          onChange={(e) => noteupdate(index, e.target.value)}
                          onBlur={() => focusup(index)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              focusup(index);
                            }
                          }}
                          placeholder="Add detailed note..."
                          style={{ width: '100%', padding: '0.5rem', border: '1px solid #4d648d', borderRadius: '0.5rem', backgroundColor: '#0a192f', color: '#bd7418' }}
                        />
                      ) : (
                        <div style={{ backgroundColor: '#1e2a47', padding: '0.5rem', borderRadius: '0.5rem', color: '#bd7418' }}>{todo.note}</div>
                      )}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;

