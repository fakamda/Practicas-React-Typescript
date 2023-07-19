import { useEffect, useState } from 'react'
import './App.css'
import { UsersList } from './components/UsersList'

function App () {
    const [users, setUsers] = useState([])
    const [showColors, setShowColors] = useState(false)

    const toggleColors = () => {
        setShowColors(!showColors)
    }

    useEffect (() => {
        fetch('https://randomuser.me/api/?results=100')
        .then(res => res.json())
        .then(res => {
            setUsers(res.results)
        })
        .catch(err => {
            console.error(err)
        })
    }, [])
    
    return (
        <div className='App'>
            <h1>Prueba Tecnica</h1>
            <header>
                <button onClick={toggleColors}>
                    Colorear filas
                </button>
            </header>
            <main>
                <UsersList showColors={showColors} users={users} />
            </main>
        </div>
    )
}

export default App
