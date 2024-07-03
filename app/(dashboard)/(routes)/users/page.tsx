import { getUsers } from '@/actions/users'
import UsersTable from '@/components/users-table'
import React from 'react'

const UsersPage = async () => {
  const users = await getUsers()||[];

  return (
    <div className=' p-8'>
      <UsersTable users={users}/>
    </div>
  )
}

export default UsersPage
