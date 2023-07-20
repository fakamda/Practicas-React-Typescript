import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'
import { UsersList } from './components/UsersList'
import { SortBy, type User } from './types.d'

function App () {
    const [users, setUsers] = useState<User[]>([])
    const [showColors, setShowColors] = useState(false)
    const [sorting, setSorting] = useState<SortBy>(SortBy.NONE)
    const originalUsers = useRef<User[]>([]) // use ref para guardar un valor que queremos que se comparta entre renders pero al cambiar no vuelva a renderizar el componente
    const [filterCountry, setFilterCountry] = useState<string | null>(null)

    const toggleColors = () => {
        setShowColors(!showColors)
    }

    const toggleSortByCountry = () => {
       const newSortingValue = sorting === SortBy.NONE ? SortBy.COUNTRY : SortBy.NONE
        setSorting(newSortingValue)
    }

    const handleReset = () => {
        setUsers(originalUsers.current)
    }

    const handleDelete = (email: string) => {
        const filteredUsers = users.filter((user) => user.email !== email)
        setUsers(filteredUsers)
      }

      const handleChangeSort = (sort: SortBy) => {
        setSorting(sort)
      }



    useEffect (() => {
        fetch('https://randomuser.me/api/?results=100')
        .then(res => res.json())
        .then(res => {
            setUsers(res.results)
            originalUsers.current = res.results
        })
        .catch(err => {
            console.error(err)
        })
    }, [])



    const filteredUsers = useMemo(() => {
        console.log('calculate filteredUsers')
      return typeof filterCountry === 'string' && filterCountry.length > 0
    ? users.filter((user => {
        return user.location.country.toLowerCase().includes(filterCountry.toLowerCase()) // pasamos a lowercase para que lo tome con  o sin mayus
    }))
    : users
    }, [users, filterCountry]) 


    const sortedUsers = useMemo(() => {
        console.log('calculate sortedUsers')
    
        if (sorting === SortBy.NONE) return filteredUsers
    
        const compareProperties: Record<string, (user: User) => any> = {
          [SortBy.COUNTRY]: user => user.location.country,
          [SortBy.NAME]: user => user.name.first,
          [SortBy.LAST]: user => user.name.last
        }
    
        return filteredUsers.toSorted((a, b) => {
          const extractProperty = compareProperties[sorting]
          return extractProperty(a).localeCompare(extractProperty(b))
        })
      }, [filteredUsers, sorting])

        // const sortedUsers = sortByCountry 
    // ? [...users].sort((a, b) => {
    //   return a.location.country.localeCompare(b.location.country)  // primera solucion copiamos el array viejo para que no lo reemplace
    // })
    // : users


    

    return (
        <div className='App'>
            <h1>Prueba Tecnica</h1>
            <header>

                <button onClick={toggleColors}>
                    Colorear filas
                </button>

                <button onClick={toggleSortByCountry}>
                    {sorting === SortBy.COUNTRY ? 'No ordenar por pais' : 'Ordenar por pais'}
                </button>

                <button onClick={handleReset}>
                    Resetear Estado
                </button>

                <input placeholder='Filtrar por pais' onChange={(e) => {
                    setFilterCountry(e.target.value)
                }} />

            </header>
            <main>
                <UsersList changeSorting={handleChangeSort} deleteUser={handleDelete} showColors={showColors} users={sortedUsers} />
            </main>
        </div>
    )
}

export default App
