import React from 'react';


import UserCrud from './modules/user/UserCrud.jsx';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Sistema de Gestión de Usuarios (SGU)</h1>
      </header>
      <main>
        
        <UserCrud />
      </main>
    </div>
  );
}

export default App;