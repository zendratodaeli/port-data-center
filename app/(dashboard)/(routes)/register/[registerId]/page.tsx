import prismadb from '@/lib/prismadb'
import PasswordForm from './components/password-form'

const PasswordPage = async ({
  params
}: {
  params: {registerId : string}
}) => {

  let password = null;

  if (params.registerId !== "new") {
     password = await prismadb.password.findUnique({
      where: {
        id: params.registerId
      }
    })
  }

  return (
    <div className='flex-col'>
      <div className=' flex-1 space-y-4 p-8 pt-6'>
        <PasswordForm initialData={password}/>
      </div>
    </div>
  )
}

export default PasswordPage
