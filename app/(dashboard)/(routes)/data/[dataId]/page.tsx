import prismadb from '@/lib/prismadb'
import { auth } from '@clerk/nextjs/server';
import DataForm from './components/data-form';

const DataPage = async ({
  params
}: {
  params: {dataId : string}
}) => {
  const { userId } = auth();

  if (!userId) {
    return (
      <div className="p-8 pt-6">
        <p>You must be logged in!</p>
      </div>
    );
  }

  let data = null;

  if(params.dataId !== "new") {
     data = await prismadb.data.findUnique({
      where: {
        id: params.dataId
      }
    });
  } 

  const ports = await prismadb.port.findMany();

  return (
    <div className='flex-col'>
      <div className=' flex-1 space-y-4 p-8 pt-6'>
        <DataForm initialData={data} ports={ports}/>
      </div>
    </div>
  )
}

export default DataPage
