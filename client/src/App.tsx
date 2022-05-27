import React, {FC, useEffect, useContext, useState} from 'react'
import { Context } from './index'
import LoginForm from './components/LoginForm'
import { observer } from 'mobx-react-lite'
import { IUser } from './models/IUser'
import UserService from './services/UserService'
const App: FC = () => {
  const {store} = useContext(Context)
  const [users, setUsers] = useState<IUser[]>([])
  useEffect(() => {
    if(localStorage.getItem('token')){
      store.checkAuth()
      
    }
  }, [])

  async function getUsers() {
    try {
        const response = await UserService.fetchUsers()
        setUsers(response.data)
    } catch (e) {
        console.log(e);
        
    }
  }

  if(store.isLoading){
    return (
      <h1>Загрузка...</h1>
    )
  }

  if(!store.isAuth) {
    return (
      <LoginForm/>

    )
  }

  return (
    <div>
      <h1>{store.isAuth ? store.user.email : 'АВТОЗИРУЙТЕСЬ'} </h1>
      <h1>{store.user.isActivated? 'Аккаунт подтвержден': 'ПОДТВЕРДИТЕ АККАУНТ'}</h1>
      <button onClick={() => store.logout()}>Выйти</button>
      <div>
        <button onClick = {getUsers}>Получить пользователей</button>
      </div>
      {users.map(user =>(
        <div key= {user.email} >{user.email}</div>
      ))}
    </div>
  )
}

export default observer(App)
