import React from 'react';
import './App.css';
import Form from './components/Form/Form'
import Navbar from './components/Navbar/Navbar';
import Result from './components/Result/Result';

export function App() {
  return (
    <main className="d-flex flex-column gap-3">
      <Navbar/>
      <section className='container d-flex flex-column justify-content-center align-items-center gap-3'>
        <Form/>
        <Result/>
      </section>
    </main>
  );
}
