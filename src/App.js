import logo from './logo.svg';
import './App.css';
import "@aws-amplify/ui-react/styles.css";
import {
  withAuthenticator,
  Button,
  Heading,
  Image,
  View,
  Card,
} from "@aws-amplify/ui-react";
import { useEffect, useState } from 'react';
import { listTodos } from './graphql/queries';
import { createTodo as createTodoMutation, updateTodo } from './graphql/mutations';
import { API, graphqlOperation } from 'aws-amplify';

function App({signOut}) {
  const [todos, setTodos] = useState([]);
  const [todo, setTodo] = useState({name: '', description: ''});

  useEffect(() => {
    fetchTodos();
  }, [])

  const onFormChange = (e) => {
    setTodo({...todo, [e.target.name]: e.target.value})
  }

  async function fetchTodos() {
    const apiData = await API.graphql({ query: listTodos });
    const notesFromAPI = apiData.data.listTodos.items;
    setTodos(notesFromAPI);
  }

  async function createTodo(event) {
    event.preventDefault();
    console.log(todo);
    const data = {...todo, isDone: false};
    await API.graphql({
      query: createTodoMutation,
      variables: { input: data },
    });
    fetchTodos();
    event.target.reset();
  }

  const markAsDone = async (todo) => {
    const newTodo = {id: todo.id, name: todo.name, description: todo.description, isDone: !todo.isDone};
    console.log(newTodo);
    const result = await API.graphql({
      query: updateTodo,
      variables: { input: newTodo },
    });
    console.log(result);
    fetchTodos();
  }

  return (
    <div className="App">
      <h1>My Site</h1>
      <form onSubmit={createTodo}>
        <input onChange={onFormChange} name="name" value={todo.name} />
        <input onChange={onFormChange} name="description" value={todo.description} />
        <button>Submit</button>
      </form>
      {todos.map((todo, index) => (
        <div onClick={() => markAsDone(todo)} style={{textDecoration: todo.isDone ? 'line-through' : '', cursor: 'pointer'}} key={index}>{todo.name} - {todo.description}</div>
      ))}
      <Button onClick={signOut}>Sign Out Now</Button>
    </div>
  );
}

export default withAuthenticator(App);
